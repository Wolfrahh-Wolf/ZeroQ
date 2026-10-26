"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toaster";
import { LoaderCircle, LockKeyhole } from "lucide-react";

interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string };
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpayCheckoutResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
}

interface RazorpayCheckout {
  open: () => void;
  on: (event: "payment.failed", callback: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

const createOrderResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ razorpayOrderId: z.string(), amount: z.number(), currency: z.string(), orderId: z.string() }).optional(),
  error: z.string().optional(),
});

const verifyPaymentResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ billId: z.string(), orderId: z.string() }).optional(),
  error: z.string().optional(),
});

let checkoutScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  if (checkoutScriptPromise) return checkoutScriptPromise;

  const scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    const script = existing ?? document.createElement("script");
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    if (!existing) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });
  checkoutScriptPromise = scriptPromise.finally(() => {
    checkoutScriptPromise = null;
  });
  return scriptPromise;
}

async function readJson(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

export function CheckoutButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, outletId, outletName, total, clearCart, closeCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  async function beginCheckout() {
    if (!outletId || items.length === 0 || isProcessing) return;
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!publicKey) {
      showToast({ title: "Checkout unavailable", description: "Online payment is not configured.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const createResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outletId, items: items.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })) }),
      });
      const created = createOrderResponseSchema.safeParse(await readJson(createResponse));
      if (!createResponse.ok || !created.success || !created.data.success || !created.data.data) {
        throw new Error(created.success ? created.data.error ?? "Unable to start checkout." : "Unable to start checkout.");
      }
      const order = created.data.data;
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error("Unable to load secure checkout. Please try again.");

      let paymentResponseReceived = false;
      const checkout = new window.Razorpay({
        key: publicKey,
        amount: order.amount,
        currency: order.currency,
        name: "ZeroQ",
        description: `${outletName ?? "Campus outlet"} order`,
        order_id: order.razorpayOrderId,
        prefill: { name: session?.user.name ?? "", email: session?.user.email ?? "" },
        theme: { color: "#0078D4" },
        handler: async (payment) => {
          paymentResponseReceived = true;
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...payment, orderId: order.orderId }),
            });
            const verified = verifyPaymentResponseSchema.safeParse(await readJson(verifyResponse));
            if (!verifyResponse.ok || !verified.success || !verified.data.success || !verified.data.data) {
              throw new Error(verified.success ? verified.data.error ?? "Payment could not be confirmed." : "Payment could not be confirmed.");
            }
            clearCart();
            closeCart();
            showToast({ title: "Payment successful", description: `Your order is confirmed. Bill ID ${verified.data.data.billId}` });
            router.push("/dashboard/orders");
          } catch (error) {
            showToast({ title: "Payment could not be confirmed", description: error instanceof Error && error.message ? error.message : "Please contact support before trying again.", variant: "destructive" });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => {
          setIsProcessing(false);
          if (!paymentResponseReceived) showToast({ title: "Checkout closed", description: "No payment was confirmed. Your cart is still saved." });
        } },
      });
      checkout.on("payment.failed", () => {
        paymentResponseReceived = true;
        setIsProcessing(false);
        showToast({ title: "Payment failed", description: "No order was confirmed. You can try checkout again.", variant: "destructive" });
      });
      checkout.open();
    } catch (error) {
      setIsProcessing(false);
      showToast({ title: "Unable to start checkout", description: error instanceof Error && error.message ? error.message : "Please try again shortly.", variant: "destructive" });
    }
  }

  return <>
    <Button type="button" className="w-full" onClick={beginCheckout} disabled={items.length === 0 || !outletId || isProcessing}>
      {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
      {isProcessing ? "Opening secure checkout…" : `Proceed to payment · ₹${total.toFixed(2)}`}
    </Button>
    <p className="mt-2 text-center text-xs text-fluent-text-secondary">Payments are verified securely before your order is confirmed.</p>
  </>;
}
