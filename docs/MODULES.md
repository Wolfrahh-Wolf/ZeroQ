# Modules — ZeroQ

## Agent Trigger Contract
> *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."*

---

## Module 1 — Role Selection Landing Page (Phase 1)
**Route**: `/`

- Full-viewport dark glassmorphism layout.
- Two role cards side by side: **Student** and **Admin**.
- Each card shows role icon, title, one-line description, and a "Enter" CTA button.
- Clicking Student → `/student/outlets`; Admin → `/admin/queue`.
- No login, no session, no state persisted across roles.
- Must be mobile-responsive (cards stack vertically on small screens).

---

## Module 2 — Outlet & Menu Management (Phase 2)
**Routes**: `/student/outlets`, `/student/menu/[outletId]`

- Outlet selection page lists MC and Rishab Food Court with card UI.
- Menu page fetches items from `/api/outlets/[id]/menu`.
- Items grouped by **category** (Meals, Snacks, Beverages, etc.).
- Each card: name, description, price, +/− quantity stepper.
- Sticky **"View Cart"** floating button shows item count & subtotal.
- API: `GET /api/outlets`, `GET /api/outlets/[id]/menu`.

---

## Module 3 — Cart & Mock Instant Checkout (Phase 3)
**Route**: `/student/checkout`

- Cart summary: item list, quantities, subtotal.
- Student name input (required, stored with order).
- **"Pay Now"** button → `POST /api/orders` → receives `{ orderId: "ZQ-XXXX" }`.
- On success: redirect to `/student/track/[orderId]`.
- No external payment; order is created instantly.

---

## Module 4 — Student Order Tracking View (Phase 4)
**Route**: `/student/track/[orderId]`

- Displays Order ID, outlet name, item list, total.
- Live **status badge** polling `GET /api/orders/[id]` every 3 s.
- Status progression UI: `ORDERED` → `READY` → `DELIVERED`.
- Visual celebration (confetti / toast) when status reaches `READY`.
- Clear "Your order is ready — collect at counter!" message.

---

## Module 5 — Admin Live Queue & Fulfillment Dashboard (Phase 5)
**Route**: `/admin/queue`

- Live table of all orders across both outlets, newest first.
- Columns: Order ID, outlet, student name, items summary, time, status.
- Polling every 3 s; new rows animate in.
- **Status action buttons**: `Mark Ready` (ORDERED → READY), `Mark Delivered` (READY → DELIVERED).
- **Quick Deliver** input at top: enter Order ID → one-click mark Delivered.
- API: `GET /api/orders`, `PATCH /api/orders/[id]`.
- Filter tabs: All | Ordered | Ready | Delivered.
