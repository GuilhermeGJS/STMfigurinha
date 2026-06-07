import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Faça login" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { items } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    // Calcula valores
    let subtotal = 0;
    const orderItems = items.map((i: any) => {
      const qty = Number(i.quantity) || 1;
      const price = Number(i.unitPrice) || 0;
      const sub = qty * price;
      subtotal += sub;
      return {
        productId: i.productId || null,
        variantId: i.variantId || null,
        uploadId: i.uploadId || null,
        itemType: i.itemType || "produto_pronto",
        quantity: qty,
        unitPrice: price,
        subtotal: sub,
      };
    });

    const total = Math.round(subtotal * 100) / 100;

    const order = await prisma.order.create({
      data: {
        userId,
        status: "aguardando_pagamento",
        subtotal,
        discountTotal: 0,
        shipping: 0,
        total,
        items: { create: orderItems },
        timeline: {
          create: {
            newStatus: "aguardando_pagamento",
            message: "Pedido criado. Aguardando contato via WhatsApp.",
            createdBy: "sistema",
          },
        },
      },
    });

    return NextResponse.json({ id: order.id, total: order.total }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout:", error?.message || error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
