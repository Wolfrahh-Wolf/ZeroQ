import { NextResponse } from "next/server";
import { getMenuByOutlet } from "@/lib/db/outlets";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const outletId = parseInt(id, 10);
  if (isNaN(outletId)) {
    return NextResponse.json({ error: "Invalid outlet ID" }, { status: 400 });
  }
  try {
    const items = await getMenuByOutlet(outletId);
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/outlets/[id]/menu]", err);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
