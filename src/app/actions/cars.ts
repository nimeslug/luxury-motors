"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";

type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
type CarUpdate = Database["public"]["Tables"]["cars"]["Update"];

type CarFormState = { error: string | null };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFormData(formData: FormData) {
  const num = (key: string) => {
    const v = formData.get(key) as string;
    return v && v.trim() !== "" ? Number(v) : null;
  };
  const str = (key: string) => {
    const v = formData.get(key) as string;
    return v && v.trim() !== "" ? v : null;
  };
  const bool = (key: string) => formData.get(key) === "on";

  return {
    brand_id: formData.get("brand_id") as string,
    category_id: formData.get("category_id") as string,
    model: formData.get("model") as string,
    year: Number(formData.get("year")),
    price: Number(formData.get("price")),
    currency: (formData.get("currency") as string) || "EUR",
    mileage_km: Number(formData.get("mileage_km")) || 0,
    fuel_type: formData.get("fuel_type") as
      | "benzin"
      | "dizel"
      | "hybrid"
      | "elektrik",
    transmission: formData.get("transmission") as
      | "manuel"
      | "otomatik"
      | "yari_otomatik",
    condition: formData.get("condition") as "yeni" | "ikinci_el",
    status: formData.get("status") as
      | "yayinda"
      | "satildi"
      | "taslak"
      | "rezerve",
    description: str("description"),
    horsepower: num("horsepower"),
    torque_nm: num("torque_nm"),
    top_speed_kmh: num("top_speed_kmh"),
    acceleration_0_100: num("acceleration_0_100"),
    engine_displacement: num("engine_displacement"),
    exterior_color: str("exterior_color"),
    interior_color: str("interior_color"),
    vin: str("vin"),
    location: str("location"),
    has_service_history: bool("has_service_history"),
    has_damage_record: bool("has_damage_record"),
    is_featured: bool("is_featured"),
  };
}

export async function createCar(
  _prev: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const supabase = await createClient();
  const data = parseFormData(formData);

  if (
    !data.brand_id ||
    !data.category_id ||
    !data.model ||
    !data.year ||
    !data.price
  ) {
    return { error: "Marka, kategori, model, yıl ve fiyat zorunludur." };
  }

  const slug = `${slugify(data.model)}-${data.year}`;

  const { error, data: inserted } = await supabase
    .from("cars")
    .insert({ ...data, slug } as CarInsert)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
  redirect(`/admin/cars/${inserted.id}`);
}

export async function updateCar(
  carId: string,
  _prev: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const supabase = await createClient();
  const data = parseFormData(formData);

  if (
    !data.brand_id ||
    !data.category_id ||
    !data.model ||
    !data.year ||
    !data.price
  ) {
    return { error: "Marka, kategori, model, yıl ve fiyat zorunludur." };
  }

  const { error } = await supabase
    .from("cars")
    .update(data as CarUpdate)
    .eq("id", carId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/cars");
  revalidatePath(`/admin/cars/${carId}`);
  revalidatePath("/cars");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCar(carId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cars").delete().eq("id", carId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  redirect("/admin/cars");
}