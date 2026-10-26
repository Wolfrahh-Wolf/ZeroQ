"use client";

import { useState } from "react";
import { LoaderCircle, AlertTriangle } from "lucide-react";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/lib/types";

interface AdminOrderRowProps {
  order: AdminOrder;
  searchQuery: string;
  onStatusChange: (orderId: string, status: "READY" | "DELIVERED") => Promise<void>;
}

function formatElapsed(createdAt: string): string {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000));
  if (elapsedMinutes < 1) return "<1 min";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min`;
  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function HighlightedBillId({ billId, query }: { billId: string; query: string }) {
  const normalizedQuery = query.trim();
  const matchStart = normalizedQuery ? billId.toLowerCase().indexOf(normalizedQuery.toLowerCase()) : -1;
  if (matchStart < 0) return <span>{billId}</span>;
  const matchEnd = matchStart + normalizedQuery.length;
  return <span>
    {billId.slice(0, matchStart)}
    <mark className="rounded-sm bg-[#FFF4CE] px-0.5 text-[#835C00]">{billId.slice(matchStart, matchEnd)}</mark>
    {billId.slice(matchEnd)}
  </span>;
}

export function AdminOrderRow({ order, searchQuery, onStatusChange }: AdminOrderRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  async function updateStatus(status: "READY" | "DELIVERED") {
    if (status === "DELIVERED") {
      setShowConfirmDialog(true);
      return;
    }
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, status);
    } finally {
      setIsUpdating(false);
    }
  }

  async function confirmDelivery() {
    setShowConfirmDialog(false);
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, "DELIVERED");
    } finally {
      setIsUpdating(false);
    }
  }

  return <>
    <tr className="border-b border-fluent-neutral-stroke last:border-0 hover:bg-fluent-neutral-bg-2/70">
      <td className="whitespace-nowrap px-4 py-4 font-semibold text-fluent-text-primary"><HighlightedBillId billId={order.billId} query={searchQuery} /></td>
      <td className="max-w-48 truncate px-4 py-4 text-sm text-fluent-text-primary" title={order.student.name}>
        {order.student.firstName && order.student.lastName
          ? `${order.student.firstName} ${order.student.lastName}`
          : order.student.name}
      </td>
      <td className="min-w-64 px-4 py-4 text-sm text-fluent-text-secondary">
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item) => <p key={item.id} className="truncate" title={`${item.menuItem.name} × ${item.quantity}`}>{item.menuItem.name} <span className="text-fluent-text-primary">× {item.quantity}</span></p>)}
          {order.items.length > 3 ? <p className="text-xs text-fluent-text-secondary">+{order.items.length - 3} more items</p> : null}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-fluent-text-primary">{formatPrice(order.totalAmount)}</td>
      <td className="whitespace-nowrap px-4 py-4 text-sm tabular-nums text-fluent-text-secondary">{formatElapsed(order.createdAt)}</td>
      <td className="whitespace-nowrap px-4 py-4"><OrderStatusBadge status={order.status} /></td>
      <td className="whitespace-nowrap px-4 py-4 text-right">
        {order.status === "ORDERED" ? <Button type="button" size="sm" onClick={() => void updateStatus("READY")} disabled={isUpdating}>
          {isUpdating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null} Mark ready
        </Button> : null}
        {order.status === "READY" ? <Button type="button" size="sm" variant="outline" onClick={() => void updateStatus("DELIVERED")} disabled={isUpdating}>
          {isUpdating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null} Mark delivered
        </Button> : null}
        {order.status === "DELIVERED" ? <span className="text-sm text-fluent-text-secondary">Complete</span> : null}
      </td>
    </tr>

    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Confirm Delivery
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to mark <strong>{order.billId}</strong> (
            {order.student.firstName && order.student.lastName
              ? `${order.student.firstName} ${order.student.lastName}`
              : order.student.name}
            ) as delivered? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-2">
          <Button autoFocus onClick={() => void confirmDelivery()} disabled={isUpdating}>
            {isUpdating ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Delivery
          </Button>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isUpdating}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
