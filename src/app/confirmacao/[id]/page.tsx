import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Package, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatCurrency, orderStatusLabel, orderStatusColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const WHATSAPP = "5519987203886";

export default async function ConfirmacaoPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  const protocolo = order.id.slice(-8).toUpperCase();
  const itensTexto = order.items
    .map((item) => {
      const nome = item.itemType === "personalizado" ? "Figurinha Personalizada" : "Produto";
      return `- ${nome} x${item.quantity} ${formatCurrency(item.subtotal)}`;
    })
    .join("\n");

  const msg = encodeURIComponent(
    `*NOVO PEDIDO - STICKERSHOP*\n\n` +
      `*Protocolo:* ${protocolo}\n` +
      `*Total:* ${formatCurrency(order.total)}\n\n` +
      `*ITENS:*\n${itensTexto}\n\n` +
      `*ADMIN:*\n` +
      `stickershop.onrender.com/admin\n` +
      `admin@stickershop.com.br / admin123`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${msg}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Pedido Realizado!</h1>
      <p className="text-muted-foreground mb-4">
        Seu pedido foi registrado. Agora é só conversar com o vendedor pelo WhatsApp.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-green-700 transition-colors mb-8"
      >
        <Send className="h-5 w-5" /> Chamar no WhatsApp
      </a>

      <Card className="text-left mb-8">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Pedido #{protocolo}</h2>
            <Badge className={orderStatusColor(order.status)}>
              {orderStatusLabel(order.status)}
            </Badge>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium text-sm mb-2">Itens</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.itemType === "personalizado" ? "🎨 Figurinha Personalizada" : "📦 Produto"}
                    <span className="text-muted-foreground"> x{item.quantity}</span>
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descontos</span>
                <span>-{formatCurrency(order.discountTotal)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">Status</h3>
            <div className="space-y-2">
              {order.timeline.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{t.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" asChild>
          <Link href="/meus-pedidos">
            <Package className="mr-2 h-4 w-4" /> Meus Pedidos
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  );
}
