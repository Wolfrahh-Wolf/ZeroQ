import { Store } from "lucide-react";
import { OutletCard } from "@/components/outlet-card";
import { prisma } from "@/lib/prisma";
import type { OutletPublic } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let outlets: OutletPublic[] = [];
  let failedToLoad = false;
  try {
    outlets = await prisma.outlet.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, description: true, imageUrl: true, isActive: true },
      orderBy: { name: "asc" },
    });
  } catch {
    failedToLoad = true;
  }

  return <>
    <div className="mb-8 max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-fluent-brand-primary">Good food, on your time</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fluent-text-primary sm:text-4xl">Campus outlets</h1>
      <p className="mt-3 text-base text-fluent-text-secondary">Choose an outlet to explore its menu and get your order ready before you arrive.</p>
    </div>
    {failedToLoad ? <div role="alert" className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]"><Store className="mx-auto h-8 w-8 text-fluent-text-secondary" /><p className="mt-3 font-medium">Outlets are unavailable right now.</p><p className="mt-1 text-sm text-fluent-text-secondary">Please try again in a little while.</p></div> : outlets.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{outlets.map((outlet) => <OutletCard key={outlet.id} outlet={outlet} />)}</div> : <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]"><Store className="mx-auto h-8 w-8 text-fluent-text-secondary" /><p className="mt-3 font-medium">No outlets are available yet.</p><p className="mt-1 text-sm text-fluent-text-secondary">Check back soon for campus menus.</p></div>}
  </>;
}
