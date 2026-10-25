# ZeroQ — Campus Canteen Pre-Ordering & Transit-Time Optimization Portal

> **Convert waiting time into travel time.** ZeroQ lets students pre-order campus meals during transit so food is ready when they arrive — eliminating queue time entirely.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Default Login Credentials](#default-login-credentials)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

---

## Overview

ZeroQ solves a fundamental problem on college campuses: the standard 1-hour lunch break is insufficient for students to traverse campus, queue, order, wait for food preparation, and eat comfortably.

**Solution**: Students place orders from their phones while walking to the canteen. By the time they arrive, the food is already prepared and waiting — confirmed via a unique human-readable **Bill ID** (e.g., `#MC-104`).

### Campus Outlets Supported

| # | Outlet | Admin Login |
|---|--------|-------------|
| 1 | Main Canteen | admin.maincanteen@zeroq.app |
| 2 | Rishab's Food Court | admin.rishabs@zeroq.app |
| 3 | Snow Cubes | admin.snowcubes@zeroq.app |
| 4 | Metro Cafe | admin.metrocafe@zeroq.app |
| 5 | PR Cafe | admin.prcafe@zeroq.app |
| 6 | Aswin's Food Court | admin.aswins@zeroq.app |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn UI (Microsoft Fluent 2 Light Theme)
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Credentials Provider)
- **Payments**: Razorpay (Test / Sandbox Mode)
- **Deployment**: Vercel

---

## Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- A **Supabase** project with PostgreSQL database
- A **Razorpay** account (test mode keys)

---

## Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/zeroq.git
cd zeroq
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local and fill in your actual values
```

See [Environment Variables](#environment-variables) for details.

### 3. Run Database Migrations

```bash
# Push schema to Supabase PostgreSQL (recommended for Supabase)
npm run db:push

# OR run tracked migrations
npm run db:migrate
```

### 4. Seed the Database

```bash
npm run db:seed
```

This populates all 6 outlets, 6 admin accounts, 1 student account, and ~50 menu items.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase connection pooling URL (via PgBouncer) |
| `DIRECT_URL` | Supabase direct connection (for Prisma migrations) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session signing |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3001` for local dev) |
| `RAZORPAY_KEY_ID` | Razorpay test Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test Key Secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (exposed to client) |

---

## Database Setup

### Prisma Commands

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Sync schema to database (no migration files) |
| `npm run db:migrate` | Create & apply tracked migration files |
| `npm run db:seed` | Populate database with default data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:generate` | Regenerate Prisma Client after schema changes |

### Schema Overview

```
User (STUDENT | ADMIN) ──┐
                          ├──> Order ──> OrderItem ──> MenuItem
Outlet ───────────────────┘         └──> Outlet
```

Order statuses: `ORDERED` → `READY` → `DELIVERED`

---

## Default Login Credentials

> ⚠️ **Change all passwords before deploying to production.**

| Role | Email | Password |
|------|-------|----------|
| Student | student@zeroq.app | student123 |
| Admin (Main Canteen) | admin.maincanteen@zeroq.app | admin123 |
| Admin (Rishab's) | admin.rishabs@zeroq.app | admin123 |
| Admin (Snow Cubes) | admin.snowcubes@zeroq.app | admin123 |
| Admin (Metro Cafe) | admin.metrocafe@zeroq.app | admin123 |
| Admin (PR Cafe) | admin.prcafe@zeroq.app | admin123 |
| Admin (Aswin's) | admin.aswins@zeroq.app | admin123 |

---

## Project Structure

```
zeroq/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
├── docs/
│   ├── ARCHITECTURE.md      # System architecture & flow diagrams
│   ├── MODULES.md           # Phased implementation plan
│   ├── TECH_STACK.md        # Technology specification
│   └── IMAGE_MANIFEST.md   # Image asset requirements
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Root → redirects to /login
│   │   ├── login/           # Single gateway login
│   │   ├── dashboard/       # Student portal
│   │   ├── admin/           # Canteen admin dashboard
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   └── lib/                 # Shared utilities, auth config, prisma client
├── .env.example
├── .gitignore
├── AGENTS.md               # Agent operating protocol
└── package.json
```

---

## Documentation

| File | Purpose |
|------|---------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | App Router layout, auth flow, payment verification |
| [`docs/MODULES.md`](docs/MODULES.md) | Phased implementation plan (Phases 1–5) |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | Technology choices and specifications |
| [`docs/IMAGE_MANIFEST.md`](docs/IMAGE_MANIFEST.md) | Image asset manifest with AI generation prompts |
| [`AGENTS.md`](AGENTS.md) | Agent operating protocol for code execution phases |

---

## License

This project is licensed under the MIT License.
