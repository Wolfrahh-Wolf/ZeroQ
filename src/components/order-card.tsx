import { CircleCheck, Clock3, ReceiptText, Store } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatPrice } from "@/lib/utils";
import type { MyOrder } from "@/lib/types";

const timeline: Array<{ status: MyOrder["status"]; label: string }> = [
  { status: "ORDERED", label: "Ordered" },
  { status: "READY", label: "Ready" },
  { status: "DELIVERED", label: "Picked up" },
];

const statusRank: Record<MyOrder["status"], number> = {
  ORDERED: 0,
  READY: 1,
  DELIVERED: 2,
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function OrderCard({ order }: { order: MyOrder }) {
  const currentRank = statusRank[order.status];
  const date = dateFormatter.format(new Date(order.createdAt));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fluent-text-secondary">Bill ID</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-fluent-text-primary">
              <ReceiptText className="h-5 w-5 text-fluent-brand-primary" aria-hidden="true" />
              {order.billId}
            </h2>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fluent-text-secondary">
          <span className="inline-flex items-center gap-2"><Store className="h-4 w-4" aria-hidden="true" />{order.outlet.name}</span>
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" aria-hidden="true" />{date}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="rounded-lg bg-fluent-neutral-bg-2 p-4 dark:bg-[#252525]">
          <h3 className="text-sm font-semibold text-fluent-text-primary">Items</h3>
          <ul className="mt-3 space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                <span className="min-w-0 text-fluent-text-secondary">{item.menuItem.name} <span className="text-fluent-text-primary">× {item.quantity}</span></span>
                <span className="shrink-0 font-medium text-fluent-text-primary">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-fluent-neutral-stroke pt-3 text-sm font-semibold text-fluent-text-primary dark:border-[#3d3d3d]">
            <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fluent-text-primary">Order progress</h3>
          <ol aria-label={`Order status: ${order.status.toLowerCase()}`} className="mt-3 flex items-center">
            {timeline.map((step, index) => {
              const complete = index <= currentRank;
              return <li key={step.status} className="flex min-w-0 flex-1 items-center last:flex-none">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${complete ? "bg-fluent-brand-primary text-white" : "bg-fluent-neutral-bg-3 text-fluent-text-secondary dark:bg-[#333333] dark:text-[#adadad]"}`}>
                    {complete ? <CircleCheck className="h-4 w-4" aria-hidden="true" /> : <span className="text-xs font-semibold">{index + 1}</span>}
                  </span>
                  <span className={`truncate text-xs sm:text-sm ${complete ? "font-medium text-fluent-text-primary" : "text-fluent-text-secondary"}`}>{step.label}</span>
                </div>
                {index < timeline.length - 1 ? <span aria-hidden="true" className={`mx-2 h-px min-w-2 flex-1 ${index < currentRank ? "bg-fluent-brand-primary" : "bg-fluent-neutral-stroke-2 dark:bg-[#525252]"}`} /> : null}
              </li>;
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
