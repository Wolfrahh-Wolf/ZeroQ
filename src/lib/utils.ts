import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type PrismaClient } from "@prisma/client";

/**
 * cn — Merge Tailwind classes safely, resolving conflicts.
 * Usage: className={cn("base-class", conditional && "conditional-class")}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatPrice — Format a numeric price to Indian Rupee string.
 * Usage: formatPrice(89.99) → "₹90"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Outlet prefix map for Bill ID generation.
 * Each campus outlet has a 2-letter code used in the human-readable Bill ID.
 */
const OUTLET_PREFIXES: Record<string, string> = {
  "main-canteen": "MC",
  "rishabs-food-court": "RF",
  "snow-cubes": "SC",
  "metro-cafe": "MT",
  "pr-cafe": "PR",
  "aswins-food-court": "AF",
};

/**
 * generateBillId — Atomically generate the next sequential Bill ID for an outlet.
 *
 * Format: #[PREFIX]-[3-digit-number]  e.g. #MC-104
 *
 * Must be called within a Prisma transaction to prevent race conditions.
 *
 * @param outletSlug - The outlet slug (e.g. "main-canteen")
 * @param tx - Active Prisma transaction client
 */
export async function generateBillId(
  outletSlug: string,
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
): Promise<string> {
  const prefix = OUTLET_PREFIXES[outletSlug] ?? "ZQ";

  const lastOrder = await tx.order.findFirst({
    where: { outlet: { slug: outletSlug } },
    orderBy: { createdAt: "desc" },
    select: { billId: true },
  });

  let lastNumber = 0;
  if (lastOrder?.billId) {
    // Parse number from e.g. "#MC-104" → 104
    const parts = lastOrder.billId.split("-");
    const parsed = parseInt(parts[parts.length - 1] ?? "0", 10);
    lastNumber = isNaN(parsed) ? 0 : parsed;
  }

  const nextNumber = String(lastNumber + 1).padStart(3, "0");
  return `#${prefix}-${nextNumber}`;
}

/**
 * sleep — Utility for intentional delays (e.g. in development/testing).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
