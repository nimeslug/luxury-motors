import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarCard } from "@/components/cars/car-card";
import Link from "next/link";

export const metadata = {
  title: "Favorilerim",
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cars tablosundan favorilere inner join
  const { data: cars } = await supabase
    .from("cars")
    .select(`
      id,
      slug,
      model,
      year,
      price,
      currency,
      status,
      brands ( name ),
      car_images ( url, is_primary ),
      favorites!inner ( user_id )
    `)
    .eq("favorites.user_id", user.id)
    .order("created_at", { ascending: false });

  const carList = cars ?? [];

  return (
    <>
      <header className="bg-foreground text-background pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Koleksiyonum
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Favorilerim</h1>
          <p className="text-sm opacity-70">
            {carList.length} araç kaydettiniz
          </p>
        </div>
      </header>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        {carList.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl mb-4">Henüz favoriniz yok</p>
            <p className="text-sm text-muted mb-8">
              Koleksiyonu keşfedin ve beğendiğiniz araçları kaydedin.
            </p>
            <Link
              href="/cars"
              className="inline-block px-8 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase"
            >
              Araçları Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carList.map((car) => (
              <CarCard key={car.id} car={car} isFavorited={true} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}