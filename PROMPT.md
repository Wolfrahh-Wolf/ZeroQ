# TASK: Phase 0 — Foundation Setup, Documentation Blueprints & Database Provisioning for ZeroQ

## 1. PROJECT CONTEXT & ABSTRACT
You are scaffolding a repository for **ZeroQ**, a production-grade campus pre-ordering and transit-time optimization web portal.

### Abstract
**ZeroQ — Campus Canteen Pre-Ordering & Transit-Time Optimization Portal**:
Develop a production-grade web application for college campuses where students can browse campus outlet menus, pre-order meals during transit from classrooms, and complete secure online payments via Razorpay. Next.js (App Router) serves as the full-stack responsive web interface and backend API layer, while Prisma ORM manages transactional database interactions. Supabase PostgreSQL stores relational records encompassing users, role-based access control, campus outlets, categorized menu items, and real-time order lifecycle states (`ORDERED` -> `READY` -> `DELIVERED`). Canteen administrators manage incoming orders through a live fulfillment queue dashboard, verifying orders via unique human-readable Bill IDs. NextAuth.js (Credentials Provider) secures authentication across student and administrator roles.

---

## 2. PROBLEM STATEMENT & CORE WORKFLOW

### Problem Statement
The standard 1-hour college lunch break is insufficient for students to travel across campus to canteens/cafes, stand in long queues, place an order, wait for preparation, and eat comfortably.

### Solution & Flow
ZeroQ converts waiting time into travel time by enabling pre-ordering during transit.
- **Single Gateway Login (`/login`)**: Role-based authentication via Email & Password using NextAuth.js.
  - `STUDENT / USER` -> Redirects to **Student / USER  Portal (`/dashboard`)**.
  - `ADMIN` -> Redirects to **Canteen Admin Dashboard (`/admin`)**.
- **Outlets in Scope**:
  1. Main Canteen
  2. Rishab's Food Court
  3. Snow Cubes
  4. Metro Cafe
  5. PR Cafe
  6. Aswin's Food Court
- **Student Flow**: Selects an outlet -> Browses menu items (Name, Image, Price, Quantity) -> Adds items to cart -> Pays via Razorpay Test API -> Receives a unique, short human-readable **Bill ID** (e.g., `#MC-104`) -> Tracks order status (`ORDERED` -> `READY` -> `DELIVERED`) in "My Orders".
- **Canteen Admin Flow**: Views live order queue for their assigned outlet -> Filters by Active Queue (`ORDERED` / `READY`) vs History (`DELIVERED`) -> Searches orders by Bill ID or student name -> Toggles order status from `ORDERED` to `READY` when food is prepared -> Marks order as `DELIVERED` when student presents their Bill ID at the counter.

---

## 3. CORE ARCHITECTURAL CONSTRAINTS & DESIGN SYSTEM

### A. Tech Stack
- **Full-Stack Framework**: Next.js 14/15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Microsoft Fluent 2 Light Theme guidelines + Shadcn UI + Lucide Icons
- **Database & ORM**: Supabase PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider) + `bcryptjs`
- **Payments**: Razorpay Standard SDK (Test / Sandbox Mode)
- **Deployment**: Vercel-ready

### B. UI/UX & Design System (Microsoft Fluent 2 Light Theme)
- **Design Philosophy**: Adhere to the official **Microsoft Fluent 2 Light Theme** design principles. The UI must feel crisp, highly functional, enterprise-grade, clean, and professional with subtle elevation, precise typography, soft rounded corners, and neutral depth.
- **Color Palette & Tokens**:
  - Follow Fluent 2 Light Theme color tokens across light backgrounds, soft borders, subtle hover highlights, and neutral surface cards.
  - Use Fluent neutral fills (`#FFFFFF`, `#F5F5F5`, `#FAFAFA`) paired with Fluent Brand Blue accents (`#0078D4` / `#106EBE`) for key interactive surfaces, navigation highlights, and call-to-action buttons.
  - Status badges must strictly use Fluent 2 Light status fills and stroke colors for `ORDERED`, `READY`, and `DELIVERED` states.
- **Card & Aspect Ratio Constraints**:
  - **1:1 Square Aspect Ratio**: Every Outlet Card and Food Item Card must feature a fixed `1:1` aspect ratio image container (`aspect-square` or `aspect-ratio: 1 / 1`) with `object-cover` styling to cleanly display outlet/item thumbnails that will be populated in the repository assets.
  - Card containers should use subtle Fluent 2 elevation shadows (`shadow-sm` or `shadow-md`), thin neutral borders (`border border-slate-200`), and consistent padding (`p-4` or `p-5`).
- **Responsive Layout Rules**:
  - NOTE: All Student/User-facing portal pages must be built fully responsive for PC and Mobile screens simultaneously. The Canteen Admin dashboard pages remain optimized exclusively for PC/Desktop screen viewports.
  - Banned: No absolute layout hacks (`top-[x]`, `left-[x]`) for core page structural layouts. Always use standard CSS Grid or Flexbox wrappers.
---

## 4. REPOSITORY STRUCTURE RULES
Keep root clean and place architectural blueprints in `docs/`:

