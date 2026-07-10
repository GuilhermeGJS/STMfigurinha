import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type ProductWithRelations = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  imageUrl: string | null;
  type: string;
  featured: boolean;
  category: { id: string; name: string; slug: string } | null;
  variants: { size: string; finish: string; priceExtra: number; stock: number }[];
};

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const minPrice = product.basePrice + Math.min(...product.variants.map((v) => v.priceExtra));
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🎴</div>
          )}
          {product.type === "personalizada" && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] border-0">Personalizável</Badge>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 rounded-full p-1.5 shadow-md">
              <Star className="h-3 w-3 fill-current" />
            </div>
          )}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm bg-white/90">Indisponível</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs font-medium text-violet-600 mb-1.5 uppercase tracking-wide">
            {product.category?.name || "Sem categoria"}
          </p>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-3 group-hover:text-violet-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-violet-700">{formatCurrency(minPrice)}</p>
              <p className="text-[11px] text-muted-foreground">{product.variants.length} variações</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
              <span className="text-violet-600 text-sm font-bold">+</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
