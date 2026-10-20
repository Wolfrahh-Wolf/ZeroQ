# Tech Stack — ZeroQ

## Frontend
| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 14** (App Router) | File-based routing, Server Components, API Routes |
| Language | **TypeScript** | Strict mode enabled |
| Styling | **Tailwind CSS v3** | Utility-first, dark-mode via `class` strategy |
| Components | **Shadcn UI** | Radix UI primitives, copy-owned components in `src/components/ui/` |

## Backend / Data
| Layer | Choice | Notes |
|-------|--------|-------|
| Database | **Oracle Database Free 23ai** | Containerised via `gvenzl/oracle-free:slim` |
| Driver | **node-oracledb v6** | Thin mode — no Instant Client binary required |
| API | **Next.js Route Handlers** | `src/app/api/` — REST-style JSON endpoints |
| Real-time | **Client-side polling** | `setInterval` at `NEXT_PUBLIC_POLL_INTERVAL_MS` (default 3 s) |

## Infrastructure
| Tool | Purpose |
|------|---------|
| Docker Compose | Oracle DB container lifecycle |
| `.env.local` | Local secrets (never committed) |

## Key Constraints
- No external auth (role selected on landing page)
- No payment gateway (mock instant checkout)
- Status flow: `ORDERED` → `READY` → `DELIVERED` only
