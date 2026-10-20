# AGENTS.md — ZeroQ Coding Agent Protocol

## What is ZeroQ?
A campus canteen pre-order portal. Students order food while walking to the canteen so it is ready on arrival. Two outlets: **MC** (Main Canteen) and **Rishab Food Court**.

## Roles
| Role | Entry Point | Key Actions |
|------|------------|-------------|
| **Student** | `/` → Student card | Browse outlet → Add to cart → Mock pay → Track order |
| **Admin** | `/` → Admin card | Live order queue → Mark Ready → Mark Delivered |

## Architecture at a Glance
- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: Oracle Free (FREEPDB1) via Docker · node-oracledb driver
- **Real-time**: Server polling every 3 s (no WebSocket needed for prototype)
- **Auth**: None — role chosen on landing page, no session

## Agent Operating Rules
1. **Read first**: Always read `docs/ARCHITECTURE.md` and `docs/MODULES.md` before writing any feature code.
2. **UI bar**: Every screen must feel premium — dark glassmorphism palette, smooth transitions, mobile-first.
3. **No placeholders**: All components must render real data from DB or realistic mock state.
4. **Status flow is strict**: `ORDERED` → `READY` → `DELIVERED`. Never skip or reverse.
5. **Order IDs**: Format `ZQ-XXXX` (zero-padded 4-digit sequence). Generated server-side.
6. **No external payment**: Clicking "Pay Now" immediately calls the order creation API.
7. **Polling**: Student tracking page and Admin queue page both poll `/api/orders` every `NEXT_PUBLIC_POLL_INTERVAL_MS` ms.
8. **DB calls**: All Oracle queries live in `src/lib/db/` — never inline SQL in route handlers or components.
9. **Keep root clean**: No feature files in the root. Follow the prescribed directory layout.
10. **Short docs**: Keep every file in `docs/` under 100 lines.

## Agent Trigger Contract
> *"Read AGENTS.md, docs/ARCHITECTURE.md, and execute Phase [X] from docs/MODULES.md completely."*
