import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MyOrder } from "@/lib/types";

export async function GET() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return NextResponse.json({ success: false, error: "Unable to verify your session." }, { status: 500 });
  }

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }
  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ success: false, error: "Only students can view these orders." }, { status: 403 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const records = await prisma.order.findMany({
      where: {
        studentId: session.user.id,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["ORDERED", "READY", "DELIVERED"] },
      },
      select: {
        id: true,
        billId: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        outlet: { select: { name: true, slug: true } },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            menuItem: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const orders: MyOrder[] = [];
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
    return NextResponse.json({ success: false, error: "Unable to load your orders right now." }, { status: 500 });
  }
}
