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