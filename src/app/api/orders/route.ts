import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpayClient } from "@/lib/razorpay";

const createOrderSchema = z.object({
  outletId: z.string().min(1).max(100),
  items: z.array(z.object({
    menuItemId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(50),
  }).strict()).min(1).max(50),
}).strict().superRefine(({ items }, context) => {
  const ids = items.map((item) => item.menuItemId);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Each menu item may only appear once.", path: ["items"] });
  }
});

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ success: false, error: "Only students can place orders." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Please check the outlet and item quantities." }, { status: 400 });
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ success: false, error: "Online payment is not configured." }, { status: 503 });
  }

  try {
    const { outletId, items } = parsed.data;
    const outlet = await prisma.outlet.findFirst({
      where: { id: outletId, isActive: true },
      select: { id: true },
    });
    if (!outlet) return NextResponse.json({ success: false, error: "This outlet is not available." }, { status: 404 });

    const itemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds }, outletId, isAvailable: true },
      select: { id: true, price: true },
    });
    if (menuItems.length !== items.length) {
      return NextResponse.json({ success: false, error: "One or more selected items are unavailable." }, { status: 400 });
    }

    const priceById = new Map(menuItems.map((item) => [item.id, item.price]));
    const amountInPaise = items.reduce((sum, item) => sum + Math.round((priceById.get(item.menuItemId) ?? 0) * 100) * item.quantity, 0);
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ success: false, error: "The order total is invalid." }, { status: 400 });
    }

    const razorpayOrder = await getRazorpayClient().orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `zq-${randomUUID()}`,
      notes: { outletId },
    });

    const order = await prisma.$transaction((tx) => tx.order.create({
      data: {
        studentId: session.user.id,
        outletId,
        totalAmount: amountInPaise / 100,
        status: "PENDING_PAYMENT",
        billId: null,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: priceById.get(item.menuItemId) ?? 0,
          })),
        },
      },
      select: { id: true },
    }));

    return NextResponse.json({
      success: true,
      data: { razorpayOrderId: razorpayOrder.id, amount: amountInPaise, currency: "INR", orderId: order.id },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to start checkout. Please try again." }, { status: 502 });
  }
}
