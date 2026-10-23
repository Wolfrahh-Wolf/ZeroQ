import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-context";
import { Navbar } from "@/components/navbar";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <CartProvider><Navbar /><main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main><CartDrawer /></CartProvider>;
}
