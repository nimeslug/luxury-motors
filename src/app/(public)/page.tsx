import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/home/hero";
import { CarCard } from "@/components/cars/car-card";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { BrandsStrip } from "@/components/home/brands-strip";
import { CallToAction } from "@/components/home/cta";

export default async function Home() {
  const supabase = await createClient();

  const { data: cars, error } = await supabase
    .from("cars")
    .select(`
      id,
      model,
      year,
      price,
      currency,
      status,
      brands ( name ),
      car_images ( url, is_primary )
    `)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Hero />

      <section className="px-6 py-24 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Öne Çıkan Araçlar
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">
            Koleksiyondan Seçmeler
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-border" />
        </header>

        {error && (
          <div className="text-xs text-accent text-center">
            ❌ {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <CategoriesGrid />
      <BrandsStrip /> 
      <CallToAction />
    </>
  );
}