# ZeroQ — System Architecture

> Version: 1.0 | Phase: 0 — Foundation

---

## 1. App Router Layout Structure

```
src/app/
│
├── layout.tsx                  ← Root layout: fonts, providers (SessionProvider, Toaster)
├── page.tsx                    ← Root "/" → server redirect to /login
│
├── login/
│   └── page.tsx                ← Public: Email + Password login form
│
├── dashboard/                  ← Protected: STUDENT role only (Middleware)
│   ├── layout.tsx              ← Student layout: Navbar + main content wrapper
│   ├── page.tsx                ← Outlet listing grid (6 campus outlets)
│   ├── [outletSlug]/
│   │   └── page.tsx            ← Menu catalog for selected outlet + Cart
│   └── orders/
│       └── page.tsx            ← Student "My Orders" with live status tracking
│
├── admin/                      ← Protected: ADMIN role only (Middleware)
│   ├── layout.tsx              ← Admin layout: Sidebar + header
│   └── page.tsx                ← Fulfillment queue dashboard
│
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts        ← NextAuth catch-all handler
    ├── orders/
    │   └── route.ts            ← POST: Create Razorpay order + DB record
    ├── payment/
    │   └── verify/
    │       └── route.ts        ← POST: Verify Razorpay signature + finalize order
    └── admin/
        └── orders/
            └── [orderId]/
                └── route.ts    ← PATCH: Status transition ORDERED→READY→DELIVERED
```

---

## 2. Authentication Middleware Flow

```
Incoming Request
       │
       ▼
┌─────────────────────────────────┐
│        src/middleware.ts        │
│  matchers: /dashboard/*, /admin/*│
└─────────────┬───────────────────┘
              │
              ▼
     ┌─────────────────┐
     │ getToken(req)   │  (NextAuth JWT)
     └────────┬────────┘
              │
     ┌────────▼────────┐
     │  Token exists?  │
     └────────┬────────┘
         NO   │   YES
         │    │
         ▼    ▼
    Redirect  ┌────────────────────┐
    /login    │  Check user role   │
              └────────┬───────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
     role=STUDENT               role=ADMIN
          │                         │
    ┌─────▼──────┐           ┌──────▼─────┐
    │ /dashboard │           │   /admin   │
    │  allowed   │           │  allowed   │
    └─────┬──────┘           └──────┬─────┘
          │                         │
    if accessing /admin       if accessing /dashboard
    → redirect /dashboard     → redirect /admin
```

---

## 3. Student Ordering Flow

```
Student visits /dashboard
         │
         ▼
┌─────────────────────┐
│  Outlet Listing     │  6 outlet cards (1:1 image, name, description)
└──────────┬──────────┘
           │  Click outlet
           ▼
┌─────────────────────┐
│  Menu Catalog       │  Items grid (1:1 image, name, price, quantity)
│  /dashboard/[slug]  │  + Floating Cart Drawer
└──────────┬──────────┘
           │  "Proceed to Pay" (Cart total > 0)
           ▼
┌─────────────────────┐
│  POST /api/orders   │  Server creates Razorpay Order + pending DB order
│  (Server Action)    │
└──────────┬──────────┘
           │  Returns { razorpayOrderId, amount }
           ▼
┌─────────────────────┐
│  Razorpay Checkout  │  Client-side payment widget opens
│  Widget (CDN)       │  Student completes UPI / Card / Netbanking
└──────────┬──────────┘
           │  Payment success callback
           │  { razorpay_payment_id, razorpay_order_id, razorpay_signature }
           ▼
┌─────────────────────────┐
│  POST /api/payment/     │  Server verifies HMAC-SHA256 signature
│  verify                 │  Generates Bill ID → Updates order status: ORDERED
└──────────┬──────────────┘
           │  Returns { billId, orderId }
           ▼
┌─────────────────────┐
│  Success Screen     │  Shows Bill ID (e.g., #MC-104)
│  "Your order is     │  Link to /dashboard/orders
│  being prepared"    │
└─────────────────────┘
```

---

## 4. Canteen Admin Fulfillment Flow

```
Admin logs in → /admin
         │
         ▼
┌──────────────────────────────────────┐
│        Admin Fulfillment Dashboard   │
│  ┌─────────────────┬───────────────┐ │
│  │  Active Queue   │    History    │ │  ← Tabs
│  │ ORDERED | READY │  DELIVERED   │ │
│  └────────┬────────┴───────────────┘ │
│           │                          │
│  ┌────────▼──────────────────────┐   │
│  │  Search by Bill ID / Name     │   │
│  └────────┬──────────────────────┘   │
└───────────┼──────────────────────────┘
            │
  ┌─────────▼──────────────────────┐
  │  Order Row                     │
  │  Bill ID | Student | Items | $ │
  │  [Mark Ready]  [Mark Delivered]│
  └─────────┬──────────────────────┘
            │  PATCH /api/admin/orders/[id]
            ▼
  ┌─────────────────────────────────┐
  │  Status Transition              │
  │  ORDERED → READY → DELIVERED    │
  │  (only forward, never reverse)  │
  └─────────────────────────────────┘
```

