/**
 * src/lib/supabase-realtime.ts
 *
 * Supabase Realtime client for ZeroQ.
 * Provides a subscribe function for the orders table so the student orders page
 * and admin dashboard can receive instant push updates instead of polling.
 *
 * Prerequisites:
 *  - NEXT_PUBLIC_SUPABASE_URL set in .env.local
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY set in .env.local
 *  - Realtime enabled in Supabase dashboard (Settings → Replication → orders table)
 *
 * Usage:
 *   const channel = subscribeToOrderChanges(
 *     { studentId: "user-id" },  // or { outletId: "outlet-id" }
 *     () => fetchOrders(),       // callback on any change event
 *   );
 *   // On cleanup:
 *   channel.unsubscribe();
 */

import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

// ─── Singleton Supabase Client ────────────────────────────────────────────────

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient(): ReturnType<typeof createClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Supabase env vars not configured — realtime unavailable (will fall back to polling)
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseClient;
}

// ─── Subscription Options ─────────────────────────────────────────────────────

export type OrderChangeFilter =
  | { studentId: string; outletId?: never }
  | { outletId: string; studentId?: never };

// ─── Subscribe Function ───────────────────────────────────────────────────────

/**
 * Subscribe to realtime changes on the orders table.
 *
 * @param filter - Scope the subscription: either by studentId or outletId.
 * @param onchange - Callback fired on INSERT, UPDATE, or DELETE events.
 * @returns The Supabase RealtimeChannel. Call `.unsubscribe()` on cleanup.
 */
export function subscribeToOrderChanges(
  filter: OrderChangeFilter,
  onchange: () => void,
): RealtimeChannel | null {
  const client = getSupabaseClient();
  if (!client) {
    console.warn("[ZeroQ Realtime] Supabase env vars missing — realtime unavailable, polling will be used instead.");
    return null;
  }

  // Build a unique channel name to prevent conflicts on multiple subscriptions
  const channelName = "studentId" in filter
    ? `zeroq-orders-student-${filter.studentId}`
    : `zeroq-orders-outlet-${filter.outletId}`;

  // Build the Postgres Changes filter string (PostgreSQL columns are studentId and outletId)
  const postgresFilter = "studentId" in filter
    ? `studentId=eq.${filter.studentId}`
    : `outletId=eq.${filter.outletId}`;

  const channel = client
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*", // INSERT, UPDATE, DELETE
        schema: "public",
        table: "orders",
        filter: postgresFilter,
      },
      () => {
        onchange();
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[ZeroQ Realtime] Subscribed to ${channelName}`);
      }
      if (status === "CHANNEL_ERROR") {
        console.warn(`[ZeroQ Realtime] Channel error on ${channelName} — check Supabase Realtime config.`);
      }
    });

  return channel;
}
