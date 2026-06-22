import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export async function CategoriesGrid() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url")
    .order("name");

  if (!categories || categories.length === 0) return null;

  return (
    <section className="px-6 py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Tarz Seç
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">
            Kategorilere Göre Keşfet
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-border" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden block"
            >
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-serif text-2xl md:text-3xl mb-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs opacity-80 mb-4 max-w-xs">
                    {category.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                  Keşfet
                  <ChevronRight
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}