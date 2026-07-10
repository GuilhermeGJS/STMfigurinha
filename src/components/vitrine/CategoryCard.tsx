import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

const categoryIcons: Record<string, string> = {
  anime: "🐉", futebol: "⚽", memes: "😂", musica: "🎵", games: "🎮", "series-filmes": "🎬",
};

export function CategoryCard({ category }: { category: Category }) {
  const icon = categoryIcons[category.slug] || "🎴";

  return (
    <Link href={`/categorias/${category.slug}`} className="group">
      <div className="card-hover bg-white rounded-2xl overflow-hidden border shadow-sm text-center p-6 hover:shadow-xl hover:border-violet-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:shadow-md">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-full h-full rounded-2xl object-cover" />
          ) : icon}
        </div>
        <h3 className="font-semibold text-sm group-hover:text-violet-600 transition-colors">{category.name}</h3>
      </div>
    </Link>
  );
}
