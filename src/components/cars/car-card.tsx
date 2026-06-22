"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoriteButton } from "./favorite-button";

type CarImage = { url: string; is_primary: boolean | null };
type CarBrand = { name: string } | { name: string }[] | null;

type Car = {
  id: string;
  slug: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  status: string | null;
  brands: CarBrand;
  car_images: CarImage[];
};

export function CarCard({
  car,
  isFavorited,
}: {
  car: Car;
  isFavorited?: boolean | null;
}) {
  const [imageError, setImageError] = useState(false);

  const primaryImage =
    car.car_images.find((img) => img.is_primary)?.url ??
    car.car_images[0]?.url;

  const brandName = Array.isArray(car.brands)
    ? car.brands[0]?.name
    : car.brands?.name;

  const showImage = primaryImage && !imageError;

  return (
    <Link href={`/cars/${car.slug}`} className="group block">
      <article>
        <div className="aspect-[16/9] bg-surface mb-4 overflow-hidden relative">
          {showImage && (
            <img
              src={primaryImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-muted font-serif text-xl tracking-wider opacity-50 pointer-events-none">
            {car.model}
          </div>

          {/* Favori butonu - sadece giriş yapılmışsa */}
          {isFavorited !== null && isFavorited !== undefined && (
            <FavoriteButton carId={car.id} isFavorited={isFavorited} />
          )}
        </div>
        <p className="text-xs tracking-widest text-muted uppercase mb-1">
          {brandName} · {car.year}
        </p>
        <h3 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
          {car.model}
        </h3>
        <p className="text-lg">
          {new Intl.NumberFormat("tr-TR").format(car.price)} {car.currency}
        </p>
      </article>
    </Link>
  );
}