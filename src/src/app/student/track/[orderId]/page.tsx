// Phase 4 — Student Order Tracking View (FHD Desktop & Mobile Optimized)
"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, Home, Package, Sparkles, ChefHat, Store, ArrowRight, BellRing } from "lucide-react";
import type { OrderWithItems } from "@/lib/types";

const POLL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? 3000);
const STATUS_STEPS = ["ORDERED", "READY", "DELIVERED"] as const;

export default function TrackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [error, setError] = useState("");
  const [showReady, setShowReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        setError("Order not found.");
        return;
      }
      const data: OrderWithItems = await res.json();
      setOrder((prev) => {
        if (prev && prev.status !== data.status && data.status === "READY") {
          setShowReady(true);
        } else if (!prev && data.status === "READY") {
          setShowReady(true);
        }
        return data;
      });

      // If delivered, stop aggressive polling
      if (data.status === "DELIVERED" && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } catch {
      setError("Could not reach server. Retrying…");
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchOrder]);

  if (error && !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4 text-slate-500">
          <Package size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-200 mb-2">Order Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Return to Home
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-3 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Connecting to live order tracker…</p>
      </main>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30">
          <span className="w-2 h-2 rounded-full bg-indigo-400 pulse-dot" />
          <span>Live Tracking Active • Polling every 3s</span>
        </div>
      </div>

      {/* Hero Token Card */}
      <div className="glass-card p-8 sm:p-10 mb-8 text-center fade-in relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-2">
          Your Pickup Order Token
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-3">
          {order.order_id}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {order.outlet_name} • Placed for <strong className="text-slate-200">{order.student_name}</strong>
        </p>

        {/* Status Stage Callout */}
        <div className="mt-8 pt-8 border-t border-white/10 max-w-2xl mx-auto">
          {/* Progress Timeline */}
          <div className="flex items-center justify-between relative mb-8 px-4">
            {/* Background connection bar */}
            <div className="absolute left-10 right-10 top-5 h-1 bg-white/10 -z-0" />
            <div
              className="absolute left-10 top-5 h-1 bg-indigo-500 transition-all duration-700 -z-0"
              style={{
                width: currentIdx === 0 ? "0%" : currentIdx === 1 ? "50%" : "calc(100% - 5rem)",
              }}
            />

            {/* Step 1: ORDERED */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentIdx >= 0
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                <ChefHat size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Ordered</span>
            </div>

            {/* Step 2: READY */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentIdx >= 1
                    ? "bg-emerald-500 text-white ring-4 ring-emerald-500/25 shadow-lg shadow-emerald-500/40"
                    : "bg-slate-800 text-slate-500 border border-white/10"
                }`}
              >
                <BellRing size={18} />
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  currentIdx >= 1 ? "text-emerald-400 font-bold" : "text-slate-500"
                }`}
              >
                Ready
              </span>
            </div>

            {/* Step 3: DELIVERED */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentIdx >= 2
                    ? "bg-indigo-500 text-white ring-4 ring-indigo-500/20"
                    : "bg-slate-800 text-slate-500 border border-white/10"
                }`}
              >
                <CheckCircle2 size={18} />
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  currentIdx >= 2 ? "text-indigo-400 font-bold" : "text-slate-500"
                }`}
              >
                Delivered
              </span>
            </div>
          </div>

          {/* Dynamic Status Notification Alert */}
          {order.status === "ORDERED" && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm flex items-center justify-center gap-3">
              <Clock size={18} className="animate-spin text-amber-400" />
              <span>Canteen staff is preparing your order. Keep walking towards the counter.</span>
            </div>
          )}

          {order.status === "READY" && (
            <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 animate-bounce">
              <Sparkles size={22} className="text-emerald-400 flex-shrink-0" />
              <span className="font-bold">
                Your order is ready! Head to the {order.outlet_name} counter and show token {order.order_id}.
              </span>
            </div>
          )}

          {order.status === "DELIVERED" && (
            <div className="p-4 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm flex items-center justify-center gap-3">
              <CheckCircle2 size={18} className="text-indigo-400" />
              <span>Order collected! Enjoy your meal. Thanks for using ZeroQ!</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Desktop Grid for Order Receipt & Counter Directions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
        {/* Left: Ordered Items Receipt */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-white/10">
            Receipt Summary
          </h2>

          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div key={item.order_item_id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-slate-200">{item.item_name}</span>
                  <span className="text-xs text-slate-400 ml-2">× {item.quantity}</span>
                </div>
                <span className="font-bold text-slate-300">₹{item.unit_price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-400">Total Paid</span>
            <span className="text-xl font-bold text-white">₹{order.total_amount}</span>
          </div>
        </div>

        {/* Right: Counter Instructions */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-white/10">
              Pickup Instructions
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <Store size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Locate the dedicated ZeroQ Express Counter at <strong>{order.outlet_name}</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Show Order ID <strong>{order.order_id}</strong> on your screen to the staff member.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Staff will confirm and hand over your meal tray immediately. Zero waiting.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              href="/student/outlets"
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white glass-card flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
            >
              <span>Order Another Meal</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
