"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { parseSearchQuery } from "@/app/actions/ai";

type Brand = { slug: string; name: string };
type Category = { slug: string; name: string };

export function AISearch({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const result = await parseSearchQuery(query, { brands, categories });

    setLoading(false);

    if (result.error || !result.filters) {
      setError("Aramayı yorumlayamadık, deneyebileceğin örnekler: 'spor araba 500 bin altı'");
      return;
    }

    const params = new URLSearchParams();
    Object.entries(result.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    router.push("/cars?" + params.toString());
  }

  return (
    <div className="bg-foreground text-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
          <p className="text-xs tracking-[0.3em] text-accent uppercase">
            Akıllı Arama
          </p>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl mb-6">
          Aradığınızı doğal dilde tarif edin
        </h2>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ör: 500 bin altı elektrikli SUV"
            className="flex-1 px-4 py-3 bg-transparent border border-background/30 text-background placeholder:text-background/50 text-sm focus:outline-none focus:border-background transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white hover:bg-accent/80 transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            )}
            {loading ? "Anlıyor..." : "AI ile Ara"}
          </button>
        </form>

        {error && (
          <p className="text-xs text-accent mt-3">{error}</p>
        )}

        <p className="text-xs text-background/50 mt-4">
          Örnek: "Ferrari 2022 sonrası", "1 milyon altı klasik", "hibrit lüks SUV"
        </p>
      </div>
    </div>
  );
}
