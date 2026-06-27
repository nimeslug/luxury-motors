import { getGemini } from "@/lib/gemini/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const gemini = getGemini();
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Türkçe olarak bir lüks otomotiv sitesi için tek cümlelik karşılama mesajı yaz. Sadece cümleyi döndür.",
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}