import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    const data = await req.json();
    await prisma.promotionRule.update({ where: { id }, data: { ...(data.active !== undefined && { active: data.active }) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Erro" }, { status: 500 }); }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  try {
    await prisma.promotionRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Erro" }, { status: 500 }); }
}
