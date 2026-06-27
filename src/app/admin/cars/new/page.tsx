import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarForm } from "@/components/admin/car-form";

export const metadata = {
  title: "Yeni Araç",
};

export default async function NewCarPage() {
  const supabase = await createClient();
  const [brandsRes, categoriesRes] = await Promise.all([
    supabase.from("brands").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ]);

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
          Yeni Kayıt
        </p>
        <h1 className="font-serif text-4xl">Araç Ekle</h1>
      </header>

      <CarForm
        brands={brandsRes.data ?? []}
        categories={categoriesRes.data ?? []}
      />
    </>
  );
}
