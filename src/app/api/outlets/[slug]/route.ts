import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await context.params;
  const parsedSlug = slugSchema.safeParse(rawSlug);
  if (!parsedSlug.success) {
    return NextResponse.json({ success: false, error: "Outlet not found." }, { status: 404 });
  }

  try {
    const outlet = await prisma.outlet.findFirst({
      where: { slug: parsedSlug.data, isActive: true },
      select: {
        id: true, name: true, slug: true, description: true, imageUrl: true,
        menuItems: {
          where: { isAvailable: true },
          select: { id: true, name: true, description: true, price: true, imageAsset: true, category: true, isAvailable: true, outletId: true },
          orderBy: [{ category: "asc" }, { name: "asc" }],
        },
      },
    });
    if (!outlet) return NextResponse.json({ success: false, error: "Outlet not found." }, { status: 404 });
    return NextResponse.json({ success: true, data: outlet });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load this outlet's menu." }, { status: 500 });
  }
}
