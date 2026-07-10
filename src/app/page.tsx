import Link from "next/link";
import { Star, Sparkles, ArrowRight, Shield, Zap, Palette, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/vitrine/ProductCard";
import { CategoryCard } from "@/components/vitrine/CategoryCard";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true, variants: true },
    take: 8,
  });

  const newProducts = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 text-sm px-4 py-1.5 rounded-full border-0">
                ✨ Nova coleção disponível
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Transforme ideias em{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  figurinhas únicas
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Crie figurinhas personalizadas com suas fotos ou escolha entre centenas de designs exclusivos.
                Acabamentos premium, produção em 48h e qualidade garantida.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/personalizar">
                  <Button size="lg" className="gradient-btn rounded-xl text-base px-8 h-12">
                    <Sparkles className="mr-2 h-5 w-5" />Criar Figurinha Personalizada
                  </Button>
                </Link>
                <Link href="/categorias/anime">
                  <Button size="lg" variant="outline" className="rounded-xl text-base px-8 h-12 border-2">
                    Ver Coleções <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex gap-8 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-violet-500" /> Produção em 48h</span>
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-violet-500" /> Qualidade Garantida</span>
                <span className="flex items-center gap-1.5"><Palette className="h-4 w-4 text-violet-500" /> Acabamento Premium</span>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-[2rem] blur-3xl" />
                <div className="relative grid grid-cols-2 gap-5 rotate-3">
                  {[
                    { emoji: "🦊", bg: "from-amber-100 to-orange-200" },
                    { emoji: "⭐", bg: "from-yellow-100 to-amber-200" },
                    { emoji: "🎮", bg: "from-violet-100 to-purple-200" },
                    { emoji: "🎸", bg: "from-rose-100 to-pink-200" },
                  ].map((item, i) => (
                    <div key={i}
                      className="w-44 h-44 bg-gradient-to-br rounded-2xl shadow-xl flex items-center justify-center text-6xl border-4 border-white hover:scale-105 transition-transform cursor-default"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${item.bg} rounded-xl flex items-center justify-center`}>
                        {item.emoji}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-violet-100 text-violet-700 mb-4 px-3 py-1 rounded-full border-0">Categorias</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Explore por tema</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Encontre a categoria perfeita para sua coleção
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge className="bg-amber-100 text-amber-700 mb-3 px-3 py-1 rounded-full border-0">Destaques</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">As mais queridas</h2>
                <p className="text-muted-foreground mt-2">Selecionadas pela qualidade e popularidade</p>
              </div>
              <Link href="/buscar?q=">
                <Button variant="ghost" className="group">
                  Ver Todas <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 rounded-3xl p-10 md:p-16 overflow-hidden shadow-glow">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Pronto para criar suas próprias figurinhas?</h2>
                <p className="text-white/80 text-lg max-w-lg">
                  Faça upload da sua imagem, escolha tamanho e acabamento. É rápido, fácil e o resultado é incrível.
                </p>
              </div>
              <Link href="/personalizar">
                <Button size="lg" variant="secondary" className="rounded-xl text-base px-10 h-14 font-bold shadow-xl shrink-0 bg-white text-violet-700 hover:bg-violet-50">
                  <Sparkles className="mr-2 h-5 w-5" />Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Badge className="bg-green-100 text-green-700 mb-3 px-3 py-1 rounded-full border-0">Novidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Acabaram de chegar</h2>
            <p className="text-muted-foreground mt-2">As figurinhas mais recentes do nosso catálogo</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
