"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ClipboardList, History, LogOut, Moon, Sun, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function AdminSidebar({ outletName }: { outletName: string }) {
  const { theme, toggleTheme } = useTheme();

  return <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-fluent-neutral-stroke bg-white px-4 py-6 dark:border-[#3d3d3d] dark:bg-[#1a1a1a]">
    <Link href="/admin" className="flex items-center gap-3 px-2 text-fluent-text-primary" aria-label="ZeroQ admin home">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fluent-brand-primary text-white dark:text-[#1a1a1a]"><Utensils className="h-5 w-5" aria-hidden="true" /></span>
      <span className="text-lg font-semibold">ZeroQ</span>
    </Link>

    <div className="mt-8 rounded-lg border border-slate-200 bg-fluent-neutral-bg-2 p-3 dark:border-[#3d3d3d] dark:bg-[#252525]">
      <p className="text-xs font-semibold uppercase tracking-wider text-fluent-text-secondary">Assigned outlet</p>
      <p className="mt-1 font-medium text-fluent-text-primary">{outletName}</p>
    </div>

    <nav aria-label="Admin navigation" className="mt-8 space-y-1">
      <Link href="/admin?view=queue" className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-fluent-text-secondary transition-colors hover:bg-fluent-neutral-bg-3 hover:text-fluent-text-primary dark:hover:bg-[#333333]">
        <ClipboardList className="h-4 w-4" aria-hidden="true" /> Active queue
      </Link>
      <Link href="/admin?view=history" className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-fluent-text-secondary transition-colors hover:bg-fluent-neutral-bg-3 hover:text-fluent-text-primary dark:hover:bg-[#333333]">
        <History className="h-4 w-4" aria-hidden="true" /> Order history
      </Link>
    </nav>

    <div className="mt-auto space-y-1 border-t border-fluent-neutral-stroke pt-4 dark:border-[#3d3d3d]">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-fluent-text-secondary"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </Button>
      <Button type="button" variant="ghost" className="w-full justify-start text-fluent-text-secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
      </Button>
    </div>
  </aside>;
}
