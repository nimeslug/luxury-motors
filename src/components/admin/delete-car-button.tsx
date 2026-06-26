"use client";

import { useTransition } from "react";
import { deleteCar } from "@/app/actions/cars";
import { Trash2 } from "lucide-react";

export function DeleteCarButton({
  carId,
  carModel,
}: {
  carId: string;
  carModel: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = confirm(
      `"${carModel}" aracını kalıcı olarak silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz. Tüm görseller ve sorgular da silinecektir.`
    );
    if (!confirmed) return;

    startTransition(() => {
      deleteCar(carId);
    });
  }

  return (
    <div className="border border-accent/30 p-6">
      <h3 className="font-serif text-xl mb-2 text-accent">Tehlike Bölgesi</h3>
      <p className="text-sm text-muted mb-6">
        Bu aracı silmek tüm görsellerini, favorilerini ve ilişkili sorgularını
        kalıcı olarak silecektir. Geri alınamaz.
      </p>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white hover:bg-accent/80 transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
        {pending ? "Siliniyor..." : "Aracı Sil"}
      </button>
    </div>
  );
}