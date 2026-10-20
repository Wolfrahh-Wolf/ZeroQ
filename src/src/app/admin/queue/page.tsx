// Phase 5 — Admin Live Queue & Fulfillment Dashboard (FHD Desktop Enterprise Dashboard & Mobile View)
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  ChevronRight,
  Clock,
  RefreshCw,
  Search,
  ShieldCheck,
  ChefHat,
  BellRing,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Utensils
} from "lucide-react";
import type { Order } from "@/lib/types";

const POLL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? 3000);
type FilterTab = "ALL" | "ORDERED" | "READY" | "DELIVERED";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

export default function AdminQueuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [quickId, setQuickId] = useState("");
  const [quickMsg, setQuickMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data: Order[] = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
        setLastPoll(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    intervalRef.current = setInterval(fetchOrders, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchOrders]);

  async function updateStatus(orderId: string, status: "READY" | "DELIVERED") {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchOrders();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  async function quickDeliver() {
    const id = quickId.trim().toUpperCase();
    if (!id) return;
    setUpdating(id);
    setQuickMsg(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuickMsg({ text: `✓ Token ${id} marked as Delivered`, ok: true });
      setQuickId("");
      await fetchOrders();
    } catch (e: unknown) {
      setQuickMsg({ text: e instanceof Error ? e.message : "Failed", ok: false });
    } finally {
      setUpdating(null);
    }
  }

  const TABS: FilterTab[] = ["ALL", "ORDERED", "READY", "DELIVERED"];
  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    ALL: orders.length,
    ORDERED: orders.filter((o) => o.status === "ORDERED").length,
    READY: orders.filter((o) => o.status === "READY").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Kitchen &amp; Counter Queue</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot inline-block" />
              <span>Live Fulfillment Stream • {lastPoll ? `Updated ${formatTime(lastPoll.toISOString())}` : "Connecting…"}</span>
            </p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          id="refresh-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-card hover:bg-white/10 transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Metric Cards (FHD Desktop 4-column row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 fade-in">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Pre-orders</span>
            <Utensils size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{counts.ALL}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all canteen outlets</div>
        </div>

        <div className="glass-card p-5 border-amber-500/25 bg-amber-500/[0.04]">
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Preparing (Cooking)</span>
            <ChefHat size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">{counts.ORDERED}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Pending kitchen pickup</div>
        </div>

        <div className="glass-card p-5 border-emerald-500/25 bg-emerald-500/[0.04]">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Ready for Counter</span>
            <BellRing size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-300">{counts.READY}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Waiting student pickup</div>
        </div>

        <div className="glass-card p-5 border-indigo-500/25 bg-indigo-500/[0.04]">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Fulfilled Revenue</span>
            <DollarSign size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">₹{totalRevenue}</div>
          <div className="text-[11px] text-indigo-300 mt-1">{counts.DELIVERED} orders delivered</div>
        </div>
      </div>

      {/* Quick Deliver & Filter Control Bar */}
      <div className="glass-card p-5 mb-8 fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick Deliver Input */}
          <div className="flex-1 max-w-xl">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <CheckCheck size={14} className="text-emerald-400" />
              <span>Quick Deliver Counter Scanner</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5 bg-black/40 border border-white/10 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Search size={15} className="text-slate-500" />
                <input
                  id="quick-deliver-input"
                  type="text"
                  value={quickId}
                  onChange={(e) => setQuickId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && quickDeliver()}
                  placeholder="Enter token e.g. ZQ-0001"
                  className="flex-1 bg-transparent outline-none text-slate-100 text-sm placeholder-slate-500 uppercase"
                />
              </div>
              <button
                id="quick-deliver-btn"
                onClick={quickDeliver}
                disabled={!!updating}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/30 whitespace-nowrap"
              >
                Mark Delivered
              </button>
            </div>
            {quickMsg && (
              <p className={`text-xs mt-2 font-medium ${quickMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
                {quickMsg.text}
              </p>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap self-start lg:self-end">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`filter-${tab.toLowerCase()}`}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                    : "glass-card text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Data Table (Desktop FHD View) */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card h-20 shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center fade-in">
          <Clock size={40} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No {filter !== "ALL" ? filter : ""} Orders</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Incoming pre-orders will appear here in real-time.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= md screens) */}
          <div className="hidden md:block glass-card overflow-hidden fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Token</th>
                  <th className="py-4 px-4">Time</th>
                  <th className="py-4 px-4">Outlet</th>
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((order) => {
                  return (
                    <tr key={order.order_id} className="hover:bg-white/[0.03] transition-colors">
                      {/* Order Token */}
                      <td className="py-4 px-6 font-mono font-bold text-white text-base">
                        {order.order_id}
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {formatTime(order.created_at)}
                      </td>

                      {/* Outlet */}
                      <td className="py-4 px-4">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                          {order.outlet_name}
                        </span>
                      </td>

                      {/* Student */}
                      <td className="py-4 px-4 font-medium text-slate-200">
                        {order.student_name}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-bold text-slate-100">
                        ₹{order.total_amount}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`badge-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {order.status === "ORDERED" && (
                          <button
                            id={`order-ready-${order.order_id}`}
                            onClick={() => updateStatus(order.order_id, "READY")}
                            disabled={updating === order.order_id}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-md shadow-amber-600/30 disabled:opacity-50"
                          >
                            {updating === order.order_id ? "Updating..." : "Mark Ready"}
                          </button>
                        )}
                        {order.status === "READY" && (
                          <button
                            id={`order-deliver-${order.order_id}`}
                            onClick={() => updateStatus(order.order_id, "DELIVERED")}
                            disabled={updating === order.order_id}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
                          >
                            {updating === order.order_id ? "Updating..." : "Mark Delivered"}
                          </button>
                        )}
                        {order.status === "DELIVERED" && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                            <CheckCircle2 size={14} className="text-indigo-400" />
                            <span>Fulfilled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< md screens) */}
          <div className="md:hidden space-y-4 fade-in">
            {filtered.map((order) => (
              <div key={order.order_id} className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-lg">{order.order_id}</span>
                  <span className={`badge-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>{order.outlet_name} • {order.student_name}</span>
                  <span className="font-bold text-slate-200">₹{order.total_amount}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-end">
                  {order.status === "ORDERED" && (
                    <button
                      onClick={() => updateStatus(order.order_id, "READY")}
                      disabled={updating === order.order_id}
                      className="w-full py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === "READY" && (
                    <button
                      onClick={() => updateStatus(order.order_id, "DELIVERED")}
                      disabled={updating === order.order_id}
                      className="w-full py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
