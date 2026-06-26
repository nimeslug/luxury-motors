"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  uploadCarImage,
  deleteCarImage,
  setPrimaryImage,
} from "@/app/actions/car-images";
import { Upload, Trash2, Star, Loader2 } from "lucide-react";

type CarImage = {
  id: string;
  url: string;
  is_primary: boolean | null;
  display_order: number;
};

export function CarImagesManager({
  carId,
  images,
}: {
  carId: string;
  images: CarImage[];
}) {
  const [state, formAction, pending] = useActionState(
    uploadCarImage.bind(null, carId),
    { error: null, success: false }
  );
  const [isDeleting, startDelete] = useTransition();
  const [isPrimarying, startPrimary] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Upload başarılıysa formu sıfırla
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setFileName("");
    }
  }, [state.success]);

  function handleDelete(imageId: string) {
    if (!confirm("Bu görsel silinecek. Emin misiniz?")) return;
    startDelete(() => {
      deleteCarImage(imageId, carId);
    });
  }

  function handleSetPrimary(imageId: string) {
    startPrimary(() => {
      setPrimaryImage(imageId, carId);
    });
  }

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.display_order - b.display_order;
  });

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <form
        ref={formRef}
        action={formAction}
        className="border border-dashed border-border p-8 text-center"
      >
        <Upload
          className="w-8 h-8 mx-auto mb-4 text-muted"
          strokeWidth={1.5}
        />
        <p className="text-sm mb-2">Görsel yüklemek için seç</p>
        <p className="text-xs text-muted mb-6">JPG, PNG, WebP — Max 5MB</p>

        <input
          type="file"
          name="file"
          id="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <label
            htmlFor="file"
            className="inline-block px-6 py-3 border border-border hover:bg-surface transition-colors text-xs tracking-[0.3em] uppercase cursor-pointer"
          >
            Dosya Seç
          </label>

          {fileName && (
            <>
              <span className="text-xs text-muted truncate max-w-xs">
                {fileName}
              </span>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50"
              >
                {pending && (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    strokeWidth={1.5}
                  />
                )}
                {pending ? "Yükleniyor..." : "Yükle"}
              </button>
            </>
          )}
        </div>

        {state.error && (
          <p className="text-xs text-accent mt-4">{state.error}</p>
        )}
      </form>

      {/* Görseller */}
      {sortedImages.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">
          Henüz görsel yüklenmemiş.
        </p>
      ) : (
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-muted mb-4">
            {sortedImages.length} görsel — yıldıza tıklayarak primary yapın
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square bg-surface overflow-hidden group"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {/* Primary badge */}
                {img.is_primary && (
                  <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 text-xs tracking-[0.2em] uppercase flex items-center gap-1">
                    <Star
                      className="w-3 h-3 fill-white"
                      strokeWidth={1.5}
                    />
                    Primary
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!img.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={isPrimarying}
                      className="p-2 bg-background/20 hover:bg-accent text-white transition-colors"
                      title="Primary yap"
                    >
                      <Star className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={isDeleting}
                    className="p-2 bg-background/20 hover:bg-accent text-white transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}