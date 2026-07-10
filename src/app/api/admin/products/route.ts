import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, basePrice: p.basePrice, type: p.type,
    active: p.active, featured: p.featured, categoryName: p.category.name, variantCount: p.variants.length,
  })));
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const data = await req.json();
    const { name, categoryId, basePrice, type, featured, description } = data;
    if (!name || !categoryId || basePrice === undefined) return NextResponse.json({ error: "Nome, categoria e preço obrigatórios." }, { status: 400 });
    const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const product = await prisma.product.create({
      data: {
        name, slug, description: description || "", basePrice: parseFloat(basePrice), categoryId,
        type: type || "pronta", featured: featured || false,
        variants: {
          create: [
            { size: "5x5", finish: "brilhante", priceExtra: 0, stock: 50 },
            { size: "5x5", finish: "fosco", priceExtra: 1, stock: 50 },
            { size: "5x5", finish: "holografico", priceExtra: 3, stock: 50 },
            { size: "7x7", finish: "brilhante", priceExtra: 1, stock: 50 },
            { size: "7x7", finish: "fosco", priceExtra: 2, stock: 50 },
            { size: "7x7", finish: "holografico", priceExtra: 4, stock: 50 },
            { size: "10x10", finish: "brilhante", priceExtra: 3, stock: 50 },
            { size: "10x10", finish: "fosco", priceExtra: 4, stock: 50 },
            { size: "10x10", finish: "holografico", priceExtra: 6, stock: 50 },
          ],
        },
      },
    });
    return NextResponse.json({ id: product.id, slug: product.slug }, { status: 201 });
  } catch (error: any) { console.error(error); return NextResponse.json({ error: "Erro ao criar." }, { status: 500 }); }
}
