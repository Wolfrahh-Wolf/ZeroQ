"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, type OutletGroup } from "@/components/cart-context";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";

function OutletGroupSection({ group }: { group: OutletGroup }) {
  const { removeItem, updateQuantity } = useCart();
  const subtotal = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="py-4 dark:text-[#f5f5f5]">
      {/* Outlet header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fluent-brand-primary">{group.outlet.name}</p>
          <p className="text-xs text-fluent-text-secondary">{group.items.reduce((s, i) => s + i.quantity, 0)} item{group.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {group.items.map((item) => (
          <div key={item.menuItemId} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-fluent-neutral-bg-3 dark:bg-[#333333]">
              <Image src={`/assets/items/${item.imageAsset}`} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fluent-text-primary">{item.name}</p>
              <p className="mt-0.5 text-sm text-fluent-text-secondary">{formatPrice(item.price)} each</p>
              <div className="mt-1.5 flex items-center gap-1">
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Decrease ${item.name}`}
                  onClick={() => updateQuantity(item.menuItemId, group.outlet.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-7 text-center text-sm">{item.quantity}</span>
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label={`Increase ${item.name}`}
                  onClick={() => updateQuantity(item.menuItemId, group.outlet.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="ml-auto h-7 w-7 text-fluent-text-secondary hover:text-red-700"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.menuItemId, group.outlet.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Subtotal + per-outlet checkout */}
      <div className="mt-4 rounded-lg border border-fluent-neutral-stroke bg-fluent-neutral-bg-2 p-3 dark:border-[#3d3d3d] dark:bg-[#252525]">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-fluent-text-secondary">Subtotal</span>
          <span className="font-semibold text-fluent-text-primary">{formatPrice(subtotal)}</span>
        </div>
        <CheckoutButton outletGroup={group} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { groups, grandTotal, isOpen, closeCart } = useCart();
  const totalItemCount = groups.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? undefined : closeCart()}>
      <DialogContent className="right-0 top-0 h-dvh w-full max-w-md translate-x-0 translate-y-0 rounded-none p-0 sm:left-auto sm:right-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b border-fluent-neutral-stroke p-5 text-left dark:border-[#3d3d3d]">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-fluent-brand-primary" /> Your cart
            </DialogTitle>
            <DialogDescription>
              {groups.length > 0
                ? `${totalItemCount} item${totalItemCount !== 1 ? "s" : ""} from ${groups.length} outlet${groups.length !== 1 ? "s" : ""}`
                : "Your cart is ready for something delicious."}
            </DialogDescription>
          </DialogHeader>

          {groups.length > 0
            ? (
              <ScrollArea className="min-h-0 flex-1 px-5">
                <div className="divide-y divide-fluent-neutral-stroke dark:divide-[#3d3d3d]">
                  {groups.map((group, index) => (
                    <div key={group.outlet.id}>
                      <OutletGroupSection group={group} />
                      {index < groups.length - 1 ? null : null}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )
            : (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fluent-neutral-bg-3 text-fluent-text-secondary dark:bg-[#333333]">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold text-fluent-text-primary">Your cart is empty</p>
                <p className="mt-1 text-sm text-fluent-text-secondary">Add a few favourites and they&apos;ll appear here.</p>
                <Button type="button" variant="outline" className="mt-5" onClick={closeCart}>Browse menu</Button>
              </div>
            )
          }

          {groups.length > 0 ? (
            <div className="border-t border-fluent-neutral-stroke p-5 dark:border-[#3d3d3d]">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="mt-1 text-xs text-fluent-text-secondary">Checkout each outlet separately above.</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
