"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, outletName, total, isOpen, closeCart, removeItem, updateQuantity, clearCart, notice, clearNotice } = useCart();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? undefined : closeCart()}>
      <DialogContent className="right-0 top-0 h-dvh w-full max-w-md translate-x-0 translate-y-0 rounded-none p-0 sm:left-auto sm:right-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b border-fluent-neutral-stroke p-5 text-left">
            <DialogTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-fluent-brand-primary" /> Your cart</DialogTitle>
            <DialogDescription>{outletName ? `Ordering from ${outletName}` : "Your cart is ready for something delicious."}</DialogDescription>
          </DialogHeader>
          {notice ? <div role="alert" className="m-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><p>{notice}</p><Button type="button" variant="link" className="mt-1 h-auto p-0 text-amber-900" onClick={() => { clearCart(); clearNotice(); }}>Clear cart and switch outlet</Button></div> : null}
          {items.length ? <ScrollArea className="min-h-0 flex-1 px-5">
            <div className="divide-y divide-fluent-neutral-stroke">
              {items.map((item) => <div key={item.menuItemId} className="flex gap-3 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-fluent-neutral-bg-3"><Image src={`/assets/items/${item.imageAsset}`} alt="" fill sizes="64px" className="object-cover" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fluent-text-primary">{item.name}</p>
                  <p className="mt-1 text-sm text-fluent-text-secondary">{formatPrice(item.price)} each</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Decrease ${item.name}`} onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Increase ${item.name}`} onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="ml-auto h-7 w-7 text-fluent-text-secondary hover:text-red-700" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.menuItemId)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>)}
            </div>
          </ScrollArea> : <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fluent-neutral-bg-3 text-fluent-text-secondary"><ShoppingBag className="h-6 w-6" /></span>
            <p className="mt-4 font-semibold text-fluent-text-primary">Your cart is empty</p>
            <p className="mt-1 text-sm text-fluent-text-secondary">Add a few favourites and they’ll appear here.</p>
            <Button type="button" variant="outline" className="mt-5" onClick={closeCart}>Browse menu</Button>
          </div>}
          <div className="border-t border-fluent-neutral-stroke p-5">
            <div className="mb-4 flex items-center justify-between text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
            <CheckoutButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
