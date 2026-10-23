import { createHmac, timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBillId } from "@/lib/utils";

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
  orderId: z.string().min(1).max(100),
}).strict();

function isRetryableTransactionError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && (error.code === "P2034" || error.code === "P2002");
}

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
    return NextResponse.json({ success: false, error: "Only students can verify payments." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = verifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 400 });
  }
  const { razorpay_payment_id: paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: signature, orderId } = parsed.data;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ success: false, error: "Payment verification is not configured." }, { status: 503 });
  }

  const expectedSignature = createHmac("sha256", keySecret).update(`${razorpayOrderId}|${paymentId}`).digest();
  const receivedSignature = Buffer.from(signature, "hex");
  if (expectedSignature.length !== receivedSignature.length || !timingSafeEqual(expectedSignature, receivedSignature)) {
    return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, studentId: true, outletId: true, status: true, paymentId: true, billId: true, razorpayOrderId: true, outlet: { select: { slug: true } } },
    });
    if (!order || order.studentId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 400 });
    }
    if (order.status === "ORDERED" && order.paymentId === paymentId && order.billId) {
      return NextResponse.json({ success: true, data: { billId: order.billId, orderId: order.id } });
    }
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ success: false, error: "This order cannot be confirmed." }, { status: 409 });
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const confirmed = await prisma.$transaction(async (tx) => {
          const current = await tx.order.findUnique({
            where: { id: order.id },
            select: { id: true, status: true, paymentId: true, billId: true, razorpayOrderId: true },
          });
          if (!current || current.razorpayOrderId !== razorpayOrderId) return null;
          if (current.status === "ORDERED" && current.paymentId === paymentId && current.billId) {
            return { billId: current.billId, orderId: current.id };
          }
          if (current.status !== "PENDING_PAYMENT") return null;

          const billId = await generateBillId(order.outlet.slug, tx);
          await tx.order.update({ where: { id: current.id }, data: { status: "ORDERED", paymentId, billId } });
          return { billId, orderId: current.id };
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        if (!confirmed) {
          return NextResponse.json({ success: false, error: "This order can no longer be confirmed." }, { status: 409 });
        }
        return NextResponse.json({ success: true, data: confirmed });
      } catch (error) {
        if (attempt < 2 && isRetryableTransactionError(error)) continue;
        throw error;
      }
    }
    return NextResponse.json({ success: false, error: "Unable to confirm payment. Please contact support." }, { status: 500 });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to confirm payment. Please contact support." }, { status: 500 });
  }
}
