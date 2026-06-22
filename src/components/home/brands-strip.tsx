import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function BrandsStrip() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name");

  if (!brands || brands.length === 0) return null;

  const doubledBrands = [...brands, ...brands];

  return (
    <section className="py-24 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Temsil Ettiğimiz Markalar
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Dünyanın En Prestijli İsimleri
          </h2>
        </header>
      </div>

      <div className="relative">
        <div className="flex gap-16 animate-scroll items-center">
          {doubledBrands.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/brands/${brand.slug}`}
              className="flex-shrink-0 group whitespace-nowrap"
            >
              <span className="font-serif text-3xl md:text-4xl tracking-[0.15em] uppercase text-muted group-hover:text-foreground transition-colors duration-500">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}