# ZeroQ — Technology Stack Specification

> Version: 1.0 | Phase: 0 — Foundation

---

## Core Technology Decisions

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Full-Stack Framework | **Next.js** | 15.5.x (App Router, CVE-patched) | Server & client rendering, API routes, routing |
| Language | **TypeScript** | 5.x | Type-safe development across the entire codebase |
| UI Library | **React** | 18.x | Component model and client interactivity |
| Styling | **Tailwind CSS** | 3.4.x | Utility-first CSS framework |
| Component Primitives | **Shadcn UI** | Latest | Accessible, unstyled Radix UI-based components |
| Design System | **Microsoft Fluent 2 Light** | — | Visual design tokens, elevation, colour system |
| Icons | **Lucide React** | 0.468+ | Icon set consistent with Fluent aesthetics |
| Database | **Supabase PostgreSQL** | PostgreSQL 15 | Relational data persistence, real-time capable |
| ORM | **Prisma** | 5.x | Type-safe DB access, migrations, schema management |
| Authentication | **NextAuth.js** | 4.x | Session management, JWT, Credentials provider |
| Password Hashing | **bcryptjs** | 2.x | Secure password storage (cost factor 12) |
| Payments | **Razorpay** | 2.x SDK | Payment gateway (Test/Sandbox mode) |
| Runtime Validation | **Zod** | 3.25.x | Schema validation for API request/response |
| Deployment | **Vercel** | — | Edge network deployment for Next.js |

---

## Framework Details

### Next.js 15 (App Router)

| Feature | Configuration |
|---------|--------------|
| Routing | App Router (`src/app/`) — file-based |
| Rendering | Server Components by default; Client Components opt-in |
| Data Fetching | Native `fetch` with `cache`, Server Actions |
| Middleware | `src/middleware.ts` — route protection & role redirects |
| Image Optimization | `next/image` with Supabase storage or `/public` assets |
| TypeScript | Strict mode enabled |
| Import Alias | `@/*` maps to `src/*` |

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## Database Layer

### Supabase PostgreSQL

| Feature | Detail |
|---------|--------|
| Host | Supabase managed PostgreSQL 15 |
| Connection Pooling | PgBouncer via `DATABASE_URL` (Transaction mode, port 6543) |
| Direct Connection | `DIRECT_URL` for Prisma migrations (port 5432) |
| Row Level Security | Disabled (Prisma handles auth-based access control) |
| Realtime | Not used in Phase 0 — polling or server-sent events considered for later |

### Prisma ORM

| Feature | Detail |
|---------|--------|
| Generator | `prisma-client-js` |
| Schema Location | `prisma/schema.prisma` |
| Migration Strategy | `prisma db push` for Supabase (schema drift check with `migrate dev` locally) |
| Client Singleton | `src/lib/prisma.ts` — prevents connection pool exhaustion in dev |
| Seeding | `tsx prisma/seed.ts` via `npm run db:seed` |

---

## Authentication

### NextAuth.js (Credentials Provider)

| Feature | Detail |
|---------|--------|
| Provider | `CredentialsProvider` — Email + Password |
| Session Strategy | JWT (stored in httpOnly cookie) |
| Token Fields | `id`, `email`, `name`, `role`, `outletId` |
| Password Hashing | `bcryptjs.compare()` during sign-in; `bcryptjs.hash(pw, 12)` on creation |
| Protected Routes | Middleware checks session presence; role-based redirect enforced |
| Role: STUDENT | Redirected to `/dashboard` |
| Role: ADMIN | Redirected to `/admin` |

---

## Payment Gateway

### Razorpay (Test Sandbox)

| Feature | Detail |
|---------|--------|
| Mode | Test (Sandbox) — no real charges |
| Order Creation | Server-side via `POST /api/orders` using `RAZORPAY_KEY_SECRET` |
| Checkout Widget | Client-side via Razorpay CDN script + `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Signature Verification | Server-side HMAC-SHA256 at `POST /api/payment/verify` |
| Bill ID Generation | After verified payment: `#[PREFIX]-[###]` pattern |

---

## UI & Design System

### Microsoft Fluent 2 Light Theme

| Token Category | Values |
|----------------|--------|
| Brand Primary | `#0078D4` |
| Brand Hover | `#106EBE` |
| Brand Pressed | `#005A9E` |
| Surface White | `#FFFFFF` |
| Surface Off-White | `#FAFAFA` |
| Surface Light Gray | `#F5F5F5` |
| Border Default | `#E0E0E0` |
| Text Primary | `#242424` |
| Text Secondary | `#616161` |
| Radius Default | `6px` (Tailwind `rounded-md`) |
| Radius Card | `8px` (Tailwind `rounded-lg`) |
| Shadow Card | `shadow-sm` |
| Font Family | Inter, system-ui, sans-serif |

### Shadcn UI Components in Use

| Component | Usage |
|-----------|-------|
| `Button` | All CTA and action buttons |
| `Card` | Outlet cards, menu item cards, order cards |
| `Badge` | Order status indicators |
| `Dialog` | Cart confirmation, order details modal |
| `Tabs` | Admin dashboard queue/history filter |
| `Avatar` | User profile display |
| `Separator` | Section dividers |
| `Toast` | Success/error feedback notifications |
| `ScrollArea` | Admin order queue scroll container |
| `Label` | Form labels for login |

---

## Deployment

### Vercel

| Feature | Detail |
|---------|--------|
| Build Command | `npm run vercel-build` (`prisma generate && next build`) or `npm run build` |
| Output | Next.js standalone |
| Environment Variables | Set via Vercel Dashboard (never in code) |
| Region | Auto (closest to Supabase region for minimal latency) |
| Serverless Functions | API routes deploy as Vercel Functions (Edge or Node.js runtime) |
| Image Domains | Configure in `next.config.ts` for Supabase storage and any CDN |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| `tsx` | Execute TypeScript files directly (used for `prisma/seed.ts`) |
| `eslint` + `eslint-config-next` | Linting with Next.js recommended rules |
| `postcss` | Required by Tailwind CSS |
| Prisma Studio | Visual DB explorer via `npm run db:studio` |
