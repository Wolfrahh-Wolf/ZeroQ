import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/db/orders";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const order = await getOrderById(id.toUpperCase());
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error("[GET /api/orders/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status } = body;

    if (status !== "READY" && status !== "DELIVERED") {
      return NextResponse.json(
        { error: "Invalid status. Must be READY or DELIVERED." },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id.toUpperCase(), status);
    if (!updated) {
      return NextResponse.json(
        { error: "Order not found or status transition not allowed" },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, orderId: id.toUpperCase(), status });
  } catch (err) {
    console.error("[PATCH /api/orders/[id]]", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
