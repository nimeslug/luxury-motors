"use server";

import { getGemini } from "@/lib/gemini/client";

type AiState = {
  description: string | null;
  error: string | null;
};

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

export async function generateCarDescription(
  context: CarContext
): Promise<AiState> {
  try {
    const gemini = getGemini();

    const specs = [
      `Marka: ${context.brandName}`,
      `Model: ${context.model}`,
      `Kategori: ${context.categoryName}`,
      `Yıl: ${context.year}`,
      context.horsepower && `Güç: ${context.horsepower} HP`,
      context.topSpeed && `Maksimum Hız: ${context.topSpeed} km/s`,
      context.acceleration && `0-100 km/s: ${context.acceleration} saniye`,
      context.fuelType && `Yakıt: ${context.fuelType}`,
      context.transmission && `Vites: ${context.transmission}`,
      context.exteriorColor && `Dış Renk: ${context.exteriorColor}`,
      context.interiorColor && `İç Renk: ${context.interiorColor}`,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `Aşağıdaki lüks araç için Türkçe, profesyonel ve şiirsel bir tanıtım metni yaz.

Araç Bilgileri:
${specs}

Kurallar:
- 3-4 cümle, toplam 60-90 kelime
- Lüks otomotiv dergisi tonunda yaz (Robb Report, Top Gear stili)
- Aracın karakterini, performansını ve estetiğini vurgula
- Klişe ifadelerden kaçın ("baş döndürücü", "muhteşem" gibi)
- Sadece tanıtım metnini döndür, başlık veya açıklama ekleme
- Markaya ve modele özgü detaylar kullan`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      return { description: null, error: "AI yanıt veremedi" };
    }

    return { description: text, error: null };
  } catch (error) {
    return {
      description: null,
      error: (error as Error).message,
    };
  }
}

type SearchFiltersResult = {
  filters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuel?: string;
    sort?: string;
    q?: string;
  } | null;
  error: string | null;
};

export async function parseSearchQuery(
  userQuery: string,
  options: { brands: { slug: string; name: string }[]; categories: { slug: string; name: string }[] }
): Promise<SearchFiltersResult> {
  if (!userQuery || userQuery.trim().length === 0) {
    return { filters: null, error: "Boş sorgu" };
  }

  try {
    const gemini = getGemini();

    const brandList = options.brands.map((b) => `${b.slug} (${b.name})`).join(", ");
    const categoryList = options.categories.map((c) => `${c.slug} (${c.name})`).join(", ");

    const prompt = `Sen bir lüks otomotiv pazaryeri için arama parser'ısın. Kullanıcının doğal dil sorgusunu JSON filtre objesine çevir.

Mevcut markalar (slug): ${brandList}
Mevcut kategoriler (slug): ${categoryList}

Yakıt tipleri: benzin, dizel, hybrid, elektrik
Sıralama: newest, oldest, price-asc, price-desc, year-desc, year-asc

Kullanıcı sorgusu: "${userQuery}"

Şu JSON formatında dön (sadece JSON, açıklama yok, code fence yok):
{
  "brand": "slug veya null",
  "category": "slug veya null",
  "minPrice": sayı veya null,
  "maxPrice": sayı veya null,
  "minYear": sayı veya null,
  "maxYear": sayı veya null,
  "fuel": "benzin/dizel/hybrid/elektrik veya null",
  "sort": "price-asc/price-desc/year-desc/year-asc veya null",
  "q": "model adı araması veya null"
}

Kurallar:
- Eşleşmeyen markalar için brand=null bırak
- "Spor araba" → category=super-spor, "SUV" → category=luks-suv
- "Hızlı/güçlü" → sort=year-desc gibi yorumlama yapma, sadece açık fiyat/yıl sıralaması varsa kullan
- Fiyat birimleri: "bin"=1000, "milyon"=1000000
- "Altı" = maxPrice, "üstü" = minPrice`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text?.trim() ?? "";
    // Olası code fence temizliği
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "");

    const parsed = JSON.parse(text);
    const filters: SearchFiltersResult["filters"] = {};

    if (parsed.brand) filters.brand = parsed.brand;
    if (parsed.category) filters.category = parsed.category;
    if (parsed.minPrice) filters.minPrice = parsed.minPrice;
    if (parsed.maxPrice) filters.maxPrice = parsed.maxPrice;
    if (parsed.minYear) filters.minYear = parsed.minYear;
    if (parsed.maxYear) filters.maxYear = parsed.maxYear;
    if (parsed.fuel) filters.fuel = parsed.fuel;
    if (parsed.sort) filters.sort = parsed.sort;
    if (parsed.q) filters.q = parsed.q;

    return { filters, error: null };
  } catch (error) {
    return { filters: null, error: (error as Error).message };
  }
}