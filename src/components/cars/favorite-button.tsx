"use client";

import { Heart } from "lucide-react";
import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/favorites";

export function FavoriteButton({
  carId,
  isFavorited,
}: {
  carId: string;
  isFavorited: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      toggleFavorite(carId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center transition-all hover:bg-background ${
        isPending ? "opacity-50 scale-95" : ""
      }`}
      aria-label={isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isFavorited
            ? "fill-accent text-accent"
            : "text-foreground"
        }`}
        strokeWidth={1.5}
      />
    </button>
  );
}