"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generateCarDescription } from "@/app/actions/ai";

type CarContext = {
  brandName: string;
  categoryName: string;
  model: string;
  year: number;
  horsepower?: number | null;
  topSpeed?: number | null;
  acceleration?: number | null;
  fuelType?: string;
  transmission?: string;
  exteriorColor?: string | null;
  interiorColor?: string | null;
};

export function AIDescriptionButton({
  getContext,
  onGenerated,
}: {
  getContext: () => CarContext | null;
  onGenerated: (text: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    const context = getContext();

    if (!context) {
      setError("Lütfen önce marka, kategori ve model alanlarını doldurun.");
      return;
    }

    setLoading(true);
    const result = await generateCarDescription(context);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.description) {
      onGenerated(result.description);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-colors text-xs tracking-[0.2em] uppercase disabled:opacity-50 cursor-pointer w-fit"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" strokeWidth={1.5} />
        ) : (
          <Sparkles className="w-3 h-3" strokeWidth={1.5} />
        )}
        {loading ? "Üretiliyor..." : "AI ile Oluştur"}
      </button>
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}