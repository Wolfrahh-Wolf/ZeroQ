"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoaderCircle, RefreshCw, Utensils } from "lucide-react";
import { z } from "zod";
import { AdminOrderRow } from "@/components/admin-order-row";
import { AdminSearchBar } from "@/components/admin-search-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/components/ui/toaster";
import { subscribeToOrderChanges } from "@/lib/supabase-realtime";
import type { AdminOrder } from "@/lib/types";

const adminOrderSchema = z.object({
  id: z.string(),
  billId: z.string(),
  status: z.enum(["ORDERED", "READY", "DELIVERED"]),
  totalAmount: z.number(),
  createdAt: z.string(),
  outlet: z.object({ name: z.string() }),
  student: z.object({
    name: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
  }),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    menuItem: z.object({ name: z.string() }),
  })),
});

const ordersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ orders: z.array(adminOrderSchema) }).optional(),
  error: z.string().optional(),
});

const updateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ order: adminOrderSchema }).optional(),
  error: z.string().optional(),
});

async function readJson(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

async function fetchOrders(statuses: "ORDERED,READY" | "DELIVERED"): Promise<AdminOrder[]> {
  const response = await fetch(`/api/admin/orders?status=${statuses}`, { cache: "no-store" });
  const parsed = ordersResponseSchema.safeParse(await readJson(response));
  if (!response.ok || !parsed.success || !parsed.data.success || !parsed.data.data) {
    throw new Error(parsed.success ? parsed.data.error ?? "Unable to load orders." : "Unable to load orders.");
  }
  return parsed.data.data.orders;
}

export function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const activeTab = searchParams.get("view") === "history" ? "history" : "queue";
  const [activeOrders, setActiveOrders] = useState<AdminOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<AdminOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Debounce rapid realtime events
  const requestInFlight = useRef(false);

  const refreshActiveOrders = useCallback(async (showSpinner = false) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    if (showSpinner) setIsRefreshing(true);
    try {
      const orders = await fetchOrders("ORDERED,READY");
      setActiveOrders(orders);
      setRefreshError(null);
      setLastUpdated(new Date());
    } catch (cause) {
      setRefreshError(cause instanceof Error ? cause.message : "Unable to refresh orders.");
    } finally {
      requestInFlight.current = false;
      if (showSpinner) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    void Promise.all([fetchOrders("ORDERED,READY"), fetchOrders("DELIVERED")])
      .then(([active, history]) => {
        if (!mounted) return;
        setActiveOrders(active);
        setHistoryOrders(history);
        setError(null);
        setLastUpdated(new Date());
      })
      .catch((cause: unknown) => {
        if (mounted) setError(cause instanceof Error ? cause.message : "Unable to load outlet orders.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Realtime subscription + 30s fallback poll (Active Queue tab only)
  useEffect(() => {
    if (activeTab !== "queue") return;
    const outletId = session?.user?.outletId;
    if (!outletId) {
      // Fall back to polling if outletId not yet available
      const interval = window.setInterval(() => void refreshActiveOrders(), 30_000);
      return () => window.clearInterval(interval);
    }

    const channel = subscribeToOrderChanges(
      { outletId },
      () => {
        if (!requestInFlight.current) void refreshActiveOrders();
      },
    );

    // 30s fallback poll in case realtime drops
    const fallbackInterval = window.setInterval(() => void refreshActiveOrders(), 30_000);

    return () => {
      channel?.unsubscribe();
      window.clearInterval(fallbackInterval);
    };
  }, [activeTab, session?.user?.outletId, refreshActiveOrders]);

  const visibleOrders = useMemo(() => {
    const source = activeTab === "history" ? historyOrders : activeOrders;
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return source;
    return source.filter((order) => {
      const studentFullName = order.student.firstName && order.student.lastName
        ? `${order.student.firstName} ${order.student.lastName}`
        : order.student.name;
      return (
        order.billId.toLocaleLowerCase().includes(query) ||
        order.student.name.toLocaleLowerCase().includes(query) ||
        studentFullName.toLocaleLowerCase().includes(query) ||
        (order.student.firstName?.toLocaleLowerCase().includes(query) ?? false) ||
        (order.student.lastName?.toLocaleLowerCase().includes(query) ?? false)
      );
    });
  }, [activeOrders, activeTab, historyOrders, searchQuery]);

  const placeOrderInCorrectQueue = useCallback((order: AdminOrder) => {
    if (order.status === "DELIVERED") {
      setActiveOrders((current) => current.filter((item) => item.id !== order.id));
      setHistoryOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)));
    } else {
      setHistoryOrders((current) => current.filter((item) => item.id !== order.id));
      setActiveOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]
        .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt)));
    }
  }, []);

  const updateStatus = useCallback(async (orderId: string, status: "READY" | "DELIVERED") => {
    const previous = [...activeOrders, ...historyOrders].find((order) => order.id === orderId);
    if (!previous) return;
    const optimisticOrder: AdminOrder = { ...previous, status };
    placeOrderInCorrectQueue(optimisticOrder);
    setRefreshError(null);

    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const parsed = updateResponseSchema.safeParse(await readJson(response));
      if (!response.ok || !parsed.success || !parsed.data.success || !parsed.data.data) {
        throw new Error(parsed.success ? parsed.data.error ?? "Unable to update this order." : "Unable to update this order.");
      }
      placeOrderInCorrectQueue(parsed.data.data.order);
    } catch (cause) {
      placeOrderInCorrectQueue(previous);
      showToast({
        title: "Order status wasn’t saved",
        description: cause instanceof Error ? cause.message : "Please refresh the queue and try again.",
        variant: "destructive",
      });
    }
  }, [activeOrders, historyOrders, placeOrderInCorrectQueue]);

  const currentOrders = activeTab === "history" ? historyOrders : activeOrders;

  return <div className="space-y-6">
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-fluent-brand-primary">Order management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fluent-text-primary">Fulfillment queue</h1>
        <p className="mt-2 text-sm text-fluent-text-secondary">Prepare incoming orders and keep pickup status current.</p>
      </div>
      <div className="flex items-center gap-4">
        {lastUpdated ? <span className="text-xs text-fluent-text-secondary">Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span> : null}
        <Button type="button" variant="outline" size="sm" onClick={() => void refreshActiveOrders(true)} disabled={isRefreshing}>
          {isRefreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
          Refresh queue
        </Button>
      </div>
    </div>

    {error ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
      <p className="font-medium text-fluent-text-primary">Orders couldn’t load</p>
      <p className="mt-1 text-sm text-fluent-text-secondary">{error}</p>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => {
        setError(null);
        setIsLoading(true);
        void Promise.all([fetchOrders("ORDERED,READY"), fetchOrders("DELIVERED")])
          .then(([active, history]) => { setActiveOrders(active); setHistoryOrders(history); setLastUpdated(new Date()); })
          .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load outlet orders."))
          .finally(() => setIsLoading(false));
      }}>Try again</Button>
    </div> : null}

    {refreshError && !error ? <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">Queue refresh failed. Showing the latest loaded orders.</p> : null}

    <Tabs value={activeTab} onValueChange={(value) => router.replace(value === "history" ? "/admin?view=history" : "/admin?view=queue", { scroll: false })}>
      <div className="flex items-center justify-between gap-6">
        <TabsList>
          <TabsTrigger value="queue" className="gap-2">Active Queue <span className="rounded-full bg-fluent-neutral-bg-3 px-2 py-0.5 text-xs">{activeOrders.length}</span></TabsTrigger>
          <TabsTrigger value="history" className="gap-2">Order History <span className="rounded-full bg-fluent-neutral-bg-3 px-2 py-0.5 text-xs">{historyOrders.length}</span></TabsTrigger>
        </TabsList>
        <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <TabsContent value="queue" className="mt-5">
        <OrderTable orders={visibleOrders} searchQuery={searchQuery} isLoading={isLoading} activeTab="queue" onStatusChange={updateStatus} />
      </TabsContent>
      <TabsContent value="history" className="mt-5">
        <OrderTable orders={visibleOrders} searchQuery={searchQuery} isLoading={isLoading} activeTab="history" onStatusChange={updateStatus} />
      </TabsContent>
    </Tabs>
    <p className="text-xs text-fluent-text-secondary">{activeTab === "queue" ? "Active queue refreshes automatically every 10 seconds." : "Showing completed orders for this outlet."}</p>
    {!isLoading && !error && currentOrders.length === 0 ? <span className="sr-only">No orders in this view.</span> : null}
  </div>;
}

