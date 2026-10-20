// src/lib/db/outlets.ts — All Oracle queries relating to outlets & menu items

import { query } from "./connection";
import type { MenuItem, Outlet } from "../types";

export async function getOutlets(): Promise<Outlet[]> {
  return query<Outlet>(
    `SELECT outlet_id, name, description, is_active
       FROM outlets
      WHERE is_active = 1
      ORDER BY outlet_id`
  );
}

export async function getMenuByOutlet(outletId: number): Promise<MenuItem[]> {
  return query<MenuItem>(
    `SELECT item_id, outlet_id, name, description, price, category, is_available, image_url
       FROM menu_items
      WHERE outlet_id = :1
        AND is_available = 1
      ORDER BY category, name`,
    [outletId]
  );
}

export async function getMenuItemById(itemId: number): Promise<MenuItem | null> {
  const rows = await query<MenuItem>(
    `SELECT item_id, outlet_id, name, description, price, category, is_available, image_url
       FROM menu_items
      WHERE item_id = :1`,
    [itemId]
  );
  return rows[0] ?? null;
}
