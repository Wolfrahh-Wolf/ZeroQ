# AGENTS.md — ZeroQ Agent Operating Protocol

> **Standard Trigger Contract:**
> *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."*

This document defines the operating rules, conventions, and constraints for all coding agents working on the ZeroQ codebase. **Read this file first before writing any code.**

---

## 1. Repository Context

- **Project**: ZeroQ — Campus Canteen Pre-Ordering & Transit-Time Optimization Portal
- **Stack**: Next.js 15 (App Router, TypeScript), Tailwind CSS, Shadcn UI, Prisma ORM, Supabase PostgreSQL, NextAuth.js, Razorpay
- **Design System**: Microsoft Fluent 2 Light Theme
- **Phase Plan**: See `docs/MODULES.md` for full phased implementation roadmap

---

## 2. Core Coding Rules

### 2.1 TypeScript
- Use **strict TypeScript** throughout — no `any` types.
- Define explicit interfaces/types for all API request/response shapes.
- Use Zod for runtime validation on all API routes.
- Keep types co-located with their feature modules or in `src/lib/types.ts`.

### 2.2 Next.js App Router Conventions
- All pages go under `src/app/` following the App Router file conventions:
  - `page.tsx` → route component
  - `layout.tsx` → shared layout wrapper
  - `loading.tsx` → Suspense loading UI
  - `error.tsx` → error boundary
- Use **Server Components by default**. Only add `"use client"` when:
  - The component uses browser APIs (e.g., `window`, `localStorage`)
  - The component uses React hooks (`useState`, `useEffect`, etc.)
  - The component handles user interactions
- Use Next.js **Server Actions** (`"use server"`) for form mutations wherever possible.
- Use `next/image` for all image rendering — never bare `<img>` tags.
- Use `next/link` for all navigation — never bare `<a>` tags.
- Use `next/navigation` hooks (`useRouter`, `usePathname`) in client components.

### 2.3 API Routes
- All API routes live under `src/app/api/`.
- Use `NextRequest` / `NextResponse` from `next/server`.
- Always validate request body with Zod before processing.
- Always return structured JSON: `{ success: boolean, data?: ..., error?: string }`.
- Never expose raw database errors to the client — sanitize error messages.
- Always check authentication via `getServerSession(authOptions)` in protected routes.

### 2.4 Authentication (NextAuth.js)
- NextAuth configuration lives in `src/lib/auth.ts` (exported as `authOptions`).
- Use the **Credentials Provider** with `bcryptjs` for password hashing.
- Session strategy: **JWT** (not database sessions — Prisma adapter conflicts avoided).
- Extend the JWT/Session type to include `id`, `role`, and `outletId` fields.
- Role-based redirect after login:
  - `STUDENT` → `/dashboard`
  - `ADMIN` → `/admin`
- Middleware (`src/middleware.ts`) protects `/dashboard` and `/admin` routes.
- Admins cannot access student dashboard; students cannot access admin dashboard.

### 2.5 Prisma ORM Patterns
- Prisma Client is a singleton — import from `src/lib/prisma.ts`, never instantiate directly.
- Always use `select` or `include` explicitly — never leak password hashes to client.
- Use `prisma.$transaction([...])` for multi-step operations that must be atomic.
- Use `upsert` for seed data to ensure idempotency.
- Never run migrations in production via `migrate dev` — use `db push` or `migrate deploy`.

```typescript
// ✅ CORRECT — Prisma singleton pattern
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 2.6 Razorpay Payment Flow
- **Server-side only**: Razorpay order creation happens in `POST /api/orders`.
- **Client-side**: Razorpay checkout widget loads via the public key (`NEXT_PUBLIC_RAZORPAY_KEY_ID`).
- **Verification**: After payment, client sends `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to `POST /api/payment/verify`.
- Verify signature using HMAC-SHA256: `hmac_sha256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)`.
- Only mark order `ORDERED` (and generate Bill ID) after successful signature verification.
- Bill ID format: `#[OUTLET_PREFIX]-[3-digit-sequential-number]` (e.g., `#MC-104`, `#RF-023`).

---

## 3. Design System Rules (Microsoft Fluent 2 Light Theme)

### 3.1 Color Tokens (Enforce Strictly)
```css
/* Primary Brand */
--fluent-brand-primary: #0078D4;
--fluent-brand-hover:   #106EBE;
--fluent-brand-pressed: #005A9E;

/* Neutral Surfaces */
--fluent-neutral-bg:        #FFFFFF;
--fluent-neutral-bg-2:      #FAFAFA;
--fluent-neutral-bg-3:      #F5F5F5;
--fluent-neutral-stroke:    #E0E0E0;
--fluent-neutral-stroke-2:  #C8C8C8;

/* Text */
--fluent-text-primary:   #242424;
--fluent-text-secondary: #616161;
--fluent-text-disabled:  #BDBDBD;

/* Status */
--fluent-status-ordered:   #F3F2F1; /* warm neutral */
--fluent-status-ready:     #DFF6DD; /* green tint */
--fluent-status-delivered: #DEECF9; /* blue tint */
```

