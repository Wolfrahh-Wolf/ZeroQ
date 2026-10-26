import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/menu-item-card";
import type { MenuItemPublic } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OutletMenuPage({ params }: { params: Promise<{ outletSlug: string }> }) {
  const { outletSlug } = await params;
  let outlet: { id: string; name: string; slug: string; description: string | null; menuItems: MenuItemPublic[] } | null = null;
  let failedToLoad = false;
  try {
    outlet = await prisma.outlet.findFirst({
      where: { slug: outletSlug, isActive: true },
      select: {
        id: true, name: true, slug: true, description: true,
        menuItems: {
          where: { isAvailable: true },
          select: { id: true, name: true, description: true, price: true, imageAsset: true, category: true, isAvailable: true, outletId: true },
          orderBy: [{ category: "asc" }, { name: "asc" }],
        },
      },
    });
  } catch {
    failedToLoad = true;
  }

  if (!outlet && !failedToLoad) notFound();
  if (!outlet) return <div role="alert" className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]"><h1 className="text-xl font-semibold text-fluent-text-primary">Menu unavailable</h1><p className="mt-2 text-sm text-fluent-text-secondary">We couldn’t load this menu. Please try again shortly.</p></div>;

  const outletInfo = { id: outlet.id, slug: outlet.slug, name: outlet.name };
  return <>
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-[#3d3d3d] dark:bg-[#252525]">
      <p className="text-sm font-medium text-fluent-brand-primary">Campus menu</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fluent-text-primary">{outlet.name}</h1>
      <p className="mt-3 max-w-2xl text-fluent-text-secondary">{outlet.description ?? "Choose your favourites and add them to your cart."}</p>
      <p className="mt-4 text-sm text-fluent-text-secondary">{outlet.menuItems.length} {outlet.menuItems.length === 1 ? "item" : "items"} available</p>
    </section>
    {outlet.menuItems.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{outlet.menuItems.map((item) => <MenuItemCard key={item.id} item={item} outlet={outletInfo} />)}</div> : <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]"><p className="font-medium text-fluent-text-primary">No menu items are available right now.</p><p className="mt-1 text-sm text-fluent-text-secondary">Please check back later.</p></div>}
  </>;
}
