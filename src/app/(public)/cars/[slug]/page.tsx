import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarGallery } from "@/components/cars/car-gallery";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("model, brands ( name )")
    .eq("slug", slug)
    .single();

  if (!car) return { title: "Araç Bulunamadı" };

  const brandName = Array.isArray(car.brands)
    ? car.brands[0]?.name
    : car.brands?.name;
  return {
    title: `${brandName} ${car.model}`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: car, error } = await supabase
    .from("cars")
    .select(`
      *,
      brands ( name, slug ),
      categories ( name, slug ),
      car_images ( url, alt_text, display_order, is_primary )
    `)
    .eq("slug", slug)
    .single();

  if (error || !car) notFound();

  // Görselleri sırala: primary önce, sonra display_order
  const images = [...(car.car_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const brandName = Array.isArray(car.brands)
    ? car.brands[0]?.name
    : car.brands?.name;
  const categoryName = Array.isArray(car.categories)
    ? car.categories[0]?.name
    : car.categories?.name;

  return (
    <>
      {/* Üst navigasyon */}
      <div className="pt-32 pb-8 px-6 max-w-7xl mx-auto">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Tüm Araçlar
        </Link>
      </div>

      {/* Galeri */}
      <section className="px-6 max-w-7xl mx-auto">
        <CarGallery images={images} modelName={car.model} />
      </section>

      {/* Başlık */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
              {brandName} · {car.year}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl">{car.model}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-[0.2em] uppercase text-muted mb-2">
              Fiyat
            </p>
            <p className="font-serif text-3xl md:text-4xl">
              {new Intl.NumberFormat("tr-TR").format(car.price)} {car.currency}
            </p>
          </div>
        </div>
      </section>

      {/* Detay */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol: açıklama */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl mb-6">Açıklama</h2>
            {car.description ? (
              <p className="text-base leading-relaxed text-muted">
                {car.description}
              </p>
            ) : (
              <p className="text-sm text-muted italic">
                Bu araç için henüz açıklama eklenmemiş.
              </p>
            )}
          </div>

          {/* Sağ: butonlar + hızlı bilgi */}
          <aside className="lg:border-l border-border lg:pl-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase">
                  İletişime Geç
                </button>
                <button className="w-full px-6 py-3 border border-border hover:bg-surface transition-colors text-xs tracking-[0.3em] uppercase">
                  Test Sürüşü Talep Et
                </button>
              </div>

              <div className="pt-6 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Kategori</span>
                  <span>{categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Yıl</span>
                  <span>{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Kilometre</span>
                  <span>
                    {new Intl.NumberFormat("tr-TR").format(car.mileage_km)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Yakıt</span>
                  <span className="capitalize">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Vites</span>
                  <span className="capitalize">
                    {car.transmission?.replace("_", " ")}
                  </span>
                </div>
                {car.horsepower && (
                  <div className="flex justify-between">
                    <span className="text-muted">Motor</span>
                    <span>{car.horsepower} HP</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}