### 3.2 Component Rules
- **All cards** must use `rounded-lg border border-slate-200 bg-white shadow-sm`.
- **Outlet cards & menu item cards** must use `aspect-square object-cover` on their image containers.
- **Buttons**: Use Shadcn UI `<Button>` component. Primary = `variant="default"` (maps to brand blue).
- **Status badges** must use the Fluent status fills defined above — never generic Tailwind colors.
- **Typography**: Use `font-sans` (Inter or system-ui). Headings: `font-semibold`. Body: `font-normal`.
- **Spacing**: Stick to Tailwind's scale (4px base). Avoid arbitrary values like `p-[17px]`.

### 3.3 Layout Rules
- **Banned**: Absolute positioning hacks (`top-[x]`, `left-[x]`) for structural layouts.
- **Allowed**: CSS Grid and Flexbox via Tailwind utilities.
- **Student portal** (`/dashboard`, `/dashboard/orders`): Must be **fully responsive** (mobile + PC).
- **Admin dashboard** (`/admin`): Desktop-optimized only (min-width: 1024px).
- Outlet grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (student portal).
- Menu item grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` (student portal).
- Admin queue table: Full-width data table with sticky header.

---

## 4. File Structure Conventions

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (Providers, fonts)
│   ├── page.tsx                    # Root redirect → /login
│   ├── login/
│   │   └── page.tsx                # Login page (single gateway)
│   ├── dashboard/
│   │   ├── layout.tsx              # Student layout (navbar)
│   │   ├── page.tsx                # Outlet listing
│   │   ├── [outletSlug]/
│   │   │   └── page.tsx            # Menu catalog for outlet
│   │   └── orders/
│   │       └── page.tsx            # Student order history & status
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (sidebar)
│   │   └── page.tsx                # Admin fulfillment dashboard
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts        # NextAuth handler
│       ├── orders/
│       │   └── route.ts            # POST: create order + Razorpay order
│       ├── payment/
│       │   └── verify/
│       │       └── route.ts        # POST: verify Razorpay signature
│       └── admin/
│           └── orders/
│               └── [orderId]/
│                   └── route.ts    # PATCH: update order status
├── components/
│   ├── ui/                         # Shadcn UI primitives
│   ├── outlet-card.tsx             # Outlet browsing card (1:1 image)
│   ├── menu-item-card.tsx          # Menu item card (1:1 image, add to cart)
│   ├── cart-drawer.tsx             # Slide-in cart panel
│   ├── order-status-badge.tsx      # ORDERED / READY / DELIVERED badge
│   ├── admin-order-row.tsx         # Admin table row with status controls
│   └── navbar.tsx                  # Student portal top navigation
└── lib/
    ├── auth.ts                     # NextAuth authOptions configuration
    ├── prisma.ts                   # Prisma client singleton
    ├── razorpay.ts                 # Razorpay server-side client
    ├── types.ts                    # Shared TypeScript types
    └── utils.ts                    # cn(), formatPrice(), generateBillId()
```

---

## 5. Security Rules

- **Never** commit `.env.local` or any real credentials.
- **Never** expose `RAZORPAY_KEY_SECRET` to the client — it is server-only.
- **Always** verify the Razorpay signature server-side before confirming any order.
- **Always** validate that the authenticated user owns the resource they're accessing.
- **Always** hash passwords with `bcryptjs` (cost factor ≥ 12) — never store plain text.
- **Always** use `getServerSession(authOptions)` in Server Components/API routes for auth checks.
- Admin API routes must verify `session.user.role === "ADMIN"` before executing.

---

## 6. Agent Checklist Before Submitting Work

- [ ] All new files follow the directory conventions in Section 4.
- [ ] No `any` TypeScript types introduced.
- [ ] All API routes validated with Zod.
- [ ] Auth checks present on all protected routes.
- [ ] Image components use `next/image`.
- [ ] Navigation uses `next/link`.
- [ ] New Prisma queries use `select`/`include` — no password leaks.
- [ ] Outlet and menu item cards use `aspect-square object-cover`.
- [ ] Status badges use Fluent 2 status color tokens.
- [ ] Student-facing pages are responsive (mobile + PC).
- [ ] No absolute layout hacks in structural components.
- [ ] `prisma generate` is not needed manually (runs via `postinstall`).

---

## 7. Phase Execution Reference

Phases are defined in `docs/MODULES.md`. Each phase has:
- **Trigger**: The exact command to activate the agent.
- **Target files**: Specific files to create/modify.
- **Implementation steps**: Ordered list of tasks.
- **Verification**: How to confirm the phase is complete.
- **Definition of Done**: Acceptance criteria.
