"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const sortOptions = [
  { value: "newest", label: "Yeniden Eskiye" },
  { value: "oldest", label: "Eskiden Yeniye" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "year-desc", label: "Yıl: En Yeni" },
  { value: "year-asc", label: "Yıl: En Eski" },
];

export function CarSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  function handleChange(value: string) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");  // ← bu satır eklendi
  if (value && value !== "newest") {
    params.set("sort", value);
  } else {
    params.delete("sort");
  }
  router.push(`${pathname}?${params.toString()}`);
}

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs tracking-[0.2em] uppercase text-muted whitespace-nowrap">
        Sırala
      </label>
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}