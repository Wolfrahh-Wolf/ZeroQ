"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { MenuItemPublic } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenuItemCardProps {
  item: MenuItemPublic;
  outlet: { id: string; slug: string; name: string };
}

export function MenuItemCard({ item, outlet }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  function addToCart() {
    addItem({ menuItemId: item.id, name: item.name, price: item.price, imageAsset: item.imageAsset, quantity }, outlet);
    openCart();
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-fluent-2">
      <div className="relative aspect-square overflow-hidden bg-fluent-neutral-bg-3">
        <Image src={`/assets/items/${item.imageAsset}`} alt={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
        <Badge variant="secondary" className="absolute left-3 top-3 border-white/60 bg-white/90">{item.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-fluent-text-primary sm:text-base">{item.name}</h2>
        {item.description ? <p className="mt-1 line-clamp-2 text-xs text-fluent-text-secondary sm:text-sm">{item.description}</p> : null}
        <p className="mt-3 text-base font-semibold text-fluent-brand-primary">{formatPrice(item.price)}</p>
        <div className="mt-auto pt-3">
          <div className="mb-3 flex items-center justify-between rounded-md border border-fluent-neutral-stroke px-1 py-1">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Decrease ${item.name} quantity`} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus className="h-4 w-4" /></Button>
            <span className="min-w-8 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Increase ${item.name} quantity`} onClick={() => setQuantity((current) => current + 1)}><Plus className="h-4 w-4" /></Button>
          </div>
          <Button type="button" className="w-full" onClick={addToCart} disabled={!item.isAvailable}><ShoppingCart className="h-4 w-4" /> {item.isAvailable ? "Add to cart" : "Unavailable"}</Button>
        </div>
      </div>
    </article>
  );
}