function OrderTable({
  orders,
  searchQuery,
  isLoading,
  activeTab,
  onStatusChange,
}: {
  orders: AdminOrder[];
  searchQuery: string;
  isLoading: boolean;
  activeTab: "queue" | "history";
  onStatusChange: (orderId: string, status: "READY" | "DELIVERED") => Promise<void>;
}) {
  return <Card className="overflow-hidden">
    <div className="max-h-[calc(100vh-19rem)] overflow-auto">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 border-b border-fluent-neutral-stroke bg-fluent-neutral-bg-3 text-xs font-semibold uppercase tracking-wide text-fluent-text-secondary">
          <tr>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Bill ID</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Student</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Items</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Total</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Elapsed</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3">Status</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? <tr><td colSpan={7} className="py-16 text-center text-sm text-fluent-text-secondary"><LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading orders…</td></tr>
            : orders.map((order) => <AdminOrderRow key={order.id} order={order} searchQuery={searchQuery} onStatusChange={onStatusChange} />)}
          {!isLoading && orders.length === 0 ? <tr><td colSpan={7} className="py-16 text-center">
            <Utensils className="mx-auto h-7 w-7 text-fluent-text-secondary" aria-hidden="true" />
            <p className="mt-3 font-medium text-fluent-text-primary">{searchQuery ? "No matching orders" : activeTab === "queue" ? "Queue is clear" : "No completed orders yet"}</p>
            <p className="mt-1 text-sm text-fluent-text-secondary">{searchQuery ? "Try another bill ID or student name." : activeTab === "queue" ? "New paid orders will appear here." : "Delivered orders will appear here."}</p>
          </td></tr> : null}
        </tbody>
      </table>
    </div>
  </Card>;
}
