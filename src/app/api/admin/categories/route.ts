import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  const cats = await prisma.category.findMany({
    include: { products: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      active: c.active,
      productCount: c.products.length,
    }))
  );
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await req.json();
    const { name } = data;
    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const cat = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json(cat, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "Categoria já existe" }, { status: 400 });
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}
