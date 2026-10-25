import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let outletName = "Canteen outlet";
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.outletId) {
      const outlet = await prisma.outlet.findUnique({
        where: { id: session.user.outletId },
        select: { name: true },
      });
      if (outlet) outletName = outlet.name;
    }
  } catch {
    // Keep the admin shell usable if the outlet label cannot be loaded.
  }

  return <div className="flex min-h-screen min-w-[1024px] bg-fluent-neutral-bg-2">
    <AdminSidebar outletName={outletName} />
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 items-center border-b border-fluent-neutral-stroke bg-white px-8">
        <p className="text-sm font-medium text-fluent-text-secondary">Canteen fulfillment</p>
      </header>
      <main className="w-full flex-1 px-8 py-8">{children}</main>
    </div>
  </div>;
}
