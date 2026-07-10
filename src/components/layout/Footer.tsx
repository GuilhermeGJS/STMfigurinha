import Link from "next/link";
import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl mb-4 text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              Sticker<span className="text-violet-400">Shop</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Figurinhas personalizadas e colecionáveis de alta qualidade. Expresse sua criatividade com acabamentos premium.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Categorias</h4>
            <ul className="space-y-2.5 text-sm">
              {["Anime", "Futebol", "Memes", "Música", "Games", "Séries e Filmes"].map((cat) => (
                <li key={cat}><Link href={`/categorias/${cat.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Ajuda</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Criar Personalizada", href: "/personalizar" },
                { label: "Como Funciona", href: "#" },
                { label: "Tamanhos e Acabamentos", href: "#" },
                { label: "Contato", href: "#" },
              ].map((item) => (
                <li key={item.label}><Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Contato</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>contato@stickershop.com.br</li>
              <li>(19) 98720-3886</li>
              <li>Seg a Sex: 9h às 18h</li>
              <li>WhatsApp disponível 24h</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} StickerShop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
