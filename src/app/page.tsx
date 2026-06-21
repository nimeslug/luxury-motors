import { createClient } from "@/lib/supabase/server";

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
    <main className="min-h-screen px-6 py-16 max-w-7xl mx-auto">
      <header className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] text-accent mb-4 uppercase">
          Öne Çıkan Araçlar
        </p>
        <h1 className="font-serif text-5xl md:text-6xl">Luxury Motors</h1>
      </header>

      {error && (
        <div className="text-xs text-accent text-center">❌ {error.message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars?.map((car) => {
          const primaryImage = car.car_images.find((img) => img.is_primary)?.url
            ?? car.car_images[0]?.url;
          const brandName = Array.isArray(car.brands) ? car.brands[0]?.name : car.brands?.name;
          
          return (
            <article key={car.id} className="group">
              <div className="aspect-[16/9] bg-surface mb-4 overflow-hidden">
                {primaryImage && (
                  <img
                    src={primaryImage}
                    alt={car.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <p className="text-xs tracking-widest text-muted uppercase mb-1">
                {brandName} · {car.year}
              </p>
              <h2 className="font-serif text-2xl mb-2">{car.model}</h2>
              <p className="text-lg">
                {new Intl.NumberFormat("tr-TR").format(car.price)} {car.currency}
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}