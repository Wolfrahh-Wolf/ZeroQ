# Architecture — ZeroQ

## High-Level Data Flow

```
Browser (Next.js Client)
        │
        │  HTTP (fetch / polling)
        ▼
Next.js Route Handlers  (/api/*)
        │
        │  node-oracledb (thin mode)
        ▼
Oracle Free DB (FREEPDB1)  ←  Docker volume
```

## Role-Based Routing

```
/  (Landing Page)
├── [Student Card]  →  /student
│       ├── /student/outlets        — choose MC or Rishab
│       ├── /student/menu/[id]      — browse & add to cart
│       ├── /student/checkout       — review cart & mock pay
│       └── /student/track/[orderId]— live order status
│
└── [Admin Card]   →  /admin
        └── /admin/queue            — live order queue, status controls
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No authentication | Prototype scope; simplifies UX for demo |
| Client polling (3 s) | Avoids WebSocket complexity; sufficient for demo latency |
| Mock payment | No payment gateway integration needed for prototype |
| `ZQ-XXXX` Order IDs | Human-readable, easy to verbally communicate at pickup counter |
| Oracle Free in Docker | Matches production-class DB behaviour without cloud cost |
| Shadcn UI | Provides accessible, unstyled primitives that integrate cleanly with Tailwind |

## Database Entity Relationships

```
outlets ──< menu_items
outlets ──< orders ──< order_items >── menu_items
```

## API Surface (planned)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/outlets` | List active outlets |
| GET | `/api/outlets/[id]/menu` | Menu items for an outlet |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/[id]` | Single order status |
| PATCH | `/api/orders/[id]` | Update order status |
