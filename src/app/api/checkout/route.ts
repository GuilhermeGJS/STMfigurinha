import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateDiscounts } from "@/lib/promocao-engine";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Faça login para comprar." }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { items, couponId, promotionRuleId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, i: any) => sum + i.unitPrice * i.quantity,
      0
    );

    const cartForEngine = items.map((i: any) => ({
      id: "temp",
      productId: i.productId,
      name: "",
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.unitPrice * i.quantity,
    }));

    const discountResult = await calculateDiscounts(cartForEngine);
    const totalDiscount = discountResult.discountTotal + discountResult.couponDiscount;
    const total = Math.max(0, subtotal - totalDiscount);

    const order = await prisma.order.create({
      data: {
        userId,
        status: "aguardando_pagamento",
        subtotal,
        discountTotal: totalDiscount,
        shipping: 0,
        total,
        couponId: discountResult.couponId || couponId || null,
        promotionRuleId: discountResult.appliedRules[0]?.id || promotionRuleId || null,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId || null,
            variantId: i.variantId || null,
            uploadId: i.uploadId || null,
            itemType: i.itemType || "produto_pronto",
            quantity: i.quantity || 1,
            unitPrice: i.unitPrice || 0,
            subtotal: (i.unitPrice || 0) * (i.quantity || 1),
          })),
        },
        timeline: {
          create: {
            newStatus: "aguardando_pagamento",
            message: "Pedido criado.",
            createdBy: "sistema",
          },
        },
      },
      include: { items: true },
    });

    if (discountResult.couponId) {
      try {
        await prisma.coupon.update({
          where: { id: discountResult.couponId },
          data: { currentUses: { increment: 1 } },
        });
      } catch { /* coupon update falhou, não quebra o fluxo */ }
    }

    return NextResponse.json({
      id: order.id,
      total: order.total,
      items: order.items.map((i) => ({
        itemType: i.itemType,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
    }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout error:", error?.message || error);
    return NextResponse.json(
      { error: "Erro ao processar pedido. Tente novamente." },
      { status: 500 }
    );
  }
}