---

## 5. Razorpay Server-Side Verification Sequence

```
Client                    Server                    Razorpay
  │                          │                          │
  │  POST /api/orders        │                          │
  │  { outletId, items }     │                          │
  ├─────────────────────────►│                          │
  │                          │  Create Razorpay Order   │
  │                          │  (amount, currency, rcpt)│
  │                          ├─────────────────────────►│
  │                          │◄─────────────────────────┤
  │                          │  { razorpayOrderId }     │
  │                          │                          │
  │◄─────────────────────────┤                          │
  │  { razorpayOrderId,      │                          │
  │    amount, currency }    │                          │
  │                          │                          │
  │  [Razorpay Checkout]     │                          │
  │  User pays               │                          │
  │─────────────────────────────────────────────────────►
  │                          │                          │
  │  POST /api/payment/verify│                          │
  │  { payment_id,           │                          │
  │    order_id, signature } │                          │
  ├─────────────────────────►│                          │
  │                          │  HMAC-SHA256 verify      │
  │                          │  order_id|payment_id     │
  │                          │  with KEY_SECRET         │
  │                          │  ✓ Signature valid?      │
  │                          │                          │
  │                          │  Generate Bill ID        │
  │                          │  Update order: ORDERED   │
  │                          │  Store payment_id        │
  │                          │                          │
  │◄─────────────────────────┤                          │
  │  { success, billId }     │                          │
  │                          │                          │
```

---

## 6. Data Model Relations

```
┌──────────────┐          ┌──────────────┐
│     User     │          │    Outlet    │
│─────────────│          │─────────────│
│ id (PK)     │◄─────────│ id (PK)     │
│ name        │ outletId  │ name        │
│ email       │ (FK,ADMIN)│ slug        │
│ password    │           │ description │
│ role        │           │ imageUrl    │
│ outletId FK │           │ isActive    │
└──────┬───────┘           └──────┬──────┘
       │                          │
       │ studentId (FK)           │ outletId (FK)
       │                          │
       ▼                          ▼
┌──────────────────────────────────────────┐
│                  Order                   │
│─────────────────────────────────────────│
│ id (PK)                                  │
│ billId (UNIQUE) e.g. "#MC-104"           │
│ status: ORDERED | READY | DELIVERED      │
│ totalAmount                              │
│ paymentId (Razorpay)                     │
│ studentId (FK → User)                    │
│ outletId  (FK → Outlet)                  │
└──────────────────────┬───────────────────┘
                       │ orderId (FK)
                       ▼
              ┌────────────────┐
              │   OrderItem    │
              │───────────────│
              │ id (PK)       │◄────────────────┐
              │ quantity      │                  │ menuItemId (FK)
              │ unitPrice     │                  │
              │ orderId FK    │           ┌──────┴───────┐
              │ menuItemId FK │           │   MenuItem   │
              └───────────────┘           │─────────────│
                                          │ id (PK)     │
                                          │ name        │
                                          │ price       │
                                          │ imageAsset  │
                                          │ category    │
                                          │ isAvailable │
                                          │ outletId FK │
                                          └─────────────┘
```

---

## 7. Bill ID Generation Strategy

```typescript
// src/lib/utils.ts
// Outlet prefix map
const OUTLET_PREFIXES: Record<string, string> = {
  "main-canteen":       "MC",
  "rishabs-food-court": "RF",
  "snow-cubes":         "SC",
  "metro-cafe":         "MT",
  "pr-cafe":            "PR",
  "aswins-food-court":  "AF",
};

// Generate next Bill ID atomically in a Prisma transaction
async function generateBillId(outletSlug: string, prisma: PrismaClient): Promise<string> {
  const prefix = OUTLET_PREFIXES[outletSlug] ?? "ZQ";
  const lastOrder = await prisma.order.findFirst({
    where: { outlet: { slug: outletSlug } },
    orderBy: { createdAt: "desc" },
    select: { billId: true },
  });
  const lastNumber = lastOrder
    ? parseInt(lastOrder.billId.split("-")[1] ?? "0", 10)
    : 0;
  const next = String(lastNumber + 1).padStart(3, "0");
  return `#${prefix}-${next}`;
}
```

---

## 8. Middleware Configuration

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (pathname.startsWith("/dashboard") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```
