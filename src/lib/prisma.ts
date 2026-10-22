import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * Prevents multiple Prisma Client instances from being created during
 * Next.js hot-reloading in development (which would exhaust the connection pool).
 *
 * Usage: import { prisma } from "@/lib/prisma"
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
