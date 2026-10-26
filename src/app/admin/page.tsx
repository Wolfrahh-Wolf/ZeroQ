import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return <Suspense fallback={<div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-fluent-text-secondary shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]">Loading fulfillment dashboard…</div>}>
    <AdminDashboard />
  </Suspense>;
}
