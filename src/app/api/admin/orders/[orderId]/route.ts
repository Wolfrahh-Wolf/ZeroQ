import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AdminOrder } from "@/lib/types";

const updateStatusSchema = z.object({
  status: z.enum(["READY", "DELIVERED"]),
}).strict();

interface RouteContext {
  params: Promise<{ orderId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "A valid next order status is required." }, { status: 400 });
  }

  const { orderId } = await context.params;
  const nextStatus = parsed.data.status;
  const expectedStatus = nextStatus === "READY" ? "ORDERED" : "READY";

  try {
    const current = await prisma.order.findFirst({
      where: { id: orderId, outletId: session.user.outletId },
      select: { id: true, status: true },
    });
    if (!current) {
      return NextResponse.json({ success: false, error: "Order not found for this outlet." }, { status: 404 });
    }
    if (current.status !== expectedStatus) {
      return NextResponse.json({ success: false, error: "This order has already changed. Refresh the queue and try again." }, { status: 409 });
    }

    const update = await prisma.order.updateMany({
      where: { id: orderId, outletId: session.user.outletId, status: expectedStatus },
      data: { status: nextStatus },
    });
    if (update.count !== 1) {
      return NextResponse.json({ success: false, error: "This order has already changed. Refresh the queue and try again." }, { status: 409 });
    }

    const record = await prisma.order.findFirst({
      where: { id: orderId, outletId: session.user.outletId },
      select: {
        id: true,
        billId: true,
        totalAmount: true,
        createdAt: true,
        outlet: { select: { name: true } },
        student: { select: { name: true, firstName: true, lastName: true } },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            menuItem: { select: { name: true } },
          },
        },
      },
    });
    if (!record?.billId) {
      return NextResponse.json({ success: false, error: "Unable to load the updated order." }, { status: 500 });
    }

    const order: AdminOrder = {
      ...record,
      billId: record.billId,
      status: nextStatus,
      createdAt: record.createdAt.toISOString(),
    };
    return NextResponse.json({ success: true, data: { order } });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to update this order right now." }, { status: 500 });
  }
}