```text
.
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
├── prisma/
│   └── schema.prisma
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   └── MODULES.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── login/
    │   ├── dashboard/
    │   ├── admin/
    │   └── api/
    ├── components/
    └── lib/
```

---

## 5. REQUIRED DELIVERABLES TO GENERATE (PHASE 0)

### 1. `prisma/schema.prisma`
- Complete, runnable Prisma Schema mapping for PostgreSQL:
  - Models: `User` (with roles `STUDENT`, `ADMIN`), `Outlet`, `MenuItem`, `Order` (statuses: `ORDERED`, `READY`, `DELIVERED`), and `OrderItem`.
  - Proper foreign key relations, constraints, and unique fields (`email`, `billId`).

### 2. `.env.example` & `.gitignore`
- `.env.example`: Placeholders for `DATABASE_URL` (connection pooling), `DIRECT_URL` (direct migration connection), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
- `.gitignore`: Standard Node.js, Next.js, Prisma, Vercel, and OS ignore files.

### 3. `AGENTS.md` (Root)
- Operating protocol for coding agents working on subsequent execution phases.
- Rules on Next.js App Router conventions, Microsoft Fluent 2 Light styling tokens, Prisma query patterns, Razorpay test payment handling, and session state security.

### 4. `README.md` (Root)
- Concise project overview, prerequisites, and quick-start instructions:
  - Installing dependencies (`npm install`).
  - Running Prisma migrations (`npx prisma db push`).
  - Executing local development server (`npm run dev`).

### 5. Documentation in `docs/`
- **`docs/TECH_STACK.md`**:
  - Concise specification tables for Next.js, TypeScript, Supabase PostgreSQL, Prisma ORM, NextAuth.js, Razorpay API, Fluent 2 Light design system, and Vercel hosting.
- **`docs/ARCHITECTURE.md`**:
  - Next.js App Router layout structure, authentication middleware flow, Microsoft Fluent 2 component hierarchy, and Razorpay server-side verification sequence diagram.
- **`docs/MODULES.md`**:
  - **Standardized Agent Trigger Contract**:
    > *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."*
  - **Feature Catalog**:
    - Module 1: Role-Based Authentication (`/login`, NextAuth Credentials Provider, Session protection).
    - Module 2: Outlet Browsing & Menu Catalog (`/dashboard`, supporting the 6 outlets with 1:1 image ratios).
    - Module 3: Razorpay Test Checkout & Bill ID Generation (`/api/orders`, `/api/payment/verify`).
    - Module 4: Student Order Tracking (`/dashboard/orders`, live status updates).
    - Module 5: Canteen Admin Fulfillment Dashboard (`/admin`, live queue, search by Bill ID, status transitions).
  - **Balanced Phased Execution Plan**:
    - Detailed phase-by-phase breakdown (Phases 1 through 5) containing explicit file targets, implementation steps, verification scripts/tests, and definition of done for subsequent agent runs.  If needed you can split any module or add module for development simplicity and to get the the development done within token limits of that session(Entire development is gonna done ANtigravity with Claude Sonnet), so please plan the modules accordingly.

### 6. ADDITIONAL DELIVERABLES & IMAGE ASSET GUIDELINES

#### A. Comprehensive Database Seeding (`prisma/seed.ts`)
- The AI agent must generate a fully runnable database seeder script in `prisma/seed.ts` configured under the `"prisma": { "seed": "tsx prisma/seed.ts" }` block in `package.json`.
- The seeder must automatically populate:
  - Default user accounts (at least one `STUDENT` and one `ADMIN`).
  - All 6 campus outlets:
    1. Main Canteen
    2. Rishab's Food Court
    3. Snow Cubes
    4. Metro Cafe
    5. PR Cafe
    6. Aswin's Food Court
  - Shop-agnostic sample menu items across categories mapped directly to reusable image asset identifiers.

#### B. Shop-Agnostic Image Asset Strategy
- Menu items must be designed with shop-agnostic image references (e.g., generic asset tags like `beverage-iced-coffee.png`, `meal-south-indian-dosa.png`, `snack-veg-burger.png`) so that multiple outlets sharing similar menu categories can cleanly share or map standardized thumbnail assets without requiring redundant file duplicates.

#### C. Image Asset Requirement Manifest (`docs/IMAGE_MANIFEST.md`)
- The agent must generate a short, crisp Markdown file at `docs/IMAGE_MANIFEST.md` detailing every image file needed for the application.
- The manifest must include:
  - File Name / ID (e.g., `outlet-main-canteen.webp`, `item-masala-dosa.png`)
  - Target Entity (Outlet or Food Category)
  - File Type Format (`.jpeg` or `.jpg` or `.png`)
  - Strict Aspect Ratio Specification (`1:1` square ratio, `aspect-square object-cover`)
  - Master AI Image Generation Prompt template corresponding to each asset category for subsequent asset production.
---

## 6. EXECUTION INSTRUCTION
Generate all listed files and directories with complete, syntactically correct, and immediately usable contents. Do not output placeholders, omitted sections, or deferred TODOs.