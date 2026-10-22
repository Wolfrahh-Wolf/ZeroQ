# ZeroQ — Phased Implementation Plan (MODULES.md)

> **Standard Trigger Contract:**
> *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."*

---

## Feature Catalog

| Module | Feature | Route(s) |
|--------|---------|---------|
| **Module 1** | Role-Based Authentication | `/login`, `/api/auth/[...nextauth]` |
| **Module 2** | Outlet Browsing & Menu Catalog | `/dashboard`, `/dashboard/[outletSlug]` |
| **Module 3** | Razorpay Checkout & Bill ID Generation | `/api/orders`, `/api/payment/verify` |
| **Module 4** | Student Order Tracking | `/dashboard/orders` |
| **Module 5** | Canteen Admin Fulfillment Dashboard | `/admin`, `/api/admin/orders/[orderId]` |

---

## Phase Execution Plan

---

### Phase 1 — Project Scaffold & Role-Based Authentication

**Trigger**: *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase 1 from docs/MODULES.md completely."*

**Objective**: Scaffold the complete Next.js project configuration and implement secure role-based authentication with NextAuth.js.

**Target Files**:
```
tsconfig.json
next.config.ts
tailwind.config.ts
postcss.config.mjs
src/app/layout.tsx
src/app/page.tsx
src/app/login/page.tsx
src/lib/auth.ts
src/lib/prisma.ts
src/lib/utils.ts
src/lib/types.ts
src/app/api/auth/[...nextauth]/route.ts
src/middleware.ts
src/components/ui/         ← Shadcn UI primitives (button, card, input, label, badge, toast, etc.)
```

**Implementation Steps**:

1. **Project Config Files**
   - Create `tsconfig.json` with strict mode, `@/*` path alias, `ES2022` target.
   - Create `next.config.ts` with image domain allowlist (`supabase.co` and `via.placeholder.com` for dev).
   - Create `tailwind.config.ts` extending Fluent 2 Light theme tokens as CSS variables.
   - Create `postcss.config.mjs` for Tailwind.

2. **Shared Library Setup**
   - `src/lib/prisma.ts`: Prisma singleton (`globalThis` pattern).
   - `src/lib/types.ts`: Shared TS types — `SessionUser`, `CartItem`, `OrderWithItems`.
   - `src/lib/utils.ts`: `cn()` (clsx + tailwind-merge), `formatPrice()`, `generateBillId()`.
   - `src/lib/auth.ts`: NextAuth `authOptions` with Credentials provider, JWT strategy, role + outletId in session token.

3. **NextAuth API Route**
   - `src/app/api/auth/[...nextauth]/route.ts`: Export GET and POST handlers from NextAuth.

4. **Middleware**
   - `src/middleware.ts`: Protect `/dashboard/*` (STUDENT only) and `/admin/*` (ADMIN only). Redirect unauthenticated users to `/login`.

5. **Root Layout & Page**
   - `src/app/layout.tsx`: Import Inter font, `SessionProvider`, `<Toaster>`, global CSS.
   - `src/app/page.tsx`: Server component → redirect to `/login` via `redirect()`.

6. **Login Page**
   - `src/app/login/page.tsx`: Fluent 2 styled login form.
   - Centered card layout with ZeroQ logo/wordmark, email + password fields, "Sign In" button.
   - Uses `signIn("credentials")` from `next-auth/react`.
   - Error state display for invalid credentials.
   - Fully responsive.

7. **Shadcn UI Setup**
   - Install/create Shadcn components: `Button`, `Card`, `Input`, `Label`, `Badge`, `Toast`, `Toaster`, `Dialog`, `Tabs`, `Avatar`, `Separator`, `ScrollArea`.
   - Create `src/app/globals.css` with Fluent 2 CSS variable definitions.

**Verification**:
```bash
npm run dev
# → Visit http://localhost:3000 → redirects to /login
# → Login with student@zeroq.app / student123 → redirects to /dashboard (stub page OK)
# → Login with admin.maincanteen@zeroq.app / admin123 → redirects to /admin (stub page OK)
# → Try to access /admin as student → redirected to /dashboard
# → Try to access /dashboard as admin → redirected to /admin
```

**Definition of Done**:
- [ ] Login form renders with Fluent 2 design tokens
- [ ] Credentials validation and error display working
- [ ] Role-based redirect after login functioning
- [ ] Middleware protecting both portal routes
- [ ] Session token carries `id`, `role`, `outletId`
- [ ] No TypeScript errors (`tsc --noEmit` passes)

---

### Phase 2 — Outlet Browsing & Menu Catalog

**Trigger**: *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase 2 from docs/MODULES.md completely."*

**Objective**: Build the student-facing outlet listing and per-outlet menu catalog with a functional cart state.

