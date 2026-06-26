import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";

export const metadata = {
  title: "Araçlar",
};

const statusMap: Record<string, { label: string; color: string }> = {
  yayinda: { label: "Yayında", color: "bg-green-600 text-white" },
  satildi: { label: "Satıldı", color: "bg-muted text-white" },
  taslak: { label: "Taslak", color: "bg-yellow-500 text-white" },
  rezerve: { label: "Rezerve", color: "bg-accent text-white" },
};

export default async function AdminCarsPage() {
  const supabase = await createClient();

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
      is_featured,
      brands ( name ),
      car_images ( url, is_primary )
    `)
    .order("created_at", { ascending: false });

  const carList = cars ?? [];

  return (
    <>
      <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Koleksiyon Yönetimi
          </p>
          <h1 className="font-serif text-4xl">Araçlar</h1>
          <p className="text-sm text-muted mt-2">
            {carList.length} araç listeleniyor
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Yeni Araç
        </Link>
      </header>

      {carList.length === 0 ? (
        <div className="text-center py-24 border border-border">
          <p className="font-serif text-2xl mb-2">Henüz araç yok</p>
          <p className="text-sm text-muted mb-6">
            İlk aracınızı ekleyerek başlayın.
          </p>
          <Link
            href="/admin/cars/new"
            className="inline-block px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase"
          >
            Yeni Araç Ekle
          </Link>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface/50">
              <tr className="text-xs tracking-[0.2em] uppercase text-muted">
                <th className="text-left p-4 font-normal">Araç</th>
                <th className="text-left p-4 font-normal hidden md:table-cell">
                  Marka
                </th>
                <th className="text-left p-4 font-normal hidden lg:table-cell">
                  Yıl
                </th>
                <th className="text-left p-4 font-normal">Fiyat</th>
                <th className="text-left p-4 font-normal">Durum</th>
                <th className="text-right p-4 font-normal">Eylem</th>
              </tr>
            </thead>
            <tbody>
              {carList.map((car) => {
                const primaryImage =
                  car.car_images.find((img) => img.is_primary)?.url ??
                  car.car_images[0]?.url;
                const brandName = Array.isArray(car.brands)
                  ? car.brands[0]?.name
                  : (car.brands as { name: string } | null)?.name;
                const status = statusMap[car.status] ?? statusMap.taslak;

                return (
                  <tr
                    key={car.id}
                    className="border-t border-border hover:bg-surface/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-surface flex-shrink-0 overflow-hidden">
                          {primaryImage && (
                            <img
                              src={primaryImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{car.model}</span>
                            {car.is_featured && (
                              <Star
                                className="w-3 h-3 text-accent fill-accent"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted md:hidden">
                            {brandName} · {car.year}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted hidden md:table-cell">
                      {brandName}
                    </td>
                    <td className="p-4 text-muted hidden lg:table-cell">
                      {car.year}
                    </td>
                    <td className="p-4">
                      {new Intl.NumberFormat("tr-TR").format(car.price)}{" "}
                      {car.currency}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/cars/${car.id}`}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.5} />
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}