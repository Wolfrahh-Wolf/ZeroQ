// src/lib/db/orders.ts — All Oracle queries relating to orders

import { execute, query } from "./connection";
import type { Order, OrderItem, OrderWithItems } from "../types";

// ─── Raw DB row shapes ─────────────────────────────────────────────────────

interface OrderRow {
  ORDER_ID: string;
  OUTLET_ID: number;
  OUTLET_NAME: string;
  STUDENT_NAME: string;
  TOTAL_AMOUNT: number;
  STATUS: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}

interface OrderItemRow {
  ORDER_ITEM_ID: number;
  ORDER_ID: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  QUANTITY: number;
  UNIT_PRICE: number;
}

function mapOrder(row: OrderRow): Order {
  return {
    order_id: row.ORDER_ID,
    outlet_id: row.OUTLET_ID,
    outlet_name: row.OUTLET_NAME,
    student_name: row.STUDENT_NAME,
    total_amount: Number(row.TOTAL_AMOUNT),
    status: row.STATUS as Order["status"],
    created_at: row.CREATED_AT?.toISOString?.() ?? String(row.CREATED_AT),
    updated_at: row.UPDATED_AT?.toISOString?.() ?? String(row.UPDATED_AT),
  };
}

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    order_item_id: row.ORDER_ITEM_ID,
    order_id: row.ORDER_ID,
    item_id: row.ITEM_ID,
    item_name: row.ITEM_NAME,
    quantity: row.QUANTITY,
    unit_price: Number(row.UNIT_PRICE),
  };
}

// ─── Queries ───────────────────────────────────────────────────────────────

export async function getAllOrders(): Promise<Order[]> {
  const rows = await query<OrderRow>(
    `SELECT o.order_id, o.outlet_id, ot.name AS outlet_name,
            o.student_name, o.total_amount, o.status,
            o.created_at, o.updated_at
       FROM orders o
       JOIN outlets ot ON ot.outlet_id = o.outlet_id
      ORDER BY o.created_at DESC`
  );
  return rows.map(mapOrder);
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const orderRows = await query<OrderRow>(
    `SELECT o.order_id, o.outlet_id, ot.name AS outlet_name,
            o.student_name, o.total_amount, o.status,
            o.created_at, o.updated_at
       FROM orders o
       JOIN outlets ot ON ot.outlet_id = o.outlet_id
      WHERE o.order_id = :1`,
    [orderId]
  );

  if (!orderRows.length) return null;

  const itemRows = await query<OrderItemRow>(
    `SELECT oi.order_item_id, oi.order_id, oi.item_id,
            mi.name AS item_name, oi.quantity, oi.unit_price
       FROM order_items oi
       JOIN menu_items mi ON mi.item_id = oi.item_id
      WHERE oi.order_id = :1
      ORDER BY oi.order_item_id`,
    [orderId]
  );

  return {
    ...mapOrder(orderRows[0]),
    items: itemRows.map(mapOrderItem),
  };
}

export async function createOrder(params: {
  outletId: number;
  studentName: string;
  totalAmount: number;
  items: { itemId: number; quantity: number; unitPrice: number }[];
}): Promise<string> {
  // Generate next order ID: ZQ-0001 format
  const seqRows = await query<{ NEXTVAL: number }>(
    `SELECT order_seq.NEXTVAL FROM DUAL`
  );
  const seq = seqRows[0].NEXTVAL;
  const orderId = `ZQ-${String(seq).padStart(4, "0")}`;

  await execute(
    `INSERT INTO orders (order_id, outlet_id, student_name, total_amount, status)
     VALUES (:1, :2, :3, :4, 'ORDERED')`,
    [orderId, params.outletId, params.studentName, params.totalAmount]
  );

  for (const item of params.items) {
    await execute(
      `INSERT INTO order_items (order_id, item_id, quantity, unit_price)
       VALUES (:1, :2, :3, :4)`,
      [orderId, item.itemId, item.quantity, item.unitPrice]
    );
  }

  return orderId;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: "READY" | "DELIVERED"
): Promise<boolean> {
  // Enforce strict status flow
  const allowed: Record<string, string> = {
    READY: "ORDERED",
    DELIVERED: "READY",
  };

  const result = await execute(
    `UPDATE orders
        SET status = :1
      WHERE order_id = :2
        AND status = :3`,
    [newStatus, orderId, allowed[newStatus]]
  );

  return (result.rowsAffected ?? 0) > 0;
}