**Target Files**:
```
src/app/dashboard/layout.tsx
src/app/dashboard/page.tsx
src/app/dashboard/[outletSlug]/page.tsx
src/components/navbar.tsx
src/components/outlet-card.tsx
src/components/menu-item-card.tsx
src/components/cart-drawer.tsx
src/components/cart-context.tsx      ← React Context for cart state
src/app/api/outlets/route.ts         ← GET all active outlets
src/app/api/outlets/[slug]/route.ts  ← GET outlet + menu items by slug
public/assets/outlets/               ← Placeholder webp images (or next/image placeholders)
public/assets/items/                 ← Placeholder item images
```

**Implementation Steps**:

1. **Cart Context**
   - `src/components/cart-context.tsx`: Client-side React Context + `useReducer`.
   - Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`.
   - State: `items: CartItem[]`, `outletId: string | null` (lock to one outlet per cart).
   - Persist to `sessionStorage` to survive page refreshes.

2. **API Routes**
   - `GET /api/outlets`: Return all active outlets (id, name, slug, description, imageUrl).
   - `GET /api/outlets/[slug]`: Return outlet data + all available menu items.

3. **Student Navbar**
   - `src/components/navbar.tsx`: Fixed top nav with ZeroQ logo, outlet breadcrumb, cart icon (item count badge), user avatar + sign-out dropdown.
   - Fluent 2 styled: white background, bottom border, subtle shadow.

4. **Dashboard Layout**
   - `src/app/dashboard/layout.tsx`: Wraps child with `CartProvider` + `<Navbar>`.
   - Responsive padding and max-width container.

5. **Outlet Listing Page** (`/dashboard`)
   - Server Component: Fetch outlets from DB via Prisma (or via API route).
   - Render `<OutletCard>` grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
   - Page heading: "Campus Outlets" with subtitle.

6. **Outlet Card** (`src/components/outlet-card.tsx`)
   - `aspect-square object-cover` image container with `next/image`.
   - Outlet name (bold), description (truncated, 2 lines).
   - Subtle hover state (scale + shadow elevation).
   - Links to `/dashboard/[outletSlug]`.

7. **Menu Catalog Page** (`/dashboard/[outletSlug]`)
   - Server Component: Fetch outlet + menu items.
   - Render outlet header (name, description) + items grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`.
   - Floating `<CartDrawer>` toggle button (fixed bottom-right or in navbar).

8. **Menu Item Card** (`src/components/menu-item-card.tsx`)
   - Client Component (needs cart interaction).
   - `aspect-square object-cover` image with `next/image`.
   - Item name, price (formatted), category badge.
   - Quantity selector (− / count / +) with add-to-cart button.
   - Disabled state when `isAvailable: false`.

9. **Cart Drawer** (`src/components/cart-drawer.tsx`)
   - Slides in from right on mobile/desktop.
   - Lists cart items with quantity controls and item subtotals.
   - Cart total at bottom.
   - "Proceed to Payment" button (disabled when cart empty).
   - Cross-outlet warning if user adds items from different outlet.

**Verification**:
```bash
npm run dev
# → /dashboard shows 6 outlet cards with images, names, descriptions
# → Click outlet → /dashboard/main-canteen shows menu items
# → Add items to cart → cart count in navbar updates
# → Open cart drawer → items listed with correct totals
# → Remove items, change quantity → cart updates reactively
```

**Definition of Done**:
- [ ] All 6 outlets display with 1:1 image containers
- [ ] Menu items render with 1:1 image containers
- [ ] Cart adds/removes/updates quantities correctly
- [ ] Cart locked to single outlet (warning if mixing)
- [ ] Fully responsive on mobile and desktop
- [ ] No TypeScript errors

---

### Phase 3 — Razorpay Checkout & Bill ID Generation

**Trigger**: *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase 3 from docs/MODULES.md completely."*

**Objective**: Implement the complete Razorpay payment flow from order creation to signature verification and Bill ID generation.

**Target Files**:
```
src/lib/razorpay.ts
src/app/api/orders/route.ts
src/app/api/payment/verify/route.ts
src/components/checkout-button.tsx    ← Client component that opens Razorpay widget
src/app/dashboard/[outletSlug]/page.tsx  ← Update cart drawer with checkout trigger
```

**Implementation Steps**:

1. **Razorpay Server Client**
   - `src/lib/razorpay.ts`: Initialize `new Razorpay({ key_id, key_secret })` singleton.

2. **Order Creation API** (`POST /api/orders`)
   - Authenticate: Verify session, confirm `role === STUDENT`.
   - Validate request body (Zod): `{ outletId: string, items: { menuItemId: string, quantity: number }[] }`.
   - Fetch menu item prices from DB (never trust client-sent prices).
   - Calculate total server-side.
   - Create Razorpay order: `razorpay.orders.create({ amount: totalInPaise, currency: "INR", receipt: cuid })`.
   - Store a pending order in DB (no billId yet, no paymentId, status ORDERED — updated only after verification).
   - Return `{ razorpayOrderId, amount, currency, orderId }`.

