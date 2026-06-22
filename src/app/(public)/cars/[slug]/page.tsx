import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarGallery } from "@/components/cars/car-gallery";
import { CarCard } from "@/components/cars/car-card";
import { CarContactButtons } from "@/components/cars/car-contact-buttons";

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

  // Kullanıcı bilgisi (contact form pre-fill için)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultName = "";
  let defaultEmail = "";
  if (user) {
    defaultEmail = user.email ?? "";
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    defaultName =
      profile?.full_name ?? user.user_metadata?.full_name ?? "";
  }

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

  // İlgili araçlar — aynı marka veya kategoriden, mevcut araç hariç
  const { data: relatedCars } = await supabase
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
      car_images ( url, is_primary )
    `)
    .or(`brand_id.eq.${car.brand_id},category_id.eq.${car.category_id}`)
    .neq("id", car.id)
    .limit(3);

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
              <CarContactButtons
                carId={car.id}
                carModel={car.model}
                defaultName={defaultName}
                defaultEmail={defaultEmail}
              />

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

      {/* Tam teknik özellikler */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="border-t border-border pt-16">
          <h2 className="font-serif text-3xl mb-12">Teknik Özellikler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Performans */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">
                Performans
              </p>
              <dl className="space-y-3 text-sm">
                {car.engine_displacement && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Motor Hacmi</dt>
                    <dd className="text-right">{car.engine_displacement} L</dd>
                  </div>
                )}
                {car.horsepower && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Güç</dt>
                    <dd className="text-right">{car.horsepower} HP</dd>
                  </div>
                )}
                {car.torque_nm && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Tork</dt>
                    <dd className="text-right">{car.torque_nm} Nm</dd>
                  </div>
                )}
                {car.top_speed_kmh && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Maks. Hız</dt>
                    <dd className="text-right">{car.top_speed_kmh} km/s</dd>
                  </div>
                )}
                {car.acceleration_0_100 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">0-100 km/s</dt>
                    <dd className="text-right">{car.acceleration_0_100} sn</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Genel */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">
                Genel
              </p>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Yıl</dt>
                  <dd className="text-right">{car.year}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Kilometre</dt>
                  <dd className="text-right">
                    {new Intl.NumberFormat("tr-TR").format(car.mileage_km)} km
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Yakıt</dt>
                  <dd className="text-right capitalize">{car.fuel_type}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Vites</dt>
                  <dd className="text-right capitalize">
                    {car.transmission?.replace("_", " ")}
                  </dd>
                </div>
                {car.condition && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Durum</dt>
                    <dd className="text-right">
                      {car.condition === "yeni" ? "Yeni" : "İkinci El"}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Görünüm */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">
                Görünüm
              </p>
              <dl className="space-y-3 text-sm">
                {car.exterior_color && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Dış Renk</dt>
                    <dd className="text-right">{car.exterior_color}</dd>
                  </div>
                )}
                {car.interior_color && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">İç Renk</dt>
                    <dd className="text-right">{car.interior_color}</dd>
                  </div>
                )}
                {!car.exterior_color && !car.interior_color && (
                  <p className="text-xs text-muted italic">
                    Bilgi mevcut değil
                  </p>
                )}
              </dl>
            </div>

            {/* Belge */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">
                Belge
              </p>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Servis Geçmişi</dt>
                  <dd className="text-right">
                    {car.has_service_history ? "Var" : "Yok"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Hasar Kaydı</dt>
                  <dd className="text-right">
                    {car.has_damage_record ? "Var" : "Yok"}
                  </dd>
                </div>
                {car.vin && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">VIN</dt>
                    <dd className="text-right font-mono text-xs break-all">
                      {car.vin}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* İlgili araçlar */}
      {relatedCars && relatedCars.length > 0 && (
        <section className="px-6 pb-24 max-w-7xl mx-auto">
          <div className="border-t border-border pt-16">
            <header className="mb-12">
              <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
                Benzer Araçlar
              </p>
              <h2 className="font-serif text-3xl">Keşfetmeye Devam Et</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCars.map((rc) => (
                <CarCard key={rc.id} car={rc} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}