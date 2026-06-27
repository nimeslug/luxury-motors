import { createClient } from "@/lib/supabase/server";
import { CarCard } from "@/components/cars/car-card";
import { CarFilters } from "@/components/cars/car-filters";
import { CarSort } from "@/components/cars/car-sort";
import { CarSearch } from "@/components/cars/car-search";
import { Pagination } from "@/components/cars/pagination";
import { AISearch } from "@/components/cars/ai-search";

export const metadata = {
  title: "Tüm Araçlar",
};

type SearchParams = {
  brand?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  fuel?: string;
  sort?: string;
  q?: string;
  page?: string;
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const PAGE_SIZE = 9;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();

  // Filtre UI için markaları ve kategorileri çek
  const [brandsRes, categoriesRes] = await Promise.all([
    supabase.from("brands").select("id, name, slug").order("name"),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);
  const brands = brandsRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  // Slug'ları ID'ye çevir
  const brandId = params.brand
    ? brands.find((b) => b.slug === params.brand)?.id ?? null
    : null;
  const categoryId = params.category
    ? categories.find((c) => c.slug === params.category)?.id ?? null
    : null;

  // Araç sorgusu
  let query = supabase.from("cars").select(
    `
      id,
      slug,
      model,
      year,
      price,
      currency,
      status,
      brands ( name ),
      car_images ( url, is_primary )
    `,
    { count: "exact" }
  );

  if (brandId) query = query.eq("brand_id", brandId);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (params.minPrice) query = query.gte("price", Number(params.minPrice));
  if (params.maxPrice) query = query.lte("price", Number(params.maxPrice));
  if (params.minYear) query = query.gte("year", Number(params.minYear));
  if (params.maxYear) query = query.lte("year", Number(params.maxYear));
  if (params.fuel) {
    query = query.eq(
      "fuel_type",
      params.fuel as "benzin" | "dizel" | "hybrid" | "elektrik"
    );
  }
  if (params.q) {
    query = query.ilike("model", `%${params.q}%`);
  }

  // Sıralama
  switch (params.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "year-asc":
      query = query.order("year", { ascending: true });
      break;
    case "year-desc":
      query = query.order("year", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data: cars, error, count } = await query;
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  return (
    <>
      <header className="bg-foreground text-background pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Koleksiyon
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Tüm Araçlar</h1>
          <p className="text-sm opacity-70 mb-8">
            {count ?? 0} araç listeleniyor
          </p>
          <CarSearch />
        </div>
      </header>

      <AISearch brands={brands} categories={categories} />

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <CarFilters brands={brands} categories={categories} />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-border">
              <p className="text-sm text-muted">{count ?? 0} araç bulundu</p>
              <CarSort />
            </div>

            {error && (
              <div className="text-xs text-accent mb-8">{error.message}</div>
            )}

            {cars && cars.length === 0 ? (
              <div className="text-center py-24 text-muted">
                <p className="font-serif text-2xl mb-2">Sonuç bulunamadı</p>
                <p className="text-sm">Filtreleri değiştirip tekrar deneyin.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {cars?.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}