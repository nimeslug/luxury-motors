"use client";

import { useActionState } from "react";
import { createCar, updateCar } from "@/app/actions/cars";
import { Check } from "lucide-react";

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

type CarData = {
  id?: string;
  brand_id?: string;
  category_id?: string;
  model?: string;
  year?: number;
  price?: number;
  currency?: string;
  mileage_km?: number;
  fuel_type?: string;
  transmission?: string;
  condition?: string;
  status?: string;
  description?: string | null;
  horsepower?: number | null;
  torque_nm?: number | null;
  top_speed_kmh?: number | null;
  acceleration_0_100?: number | null;
  engine_displacement?: number | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  vin?: string | null;
  location?: string | null;
  has_service_history?: boolean | null;
  has_damage_record?: boolean | null;
  is_featured?: boolean | null;
};

export function CarForm({
  brands,
  categories,
  car,
}: {
  brands: Brand[];
  categories: Category[];
  car?: CarData;
}) {
  const isEdit = !!car?.id;
  const action = isEdit ? updateCar.bind(null, car!.id!) : createCar;

  const [state, formAction, pending] = useActionState(action, { error: null });

  const inputClass =
    "w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors";
  const labelClass =
    "text-xs tracking-[0.2em] uppercase text-muted mb-2 block";

  return (
    <form action={formAction} className="space-y-12">
      <section>
        <h2 className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Temel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Marka *</label>
            <select name="brand_id" defaultValue={car?.brand_id ?? ""} required className={inputClass}>
              <option value="">Seçin</option>
              {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Kategori *</label>
            <select name="category_id" defaultValue={car?.category_id ?? ""} required className={inputClass}>
              <option value="">Seçin</option>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Model *</label>
            <input name="model" defaultValue={car?.model ?? ""} required className={inputClass} placeholder="Ör: F8 Tributo" />
          </div>
          <div>
            <label className={labelClass}>Yıl *</label>
            <input type="number" name="year" defaultValue={car?.year ?? new Date().getFullYear()} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kilometre</label>
            <input type="number" name="mileage_km" defaultValue={car?.mileage_km ?? 0} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Fiyat & Durum</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Fiyat *</label>
            <input type="number" name="price" defaultValue={car?.price ?? ""} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Para Birimi</label>
            <select name="currency" defaultValue={car?.currency ?? "EUR"} className={inputClass}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="TRY">TRY</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Durum</label>
            <select name="status" defaultValue={car?.status ?? "taslak"} className={inputClass}>
              <option value="taslak">Taslak</option>
              <option value="yayinda">Yayında</option>
              <option value="rezerve">Rezerve</option>
              <option value="satildi">Satıldı</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Araç Durumu</label>
            <select name="condition" defaultValue={car?.condition ?? "ikinci_el"} className={inputClass}>
              <option value="yeni">Yeni</option>
              <option value="ikinci_el">İkinci El</option>
            </select>
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <input type="checkbox" name="is_featured" defaultChecked={car?.is_featured ?? false} className="accent-accent w-4 h-4" />
              Öne Çıkan Araç
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Teknik</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Yakıt *</label>
            <select name="fuel_type" defaultValue={car?.fuel_type ?? "benzin"} required className={inputClass}>
              <option value="benzin">Benzin</option>
              <option value="dizel">Dizel</option>
              <option value="hybrid">Hybrid</option>
              <option value="elektrik">Elektrik</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Vites *</label>
            <select name="transmission" defaultValue={car?.transmission ?? "otomatik"} required className={inputClass}>
              <option value="manuel">Manuel</option>
              <option value="otomatik">Otomatik</option>
              <option value="yari_otomatik">Yarı Otomatik</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Motor Hacmi (L)</label>
            <input type="number" step="0.1" name="engine_displacement" defaultValue={car?.engine_displacement ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Güç (HP)</label>
            <input type="number" name="horsepower" defaultValue={car?.horsepower ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tork (Nm)</label>
            <input type="number" name="torque_nm" defaultValue={car?.torque_nm ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Maks. Hız (km/s)</label>
            <input type="number" name="top_speed_kmh" defaultValue={car?.top_speed_kmh ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>0-100 (saniye)</label>
            <input type="number" step="0.1" name="acceleration_0_100" defaultValue={car?.acceleration_0_100 ?? ""} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Görünüm & Belge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Dış Renk</label>
            <input name="exterior_color" defaultValue={car?.exterior_color ?? ""} className={inputClass} placeholder="Ör: Rosso Corsa" />
          </div>
          <div>
            <label className={labelClass}>İç Renk</label>
            <input name="interior_color" defaultValue={car?.interior_color ?? ""} className={inputClass} placeholder="Ör: Nero" />
          </div>
          <div>
            <label className={labelClass}>VIN</label>
            <input name="vin" defaultValue={car?.vin ?? ""} className={inputClass} placeholder="17 karakter" />
          </div>
          <div>
            <label className={labelClass}>Konum</label>
            <input name="location" defaultValue={car?.location ?? ""} className={inputClass} placeholder="Ör: İstanbul" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <input type="checkbox" name="has_service_history" defaultChecked={car?.has_service_history ?? false} className="accent-accent w-4 h-4" />
              Servis Geçmişi
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <input type="checkbox" name="has_damage_record" defaultChecked={car?.has_damage_record ?? false} className="accent-accent w-4 h-4" />
              Hasar Kaydı
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Açıklama</h2>
        <textarea name="description" defaultValue={car?.description ?? ""} rows={6} className={inputClass + " resize-none"} placeholder="Araç hakkında detaylı açıklama..." />
      </section>

      <div className="border-t border-border pt-8">
        {state.error && (
          <div className="text-xs text-accent border-l-2 border-accent pl-3 py-2 mb-4">{state.error}</div>
        )}
        {isEdit && state.error === null && !pending && (
          <div className="text-xs text-green-600 border-l-2 border-green-600 pl-3 py-2 mb-4 flex items-center gap-2">
            <Check className="w-3 h-3" strokeWidth={1.5} />
            Değişiklikler kaydedildi
          </div>
        )}
        <button type="submit" disabled={pending} className="px-8 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50 disabled:cursor-not-allowed">
          {pending ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Araç Ekle"}
        </button>
      </div>
    </form>
  );
}
