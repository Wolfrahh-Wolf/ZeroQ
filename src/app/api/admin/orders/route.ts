import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AdminOrder } from "@/lib/types";

const orderStatusSchema = z.enum(["ORDERED", "READY", "DELIVERED"]);
const statusFilterSchema = z.array(orderStatusSchema).min(1).max(3).refine(
  (statuses) => new Set(statuses).size === statuses.length,
  "Duplicate statuses are not allowed.",
);

export async function GET(request: NextRequest) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return NextResponse.json({ success: false, error: "Unable to verify your session." }, { status: 500 });
  }
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Admin access required." }, { status: 403 });
  }
  if (!session.user.outletId) {
    return NextResponse.json({ success: false, error: "No outlet is assigned to this admin account." }, { status: 403 });
  }

  const statusParam = request.nextUrl.searchParams.get("status") ?? "ORDERED,READY";
  const parsedStatuses = statusFilterSchema.safeParse(statusParam.split(","));
  if (!parsedStatuses.success) {
    return NextResponse.json({ success: false, error: "Invalid order status filter." }, { status: 400 });
  }

  const statuses = parsedStatuses.data;
  const historyOnly = statuses.every((status) => status === "DELIVERED");
  try {
    const records = await prisma.order.findMany({
      where: {
        outletId: session.user.outletId,
        status: { in: statuses },
      },
      select: {
        id: true,
        billId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        outlet: { select: { name: true } },
        student: { select: { name: true } },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            menuItem: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: historyOnly ? "desc" : "asc" },
    });

    const orders: AdminOrder[] = [];
    for (const order of records) {
      if (!order.billId) continue;
      switch (order.status) {
        case "ORDERED":
          orders.push({ ...order, billId: order.billId, status: "ORDERED", createdAt: order.createdAt.toISOString() });
          break;
        case "READY":
          orders.push({ ...order, billId: order.billId, status: "READY", createdAt: order.createdAt.toISOString() });
          break;
        case "DELIVERED":
          orders.push({ ...order, billId: order.billId, status: "DELIVERED", createdAt: order.createdAt.toISOString() });
          break;
        case "PENDING_PAYMENT":
          break;
      }
    }

    return NextResponse.json({ success: true, data: { orders } });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load outlet orders right now." }, { status: 500 });
  }
}
