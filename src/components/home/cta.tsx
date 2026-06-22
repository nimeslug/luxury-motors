import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CallToAction() {
  return (
    <section className="bg-foreground text-background py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
          Ayrıcalık
        </p>
        <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-[1.1]">
          Doğru aracı bulmak,
          <br />
          ya da emanet etmek.
        </h2>
        <p className="text-base md:text-lg opacity-70 mb-12 max-w-xl mx-auto leading-relaxed">
          Lüks otomotiv dünyasında size özel danışmanlık sunuyoruz.
          Aradığınız aracı bizim koleksiyonumuzda bulalım, ya da
          mevcut aracınızı koleksiyonumuza katmanın yolunu birlikte planlayalım.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-background text-foreground hover:bg-accent hover:text-white transition-colors text-xs tracking-[0.3em] uppercase"
          >
            İletişime Geç
            <ChevronRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/contact?type=sell"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-background/30 hover:bg-background/10 transition-colors text-xs tracking-[0.3em] uppercase"
          >
            Aracınızı Satın
            <ChevronRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}