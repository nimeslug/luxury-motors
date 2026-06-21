"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=80",
    eyebrow: "Yeni Sezon",
    title: "Süper Sporlar",
    subtitle: "Pist DNA'sı, sokağın zarafeti",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80",
    eyebrow: "Koleksiyon",
    title: "Klasik İkonlar",
    subtitle: "Zaman ötesi tasarımlar, kalıcı değer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80",
    eyebrow: "Elektrikli",
    title: "Yarının Lüksü",
    subtitle: "Sessiz güç, çağdaş zarafet",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Slide arkaplanları */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* İçerik */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-90">
          {slides[index].eyebrow}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 max-w-3xl">
          {slides[index].title}
        </h1>
        <p className="text-base md:text-lg opacity-90 mb-10 max-w-xl">
          {slides[index].subtitle}
        </p>
        <Link
          href="/cars"
          className="group inline-flex items-center gap-3 px-8 py-3 border border-white/40 hover:bg-white hover:text-foreground transition-colors text-xs tracking-[0.3em] uppercase"
        >
          Araçları Keşfet
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Slayt göstergeleri */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slayt ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-px transition-all duration-500 ${
              i === index ? "w-16 bg-white" : "w-8 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}