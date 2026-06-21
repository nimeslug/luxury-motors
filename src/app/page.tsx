import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: brands, error } = await supabase
    .from("brands")
    .select("name")
    .order("name");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-accent mb-6 uppercase">
        Coming Soon
      </p>
      <h1 className="font-serif text-6xl md:text-7xl mb-6 leading-tight">
        Luxury Motors
      </h1>
      <p className="text-muted text-lg max-w-md leading-relaxed mb-8">
        Premium otomobillerin adresi. Yakında.
      </p>

      {error ? (
        <div className="text-xs text-accent">❌ {error.message}</div>
      ) : (
        <div className="mt-8 text-xs text-muted tracking-widest uppercase max-w-2xl">
          {brands?.map((b) => b.name).join(" · ")}
        </div>
      )}

      <div className="mt-12 h-px w-24 bg-border" />
    </main>
  );
}