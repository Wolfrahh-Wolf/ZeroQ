import { CartProvider } from "@/lib/cart-context";
import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
