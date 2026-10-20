// Phase 3 — Cart & Mock Instant Checkout (FHD Desktop 2-Column & Mobile Optimized)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, User, Zap, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, totalItems, totalAmount } = useCart();
  const [studentName, setStudentName] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!studentName.trim()) {
      setError("Please enter your name to identify your order at the counter.");
      return;
    }
    if (!state.items.length) {
      setError("Your cart is empty.");
      return;
    }
    setError("");
    setPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outletId: state.outletId,
          studentName: studentName.trim(),
          totalAmount,
          items: state.items.map((i) => ({
            itemId: i.item_id,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      dispatch({ type: "CLEAR" });
      router.push(`/student/track/${data.orderId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (!state.items.length && !placing) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-6 text-slate-500">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Your tray is empty</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Looks like you haven&apos;t added any food to your tray yet. Choose your favorite dishes and order on the way.
        </p>
        <Link
          href="/student/outlets"
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
        >
          Browse Outlets &amp; Menus
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-8 fade-in">
        <Link
          href={state.outletId ? `/student/menu/${state.outletId}` : "/student/outlets"}
          className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Review &amp; Checkout</h1>
          <p className="text-sm text-slate-400">
            {state.outletName ? `Pre-ordering from ${state.outletName}` : "Campus Canteen"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 fade-in">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 fade-in">
        {/* Left 7 cols: Items Review */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Order Items ({totalItems})
              </h2>
              <Link
                href={state.outletId ? `/student/menu/${state.outletId}` : "/student/outlets"}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                + Add more items
              </Link>
            </div>

            <div className="divide-y divide-white/5 space-y-3">
              {state.items.map((item) => (
                <div key={item.item_id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">₹{item.price} each</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                      <button
                        id={`checkout-dec-${item.item_id}`}
                        onClick={() => {
                          if (item.quantity <= 1) dispatch({ type: "REMOVE", itemId: item.item_id });
                          else dispatch({ type: "DECREMENT", itemId: item.item_id });
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button
                        id={`checkout-inc-${item.item_id}`}
                        onClick={() => dispatch({ type: "INCREMENT", itemId: item.item_id })}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="w-16 text-right font-bold text-sm text-slate-100">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Instructions info pill */}
          <div className="glass-card p-5 flex items-start gap-3.5 bg-indigo-500/[0.04] border-indigo-500/20">
            <Zap size={20} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-indigo-300 font-semibold block mb-0.5">Express Counter Pickup</strong>
              Orders are prepared in real-time. Simply head to the pickup counter and present your <code className="text-indigo-300 font-bold">ZQ-XXXX</code> order token when ready.
            </div>
          </div>
        </div>

        {/* Right 5 cols: Student Details & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
              Student Details
            </h2>

            <div className="mb-6">
              <label htmlFor="student-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Your Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-black/40 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <User size={18} className="text-slate-500" />
                <input
                  id="student-name-input"
                  type="text"
                  placeholder="e.g. John Doe / Roll 42"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-transparent text-sm text-slate-100 outline-none w-full placeholder-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Staff will call your name or order token at the pickup counter.
              </p>
            </div>

            {/* Bill Summary */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-sm">
              <div className="flex justify-between text-slate-400 text-xs sm:text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-slate-200 font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs sm:text-sm">
                <span>Pre-order Platform Fee</span>
                <span className="text-emerald-400 font-semibold">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs sm:text-sm">
                <span>Estimated Prep Time</span>
                <span className="text-slate-200 font-medium">~10 mins</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-base font-bold text-slate-200">Total Payable</span>
                <span className="text-2xl font-extrabold text-white">₹{totalAmount}</span>
              </div>
            </div>

            {/* Mock Payment Callout */}
            <div className="my-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck size={16} className="flex-shrink-0" />
              <span>Mock Payment enabled. No card required. Order is placed instantly.</span>
            </div>

            {/* Pay Now Button */}
            <button
              id="pay-now-btn"
              onClick={handlePay}
              disabled={placing}
              className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
            >
              {placing ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Pay Now &amp; Confirm (₹{totalAmount})</span>
                  <Zap size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
