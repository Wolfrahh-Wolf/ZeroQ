# TASK: Phase 0 — Foundation Setup, Documentation Blueprints & Database Provisioning for ZeroQ

## 1. ACADEMIC & PROJECT CONTEXT
You are scaffolding the repository for **ZeroQ**, a prototype web portal developed for a Design Thinking academic paper. 
- **Core Concept**: Eliminating campus canteen waiting times by converting wait time into travel time. Students pre-order while walking from their classrooms so their food is ready upon arrival.
- **Outlets in Scope**:
  1. **MC** – Main Canteen
  2. **Rishab Food Court**
- **Evaluation Deliverables**: A fully functioning prototype with a clean, high-velocity UI demonstrating live state updates between students and canteen administrators.

---

## 2. POLISHED WORKFLOW & CORE PRODUCT CONTEXT
Review and incorporate this exact flow and constraint context into the application design:
- **Root Page (`/`)**: No login or authentication as of now. The root page presents two clean role cards describing the roles. Choosing a role routes directly to a role-specific dashboard with the respective features.
- **Payment Constraint**: No external payment gateways. Clicking "Pay" instantly places the order.
- **Real-Time UI State**: Pages for both users (Students and Canteen Admins) must update to reflect all order status changes dynamically.
- **Outlets**: 1) MC (Main Canteen), 2) Rishab Food Court.
- **Student Flow**: Enters portal via role card, chooses outlet, browses food items, selects quantities, places order (mock pay), reaches venue, and collects food once ready using a simple Order ID.
- **Admin Flow**: Enters portal via role card, views the live listing of all orders, updates status from `"Ordered"` to `"Ready"`, and marks orders as `"DELIVERED"` by either selecting from the list or entering the student's Order ID.

---

## 3. CORE ARCHITECTURAL CONSTRAINTS & TECH STACK
- **Tech Stack**:
  - **Framework**: Next.js (App Router) with TypeScript
  - **Styling**: Tailwind CSS + Shadcn UI (or Bootstrap)
  - **Database**: Oracle Database via Docker container (`image: gvenzl/oracle-free:slim`)
- **Coding Philosophy**:
  - Keep the root clean and well-structured.
  - Ensure ultra-clean, modern, mobile-friendly UI suitable for a Design Thinking prototype. No academic mentions in user-facing code or documents.

---

## 4. REPOSITORY STRUCTURE RULES
Keep the root clean and place concise documentation in `docs/` (strictly short & crisp, under 100 lines each):

```text
.
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── docker-compose.yml
├── db/
│   ├── 01_init.sh
│   └── schema.sql
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   └── MODULES.md
└── src/

```

---

## 5. REQUIRED DELIVERABLES TO GENERATE (PHASE 0)

### 1. `docker-compose.yml` & Initialization Script (`db/01_init.sh`)

* **`docker-compose.yml`**: Containerized Oracle Database using `gvenzl/oracle-free:slim`. Map port `1521:1521`, configure persistent volume mapping, database name (`FREEPDB1`), default credentials, and mount `db/01_init.sh` to `/container-entrypoint-initdb.d/01_init.sh:ro` along with `schema.sql` to `/opt/oracle/scripts/schema.sql:ro`.
* **`db/01_init.sh`**: Shell script executed on container startup to initialize and run `schema.sql` via `sqlplus`.

### 2. `db/schema.sql`

* Complete, runnable DDL for Oracle Database defining tables, primary/foreign keys, check constraints for statuses (`'ORDERED'`, `'READY'`, `'DELIVERED'`), and realistic seed data for **MC** and **Rishab Food Court**.

### 3. `.env.example` & `.gitignore`

* `.env.example`: Database connection strings template (`jdbc:oracle:thin:@localhost:1521/FREEPDB1`, etc.).
* `.gitignore`: Standard Node.js, Next.js, Docker, OS, and `.env` ignore files.

### 4. `AGENTS.md` (Root)

* Context and operating protocol for coding agents working on subsequent phases, emphasizing UI polish, instant state synchronization, and simple role-based navigation.

### 5. `README.md` (Root)

* Brief project overview, prerequisites, and quick-start instructions (starting Docker container, running the Next.js development server).

### 6. Documentation in `docs/` (Short & Crisp — Under 100 lines each)

* **Standardized Agent Trigger Contract** (to be included at the top of `docs/MODULES.md`):
> *`"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."`*


* **`docs/TECH_STACK.md`**: Ultra-short specifications for Next.js, Tailwind CSS, and Oracle Free DB.
* **`docs/ARCHITECTURE.md`**: Concise high-level data flow and root role-card routing strategy.
* **`docs/MODULES.md`**: Contains the Trigger Contract above followed by the feature breakdown:
* Module 1: Role Selection Landing Page (Student vs. Admin cards, no login).
* Module 2: Outlet & Menu Management (MC & Rishab Food Court).
* Module 3: Cart & Mock Instant Checkout (Generates Order ID).
* Module 4: Student Order Tracking View (Live status synchronization).
* Module 5: Canteen Admin Live Queue & Fulfillment Dashboard (`Ordered` $\rightarrow$ `Ready` $\rightarrow$ `Delivered` via list or Order ID input).



---

## 6. EXECUTION INSTRUCTION

Generate all listed files and directories with complete, syntactically correct, and immediately usable contents. Do not output placeholders or deferred TODOs.

NOTE: Please maintain a good and consistent UI.

```
