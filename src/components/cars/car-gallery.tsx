"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = { url: string; alt_text?: string | null };

export function CarGallery({
  images,
  modelName,
}: {
  images: GalleryImage[];
  modelName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = () => setSelectedIndex((i) => (i + 1) % images.length);
  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-surface flex items-center justify-center text-muted">
        <span className="font-serif text-xl">{modelName}</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setLightboxOpen(true)}
          className="block w-full aspect-[16/9] bg-surface overflow-hidden group cursor-zoom-in"
          aria-label="Görseli büyüt"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt_text ?? modelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`aspect-square bg-surface overflow-hidden transition-all ${
                  i === selectedIndex
                    ? "opacity-100 ring-1 ring-foreground"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Görsel ${i + 1}`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-10"
            aria-label="Kapat"
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-6 text-white hover:text-accent transition-colors z-10"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
            </button>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.alt_text ?? modelName}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-6 text-white hover:text-accent transition-colors z-10"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs tracking-[0.2em]">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
