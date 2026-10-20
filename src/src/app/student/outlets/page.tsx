// Phase 2 — Outlet Selection Page (FHD Desktop & Mobile Optimized)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChefHat, MapPin, Clock, Sparkles, ArrowRight, Store } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Outlet } from "@/lib/types";

const OUTLET_METADATA: Record<string, {
  icon: string;
  badge: string;
  prepTime: string;
  cuisines: string[];
  gradient: string;
  borderColor: string;
  textColor: string;
}> = {
  MC: {
    icon: "🍽️",
    badge: "Ground Floor • Central Block",
    prepTime: "8–12 min prep",
    cuisines: ["Thalis", "Biryani", "Dosa & Idli", "Chai & Snacks"],
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)",
    borderColor: "rgba(99,102,241,0.35)",
    textColor: "#a5b4fc",
  },
  "Rishab Food Court": {
    icon: "🥘",
    badge: "2nd Floor • Student Activity Center",
    prepTime: "10–15 min prep",
    cuisines: ["North Indian", "Shawarma & Burgers", "Chinese", "Desserts"],
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.08) 100%)",
    borderColor: "rgba(245,158,11,0.35)",
    textColor: "#fcd34d",
  },
};

export default function OutletsPage() {
  const router = useRouter();
  const { dispatch } = useCart();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutlets = () => {
    setLoading(true);
    fetch("/api/outlets")
      .then((r) => r.json())
      .then((data) => setOutlets(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  function selectOutlet(outlet: Outlet) {
    dispatch({ type: "SET_OUTLET", outletId: outlet.outlet_id, outletName: outlet.name });
    router.push(`/student/menu/${outlet.outlet_id}`);
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto flex flex-col justify-start">
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between mb-8 fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          <span>2 Outlets Open Now</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-12 fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Store size={26} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Select Canteen Outlet
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Choose your pickup counter. Order ahead so your meal is ready the moment you reach.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card h-72 shimmer" />
          ))}
        </div>
      ) : outlets.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 fade-in">
          <ChefHat size={40} className="text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-300">No active outlets found</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Unable to connect to the canteen database. Please check your network or try reconnecting.
          </p>
          <button
            onClick={fetchOutlets}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        /* Outlets 2-column Grid for PC FHD */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
          {outlets.map((outlet) => {
            const meta = OUTLET_METADATA[outlet.name] ?? {
              icon: "🍴",
              badge: "Campus Canteen",
              prepTime: "10 min prep",
              cuisines: ["Meals", "Snacks", "Beverages"],
              gradient: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              borderColor: "rgba(255,255,255,0.15)",
              textColor: "#94a3b8",
            };

            return (
              <div
                key={outlet.outlet_id}
                id={`outlet-${outlet.outlet_id}`}
                onClick={() => selectOutlet(outlet)}
                className="glass-card glass-card-interactive p-8 sm:p-9 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                style={{
                  background: meta.gradient,
                  borderColor: meta.borderColor,
                }}
              >
                <div>
                  {/* Top row with icon & prep badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg bg-black/30 border border-white/10">
                      {meta.icon}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 bg-black/40 border border-white/10">
                      <Clock size={13} className="text-indigo-400" />
                      <span>{meta.prepTime}</span>
                    </div>
                  </div>

                  {/* Outlet details */}
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: meta.textColor }}>
                    {meta.badge}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 group-hover:text-white transition-colors mb-3">
                    {outlet.name}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {outlet.description}
                  </p>

                  {/* Cuisines tag cloud */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {meta.cuisines.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white flex items-center justify-between transition-all bg-white/10 group-hover:bg-indigo-600 shadow-md">
                  <span>View Menu &amp; Order</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
