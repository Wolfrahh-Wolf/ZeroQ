// Phase 1 — Role Selection Landing Page (Desktop FHD & Mobile Optimized)
import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, Clock, Sparkles, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 max-w-6xl mx-auto">
      {/* Top pill badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-8 fade-in"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
          border: "1px solid rgba(99,102,241,0.35)",
          color: "#c7d2fe",
          boxShadow: "0 0 24px rgba(99,102,241,0.15)"
        }}>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot inline-block" />
        <span>Campus Canteen Pre-order Network • Live & Ready</span>
      </div>

      {/* Hero section */}
      <div className="text-center mb-14 max-w-3xl mx-auto fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span style={{
            background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Zero
          </span>
          <span style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Q
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
          Skip the counter queue entirely. Order food while you walk to the canteen — pick it up hot &amp; ready the instant you arrive.
        </p>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto mt-10">
          <div className="glass-card py-3 px-4 flex flex-col items-center">
            <Clock size={20} className="text-indigo-400 mb-1" />
            <span className="text-lg sm:text-xl font-bold text-slate-100">0 min</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Wait Time</span>
          </div>
          <div className="glass-card py-3 px-4 flex flex-col items-center">
            <Sparkles size={20} className="text-amber-400 mb-1" />
            <span className="text-lg sm:text-xl font-bold text-slate-100">2 Outlets</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">MC &amp; Rishab</span>
          </div>
          <div className="glass-card py-3 px-4 flex flex-col items-center">
            <Zap size={20} className="text-emerald-400 mb-1" />
            <span className="text-lg sm:text-xl font-bold text-slate-100">Instant</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Express Pickup</span>
          </div>
        </div>
      </div>

      {/* Role Selection Cards (Wide Desktop Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl fade-in" style={{ animationDelay: "0.15s" }}>
        {/* Student Card */}
        <Link
          href="/student/outlets"
          id="role-student"
          className="glass-card glass-card-interactive p-8 sm:p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          style={{
            background: "linear-gradient(165deg, rgba(30, 33, 58, 0.75) 0%, rgba(17, 18, 30, 0.75) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.25)"
          }}
        >
          {/* Subtle glow highlight on hover */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />

          <div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.3))",
                border: "1px solid rgba(99,102,241,0.4)"
              }}>
              <UtensilsCrossed size={32} className="text-indigo-400" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 mb-3">
              Student Portal
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">
              I&apos;m a Student
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Browse campus menus, customize your tray, order ahead, and track your live status until ready for pickup.
            </p>

            <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
                <span>Order from MC (Main Canteen) or Rishab Food Court</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
                <span>Mock cashless checkout with instant ZQ-XXXX token</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
                <span>Live status progression: Ordered → Ready → Delivered</span>
              </li>
            </ul>
          </div>

          <div className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all shadow-lg group-hover:shadow-indigo-500/25"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}>
            <span>Enter Student Portal</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Admin Card */}
        <Link
          href="/admin/queue"
          id="role-admin"
          className="glass-card glass-card-interactive p-8 sm:p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          style={{
            background: "linear-gradient(165deg, rgba(22, 36, 32, 0.75) 0%, rgba(14, 24, 22, 0.75) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.25)"
          }}
        >
          {/* Subtle glow highlight on hover */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />

          <div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.3))",
                border: "1px solid rgba(16,185,129,0.4)"
              }}>
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 mb-3">
              Kitchen &amp; Counter Staff
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">
              I&apos;m Admin / Staff
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Manage incoming food pre-orders in real-time, bump statuses from preparation to ready, and hand over at the counter.
            </p>

            <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Live live order fulfillment stream updated every 3s</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Quick-deliver input for rapid counter scan &amp; dispatch</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Status controls ensuring strict state flow lifecycle</span>
              </li>
            </ul>
          </div>

          <div className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all shadow-lg group-hover:shadow-emerald-500/25"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            }}>
            <span>Open Kitchen Queue</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Footer Branding */}
      <footer className="mt-16 text-center text-xs text-slate-500">
        <p>ZeroQ Canteen Pre-order Architecture • Connected to Oracle FREEPDB1</p>
      </footer>
    </main>
  );
}
