import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarForm } from "@/components/admin/car-form";
import { CarImagesManager } from "@/components/admin/car-images-manager";
import { DeleteCarButton } from "@/components/admin/delete-car-button";

export const metadata = {
  title: "Araç Düzenle",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [carRes, brandsRes, categoriesRes, imagesRes] = await Promise.all([
    supabase.from("cars").select("*").eq("id", id).single(),
    supabase.from("brands").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
    supabase
      .from("car_images")
      .select("id, url, is_primary, display_order")
      .eq("car_id", id),
  ]);

  if (carRes.error || !carRes.data) notFound();

  const car = carRes.data;

  return (
    <>
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        Araçlar
      </Link>

      <header className="mb-12">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Düzenleme
        </p>
        <h1 className="font-serif text-4xl">{car.model}</h1>
      </header>

      <section className="mb-16">
        <h2 className="font-serif text-2xl mb-6">Görseller</h2>
        <CarImagesManager carId={id} images={imagesRes.data ?? []} />
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-6">Bilgiler</h2>
        <CarForm
          brands={brandsRes.data ?? []}
          categories={categoriesRes.data ?? []}
          car={car}
        />
      </section>

      <section className="mt-16 pt-16 border-t border-border">
        <DeleteCarButton carId={id} carModel={car.model} />
      </section>
    </>
  );
}