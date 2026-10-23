import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const outlets = await prisma.outlet.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, description: true, imageUrl: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: outlets });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load campus outlets." }, { status: 500 });
  }
}
