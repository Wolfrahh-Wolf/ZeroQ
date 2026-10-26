"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ClipboardList, LogOut, ShoppingBag, Utensils } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount, openCart } = useCart();
  const sectionName = pathname.split("/").filter(Boolean)[1]?.replaceAll("-", " ");

  // Display first+last name from session (Task 1.2)
  const displayName = session?.user.firstName && session?.user.lastName
    ? `${session.user.firstName} ${session.user.lastName}`
    : session?.user.name ?? "Student";
  const firstInitial = session?.user.firstName?.slice(0, 1).toUpperCase()
    ?? session?.user.name?.slice(0, 1).toUpperCase()
    ?? "S";

  return (
    <header className="sticky top-0 z-40 border-b border-fluent-neutral-stroke bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2 font-semibold text-fluent-text-primary" aria-label="ZeroQ home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fluent-brand-primary text-white"><Utensils className="h-5 w-5" aria-hidden="true" /></span>
            <span className="text-lg">ZeroQ</span>
          </Link>
          {sectionName ? <><span className="text-fluent-neutral-stroke-2">/</span><span className="truncate text-sm capitalize text-fluent-text-secondary">{sectionName}</span></> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/dashboard/orders" aria-label="My orders" aria-current={pathname === "/dashboard/orders" ? "page" : undefined} className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-fluent-text-secondary transition-colors hover:bg-fluent-neutral-bg-3 hover:text-fluent-text-primary">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">My orders</span>
          </Link>
          <Button variant="ghost" size="icon" className="relative" onClick={openCart} aria-label={`Open cart, ${itemCount} items`}>
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fluent-brand-primary px-1 text-[10px] font-semibold text-white">{itemCount}</span> : null}
          </Button>
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar className="h-8 w-8"><AvatarFallback className="bg-fluent-brand-light text-xs font-semibold text-fluent-brand-primary">{firstInitial}</AvatarFallback></Avatar>
            <span className="max-w-36 truncate text-sm text-fluent-text-secondary">{displayName}</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
