"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, ClipboardList, LoaderCircle, RefreshCw } from "lucide-react";
import { OrderCard } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MyOrder } from "@/lib/types";
import { subscribeToOrderChanges } from "@/lib/supabase-realtime";
import { z } from "zod";

const myOrdersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    orders: z.array(z.object({
      id: z.string(),
      billId: z.string(),
      status: z.enum(["ORDERED", "READY", "DELIVERED"]),
      totalAmount: z.number(),
      createdAt: z.string(),
      outlet: z.object({ name: z.string(), slug: z.string() }),
      items: z.array(z.object({
        id: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        menuItem: z.object({ name: z.string() }),
      })),
    })),
  }).optional(),
  error: z.string().optional(),
});

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Track if a fetch is already in-flight to debounce rapid realtime events
  const requestInFlight = useRef(false);

  const fetchOrders = async (initial = false) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    if (initial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await fetch("/api/orders/my-orders", { cache: "no-store" });
      let payload: unknown;
      try { payload = await response.json(); } catch { payload = null; }
      const parsed = myOrdersResponseSchema.safeParse(payload);
      if (!response.ok || !parsed.success || !parsed.data.success || !parsed.data.data) {
        throw new Error(parsed.success ? parsed.data.error ?? "Unable to load your orders." : "Unable to load your orders.");
      }
      setOrders(parsed.data.data.orders);
      setError(null);
      setLastUpdated(new Date());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load your orders.");
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    void fetchOrders(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime subscription + 30s fallback poll
  useEffect(() => {
    const studentId = session?.user?.id;
    if (!studentId) return;

    // Subscribe to realtime changes for this student's orders
    const channel = subscribeToOrderChanges(
      { studentId },
      () => { void fetchOrders(); },
    );

    // Lightweight fallback poll every 30s in case realtime drops
    const fallbackInterval = window.setInterval(() => void fetchOrders(), 30_000);

    return () => {
      channel?.unsubscribe();
      window.clearInterval(fallbackInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const retry = () => {
    setError(null);
    void fetchOrders(false);
  };

  return <>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-fluent-brand-primary">Your food, in progress</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fluent-text-primary sm:text-4xl">My Orders</h1>
        <p className="mt-3 max-w-2xl text-base text-fluent-text-secondary">Track recent orders and see when they&apos;re ready for pickup.</p>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated ? <span className="hidden text-xs text-fluent-text-secondary sm:inline">Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span> : null}
        <Button type="button" variant="outline" size="sm" onClick={retry} disabled={isRefreshing}>
          {isRefreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>
    </div>

    {error && orders.length === 0 && !isLoading ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900 dark:bg-[#252525]">
      <p className="font-medium text-fluent-text-primary">Orders couldn&apos;t load</p>
      <p className="mt-1 text-sm text-fluent-text-secondary">{error}</p>
      <Button type="button" className="mt-4" onClick={retry} disabled={isRefreshing}>Try again</Button>
    </div> : null}

    {isLoading ? <div aria-label="Loading orders" className="space-y-5">
      {[0, 1].map((placeholder) => <Card key={placeholder} className="h-72 animate-pulse bg-white p-6 dark:bg-[#252525]">
        <div className="h-6 w-36 rounded bg-fluent-neutral-bg-3" />
        <div className="mt-4 h-4 w-48 rounded bg-fluent-neutral-bg-3" />
        <div className="mt-8 h-28 rounded bg-fluent-neutral-bg-3" />
      </Card>)}
    </div> : null}

    {!isLoading && !error && orders.length === 0 ? <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-[#3d3d3d] dark:bg-[#252525]">
      <ClipboardList className="mx-auto h-10 w-10 text-fluent-text-secondary" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-fluent-text-primary">No orders yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-fluent-text-secondary">When you place an order, its bill and live pickup status will show up here. Recent orders stay visible for 30 days.</p>
      <Link href="/dashboard" className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-fluent-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fluent-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-primary">
        Browse outlets<ArrowRight className="h-4 w-4" />
      </Link>
    </div> : null}

    {orders.length > 0 ? <div className="space-y-5">
      {error ? <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-[#3a2f00] dark:text-amber-200">Couldn&apos;t refresh right now. Showing your last loaded orders.</p> : null}
      {orders.map((order) => <OrderCard key={order.id} order={order} />)}
      <p className="text-center text-xs text-fluent-text-secondary">Order statuses update in real-time. Orders are shown for 30 days.</p>
    </div> : null}
  </>;
}
