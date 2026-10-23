import type { OrderItem, MenuItem, Order, Outlet, User } from "@prisma/client";

// ─── Auth / Session Types ─────────────────────────────────────────────────────

/**
 * The subset of user data stored in the NextAuth JWT session token.
 * These fields are available via useSession() and getServerSession().
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  outletId: string | null; // null for STUDENT, outlet id for ADMIN
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

/**
 * A single item in the client-side cart.
 */
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  imageAsset: string;
  quantity: number;
}

/**
 * The full cart state managed by CartContext.
 */
export interface CartState {
  items: CartItem[];
  outletId: string | null;
  outletSlug: string | null;
  outletName: string | null;
}

// ─── API Request / Response Types ────────────────────────────────────────────

/**
 * Request body for POST /api/orders
 */
export interface CreateOrderRequest {
  outletId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

/**
 * Response from POST /api/orders (Razorpay order created)
 */
export interface CreateOrderResponse {
  success: boolean;
  data?: {
    razorpayOrderId: string;
    amount: number; // in paise
    currency: string;
    orderId: string; // our internal DB order id (pending payment)
  };
  error?: string;
}

/**
 * Request body for POST /api/payment/verify
 */
export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId: string; // our internal DB order id
}

/**
 * Response from POST /api/payment/verify
 */
export interface VerifyPaymentResponse {
  success: boolean;
  data?: { billId: string; orderId: string };
  error?: string;
}

/**
 * Request body for PATCH /api/admin/orders/[orderId]
 */
export interface UpdateOrderStatusRequest {
  status: "READY" | "DELIVERED";
}

// ─── DB-Joined Types (for API responses) ─────────────────────────────────────

/**
 * OrderItem with the related MenuItem details included.
 */
export type OrderItemWithMenuItem = OrderItem & {
  menuItem: Pick<MenuItem, "id" | "name" | "imageAsset" | "category">;
};

/**
 * Full order with items, outlet name, and student name.
 * Used in both student tracking and admin dashboard.
 */
export type OrderWithDetails = Order & {
  items: OrderItemWithMenuItem[];
  outlet: Pick<Outlet, "id" | "name" | "slug">;
  student: Pick<User, "id" | "name" | "email">;
};

// ─── Outlet / Menu Types ──────────────────────────────────────────────────────

/**
 * Outlet data returned to client (no sensitive fields).
 */
export type OutletPublic = Pick<
  Outlet,
  "id" | "name" | "slug" | "description" | "imageUrl" | "isActive"
>;

/**
 * MenuItem data returned to client.
 */
export type MenuItemPublic = Pick<
  MenuItem,
  "id" | "name" | "description" | "price" | "imageAsset" | "category" | "isAvailable" | "outletId"
>;

// ─── Standard API Response Wrapper ───────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}
