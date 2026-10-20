// Shared TypeScript types for ZeroQ

export interface Outlet {
  outlet_id: number;
  name: string;
  description: string;
  is_active: number;
}

export interface MenuItem {
  item_id: number;
  outlet_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: number;
  image_url?: string;
}

export type OrderStatus = "ORDERED" | "READY" | "DELIVERED";

export interface Order {
  order_id: string;
  outlet_id: number;
  outlet_name: string;
  student_name: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: string;
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CartItem {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  outlet_id: number;
}