3. **Payment Verification API** (`POST /api/payment/verify`)
   - Authenticate: Verify session.
   - Validate body (Zod): `{ razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId }`.
   - Verify HMAC-SHA256 signature: `createHmac("sha256", KEY_SECRET).update(order_id + "|" + payment_id).digest("hex")`.
   - If mismatch → return 400 `{ success: false, error: "Payment verification failed" }`.
   - If valid:
     - Generate Bill ID (using `generateBillId()` from `src/lib/utils.ts` — atomic via Prisma transaction).
     - Update order: `status: ORDERED`, `paymentId`, `billId`.
   - Return `{ success: true, billId, orderId }`.

4. **Checkout Button Component**
   - Client component that:
     - Calls `POST /api/orders` to get Razorpay order details.
     - Loads Razorpay checkout script dynamically.
     - Opens Razorpay widget with order details + prefilled student name/email.
     - On success → calls `POST /api/payment/verify`.
     - On verified → clears cart, shows success toast with Bill ID.
     - On failure → shows error toast.

5. **OrderItem Records**
   - When creating order in step 2, also create `OrderItem` records within a `prisma.$transaction`.
   - Store `unitPrice` as snapshot (menu item price at order time).

**Verification**:
```bash
# Use Razorpay test card: 4111 1111 1111 1111, any future date, any CVV
# → Add items to cart → "Proceed to Payment" → Razorpay widget opens
# → Complete test payment → Success screen shows Bill ID (#MC-001 etc.)
# → Order appears in DB with status ORDERED
# → Student sees order in /dashboard/orders
```

**Definition of Done**:
- [ ] Razorpay order created server-side
- [ ] Client-side checkout widget opens with correct amount
- [ ] Signature verified server-side before any order confirmation
- [ ] Bill ID generated with correct outlet prefix and sequential number
- [ ] Cart cleared on successful payment
- [ ] Order record in DB with ORDERED status + paymentId + billId
- [ ] Error handling for payment failure/cancellation

---

### Phase 4 — Student Order Tracking

**Trigger**: *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase 4 from docs/MODULES.md completely."*

**Objective**: Build the "My Orders" page where students can track their order status in real-time via polling.

**Target Files**:
```
src/app/dashboard/orders/page.tsx
src/app/api/orders/my-orders/route.ts   ← GET student's orders
src/components/order-card.tsx
src/components/order-status-badge.tsx
```

**Implementation Steps**:

1. **My Orders API** (`GET /api/orders/my-orders`)
   - Authenticate: Verify session, confirm `role === STUDENT`.
   - Fetch all orders for `studentId` from DB.
   - Include: `items` (with `menuItem.name`, `unitPrice`, `quantity`), `outlet.name`.
   - Order by `createdAt DESC`.
   - Return sanitized order list (no password fields).

2. **Order Status Badge**
   - `src/components/order-status-badge.tsx`: Color-coded badge.
   - `ORDERED` → amber/yellow (Fluent: `#FFF4CE` bg, `#835C00` text)
   - `READY` → green (Fluent: `#DFF6DD` bg, `#107C10` text)
   - `DELIVERED` → blue (Fluent: `#DEECF9` bg, `#0078D4` text)

3. **Order Card**
   - `src/components/order-card.tsx`: Displays:
     - Bill ID (large, prominent) + Status Badge
     - Outlet name + order date/time
     - Item list (name × quantity = price)
     - Total amount
     - Status timeline (ORDERED → READY → DELIVERED) as step indicator

4. **My Orders Page**
   - Client Component (for auto-refresh polling).
   - Header: "My Orders" with subtitle.
   - Polling: `useEffect` with `setInterval` (every 15 seconds) to re-fetch orders.
   - Loading skeleton while fetching.
   - Empty state: "No orders yet" with CTA to browse outlets.
   - Orders list sorted by newest first.
   - Show only last 30 days of orders (or paginate).

5. **Post-Payment Redirect**
   - After successful Razorpay verification (Phase 3), redirect to `/dashboard/orders` or show a success modal with Bill ID and link to orders.

**Verification**:
```bash
# → Place an order (Phase 3 complete)
# → Navigate to /dashboard/orders
# → Order appears with ORDERED status and correct Bill ID
# → Admin marks order READY (Phase 5) → student page auto-refreshes → READY status shown
# → Admin marks DELIVERED → DELIVERED status shown
```

**Definition of Done**:
- [ ] Orders page shows all student orders
- [ ] Status badges display correct Fluent 2 colors
- [ ] Auto-refresh polling works (15s interval)
- [ ] Item breakdown displayed per order
- [ ] Bill ID prominently displayed
- [ ] Empty state handled
- [ ] Fully responsive

