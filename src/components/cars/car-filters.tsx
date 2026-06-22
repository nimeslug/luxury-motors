"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";

type Brand = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string };

const fuelTypes = [
  { value: "", label: "Tümü" },
  { value: "benzin", label: "Benzin" },
  { value: "dizel", label: "Dizel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "elektrik", label: "Elektrik" },
];

export function CarFilters({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mevcut değerleri URL'den oku
  const currentBrand = searchParams.get("brand") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinYear = searchParams.get("minYear") || "";
  const currentMaxYear = searchParams.get("maxYear") || "";
  const currentFuel = searchParams.get("fuel") || "";

  function updateParam(key: string, value: string) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");  // ← bu satır eklendi
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  router.push(`${pathname}?${params.toString()}`);
}

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;
  const inputClass =
    "w-full px-3 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="space-y-8 lg:sticky lg:top-32">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-xs tracking-[0.25em] uppercase">Filtreler</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Temizle
            </button>
          )}
        </div>

        {/* Marka */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted mb-3 block">
            Marka
          </label>
          <select
            value={currentBrand}
            onChange={(e) => updateParam("brand", e.target.value)}
            className={inputClass}
          >
            <option value="">Tüm markalar</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategori */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted mb-3 block">
            Kategori
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateParam("category", e.target.value)}
            className={inputClass}
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fiyat */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted mb-3 block">
            Fiyat (EUR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              defaultValue={currentMinPrice}
              onBlur={(e) => updateParam("minPrice", e.target.value)}
              placeholder="Min"
              className={inputClass}
            />
            <input
              type="number"
              defaultValue={currentMaxPrice}
              onBlur={(e) => updateParam("maxPrice", e.target.value)}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>

        {/* Yıl */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted mb-3 block">
            Yıl
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              defaultValue={currentMinYear}
              onBlur={(e) => updateParam("minYear", e.target.value)}
              placeholder="Min"
              className={inputClass}
            />
            <input
              type="number"
              defaultValue={currentMaxYear}
              onBlur={(e) => updateParam("maxYear", e.target.value)}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>

        {/* Yakıt */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted mb-3 block">
            Yakıt
          </label>
          <div className="space-y-2">
            {fuelTypes.map((f) => (
              <label
                key={f.value}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-accent transition-colors"
              >
                <input
                  type="radio"
                  name="fuel"
                  value={f.value}
                  checked={currentFuel === f.value}
                  onChange={(e) => updateParam("fuel", e.target.value)}
                  className="accent-accent"
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}