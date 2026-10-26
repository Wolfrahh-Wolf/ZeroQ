"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ClipboardList, History, LogOut, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar({ outletName }: { outletName: string }) {
  return <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-fluent-neutral-stroke bg-white px-4 py-6">
    <Link href="/admin" className="flex items-center gap-3 px-2 text-fluent-text-primary" aria-label="ZeroQ admin home">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fluent-brand-primary text-white"><Utensils className="h-5 w-5" aria-hidden="true" /></span>
      <span className="text-lg font-semibold">ZeroQ</span>
    </Link>

    <div className="mt-8 rounded-lg border border-slate-200 bg-fluent-neutral-bg-2 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-fluent-text-secondary">Assigned outlet</p>
      <p className="mt-1 font-medium text-fluent-text-primary">{outletName}</p>
    </div>

    <nav aria-label="Admin navigation" className="mt-8 space-y-1">
      <Link href="/admin?view=queue" className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-fluent-text-secondary transition-colors hover:bg-fluent-neutral-bg-3 hover:text-fluent-text-primary">
        <ClipboardList className="h-4 w-4" aria-hidden="true" /> Active queue
      </Link>
      <Link href="/admin?view=history" className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-fluent-text-secondary transition-colors hover:bg-fluent-neutral-bg-3 hover:text-fluent-text-primary">
        <History className="h-4 w-4" aria-hidden="true" /> Order history
      </Link>
    </nav>

    <div className="mt-auto border-t border-fluent-neutral-stroke pt-4">
      <Button type="button" variant="ghost" className="w-full justify-start text-fluent-text-secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
      </Button>
    </div>
  </aside>;
}
