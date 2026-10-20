# ZeroQ

> **Skip the queue. Order on the way.**

ZeroQ lets campus students pre-order canteen food from their phones while walking to the venue. By the time they arrive, the order is ready — zero waiting time.

## Outlets
- **MC** — Main Canteen
- **Rishab Food Court**

## Prerequisites
| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| Docker + Docker Compose | ≥ 24 |
| Oracle Instant Client | (bundled by node-oracledb v6+) |

## Quick Start

### 1 — Start the Database
```bash
docker compose up -d
# Wait ~90 s for Oracle to initialise on first run
docker compose logs -f oracle-db
```

### 2 — Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local if you changed DB credentials
```

### 3 — Install Dependencies & Run Dev Server
```bash
cd src
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — choose **Student** or **Admin** to begin.

## Stopping the Database
```bash
docker compose down        # keep data
docker compose down -v     # also wipe DB volume (fresh start)
```

## Project Layout
```
docker-compose.yml   # Oracle DB container
db/                  # Schema DDL & init script
docs/                # Architecture, tech stack & module specs
src/                 # Next.js application
```
