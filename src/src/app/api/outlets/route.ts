import { NextResponse } from "next/server";
import { getOutlets } from "@/lib/db/outlets";

export async function GET() {
  try {
    const outlets = await getOutlets();
    return NextResponse.json(outlets);
  } catch (err) {
    console.error("[GET /api/outlets]", err);
    return NextResponse.json({ error: "Failed to fetch outlets" }, { status: 500 });
  }
}
