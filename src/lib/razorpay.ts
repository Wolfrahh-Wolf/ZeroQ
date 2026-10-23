import Razorpay from "razorpay";

/**
 * Razorpay Server-Side Client Singleton
 *
 * Used exclusively in server-side API routes:
 *   - POST /api/orders         → razorpay.orders.create(...)
 *   - POST /api/payment/verify → HMAC-SHA256 signature verification
 *
 * IMPORTANT: Never import or expose this module to client components.
 * The RAZORPAY_KEY_SECRET must remain server-side only.
 *
 * Usage:
 *   import { razorpay } from "@/lib/razorpay"
 */

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured.");
  }
  razorpayClient ??= new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}
