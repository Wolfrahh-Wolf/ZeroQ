import { NextResponse } from "next/server";
import { getAllOrders, createOrder } from "@/lib/db/orders";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { outletId, studentName, totalAmount, items } = body;

    if (!outletId || !studentName || !totalAmount || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = await createOrder({
      outletId: Number(outletId),
      studentName: String(studentName).trim(),
      totalAmount: Number(totalAmount),
      items,
    });

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