---

### Phase 5 — Canteen Admin Fulfillment Dashboard

**Trigger**: *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase 5 from docs/MODULES.md completely."*

**Objective**: Build the canteen admin dashboard for live order queue management, status transitions, and order search.

**Target Files**:
```
src/app/admin/layout.tsx
src/app/admin/page.tsx
src/components/admin-order-row.tsx
src/components/admin-search-bar.tsx
src/app/api/admin/orders/route.ts            ← GET outlet orders (filtered by status)
src/app/api/admin/orders/[orderId]/route.ts  ← PATCH status transition
```

**Implementation Steps**:

1. **Admin Orders API** (`GET /api/admin/orders`)
   - Authenticate: Verify session, confirm `role === ADMIN`.
   - Fetch `outletId` from `session.user.outletId`.
   - Query all orders for that outlet.
   - Include: student name, order items, outlet name.
   - Support query params: `?status=ORDERED,READY` (active) or `?status=DELIVERED` (history).
   - Return sorted: active by `createdAt ASC` (oldest first = most urgent), delivered by `createdAt DESC`.

2. **Status Update API** (`PATCH /api/admin/orders/[orderId]`)
   - Authenticate: Verify `role === ADMIN`.
   - Validate: Admin can only update orders belonging to their outlet.
   - Validate transition: `ORDERED → READY` or `READY → DELIVERED` only (no reversal).
   - Update order status in DB.
   - Return updated order.

3. **Admin Layout**
   - `src/app/admin/layout.tsx`: Desktop-optimized sidebar layout.
   - Sidebar: ZeroQ logo, outlet name, navigation items (Queue, History, Sign Out).
   - Main content area with header.
   - Min-width 1024px (no mobile optimization needed).

4. **Admin Dashboard Page**
   - `src/app/admin/page.tsx`: Client Component for real-time updates.
   - Two tabs (Shadcn `<Tabs>`): "Active Queue" | "Order History".
   - Active Queue: Shows ORDERED + READY orders.
   - History: Shows DELIVERED orders.
   - Auto-refresh every 10 seconds on Active Queue tab.
   - Search bar (filter by Bill ID or student name).
   - Order count badge on each tab.

5. **Admin Order Row**
   - `src/components/admin-order-row.tsx`: Table row for each order.
   - Columns: Bill ID | Student Name | Items Summary | Total | Time Elapsed | Status | Actions.
   - "Mark Ready" button (ORDERED → READY): Visible when status is ORDERED.
   - "Mark Delivered" button (READY → DELIVERED): Visible when status is READY.
   - Optimistic UI update on status change.
   - Confirmation before marking DELIVERED (prevent accidental clicks).

6. **Search Bar**
   - Client-side filtering (filter rendered orders by Bill ID substring or student name).
   - Instant filter as user types.

7. **Admin Search & Display**
   - Highlight matching Bill IDs in search results.
   - Clear search button.

**Verification**:
```bash
# → Login as admin.maincanteen@zeroq.app / admin123 → /admin
# → Active Queue tab shows orders for Main Canteen
# → Search by Bill ID (e.g., "MC-001") → filters correctly
# → Click "Mark Ready" → status updates to READY (optimistic + API)
# → Click "Mark Delivered" → status updates to DELIVERED
# → Delivered order moves to History tab
# → Student's /dashboard/orders reflects updated status
```

**Definition of Done**:
- [ ] Admin sees only their outlet's orders
- [ ] Active Queue and History tabs work correctly
- [ ] Status transitions ORDERED→READY→DELIVERED work
- [ ] Search by Bill ID and student name works
- [ ] Auto-refresh on active queue
- [ ] Optimistic UI updates for status changes
- [ ] Proper admin authorization (cannot access other outlet's orders)
- [ ] Desktop-optimized layout

---

## Implementation Notes for Agents

### Shared Utilities (always import from here)
- Prisma Client: `import { prisma } from "@/lib/prisma"`
- Auth Config: `import { authOptions } from "@/lib/auth"`
- Utilities: `import { cn, formatPrice, generateBillId } from "@/lib/utils"`
- Types: `import type { SessionUser, CartItem, OrderWithItems } from "@/lib/types"`

### Bill ID Prefix Map
```
main-canteen       → #MC-
rishabs-food-court → #RF-
snow-cubes         → #SC-
metro-cafe         → #MT-
pr-cafe            → #PR-
aswins-food-court  → #AF-
```

### Token Budget Note
Each phase is designed to fit within a single agent session token budget. If a phase is too large, agents may split implementation between "Phase Xa" (backend/API) and "Phase Xb" (frontend/UI) sub-phases. The trigger contract remains the same — simply reference "Phase Xa" or "Phase Xb".
