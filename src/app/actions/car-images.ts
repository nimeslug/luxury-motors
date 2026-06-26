"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type UploadState = { error: string | null; success: boolean };

export async function uploadCarImage(
  carId: string,
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "Lütfen bir dosya seçin.", success: false };
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Dosya 5MB'tan büyük olamaz.", success: false };
  }

  // Dosya uzantısı
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${carId}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${ext}`;

  // Storage'a yükle
  const { error: uploadError } = await supabase.storage
    .from("car-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message, success: false };
  }

  // Public URL al
  const {
    data: { publicUrl },
  } = supabase.storage.from("car-images").getPublicUrl(fileName);

  // Mevcut görsel sayısı (display_order için)
  const { count } = await supabase
    .from("car_images")
    .select("*", { count: "exact", head: true })
    .eq("car_id", carId);

  const displayOrder = count ?? 0;
  const isPrimary = displayOrder === 0; // İlk yüklenen primary

  // car_images tablosuna kaydet
  const { error: insertError } = await supabase.from("car_images").insert({
    car_id: carId,
    url: publicUrl,
    storage_path: fileName,
    display_order: displayOrder,
    is_primary: isPrimary,
    alt_text: "Araç görseli",
  });

  if (insertError) {
    // Insert başarısızsa storage'dan da sil
    await supabase.storage.from("car-images").remove([fileName]);
    return { error: insertError.message, success: false };
  }

  revalidatePath(`/admin/cars/${carId}`);
  revalidatePath("/cars");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function deleteCarImage(imageId: string, carId: string) {
  const supabase = await createClient();

  // Önce path'i al
  const { data: image } = await supabase
    .from("car_images")
    .select("storage_path, is_primary")
    .eq("id", imageId)
    .single();

  if (!image) {
    return { error: "Görsel bulunamadı" };
  }

  // Storage'dan sil
  if (image.storage_path) {
    await supabase.storage.from("car-images").remove([image.storage_path]);
  }

  // DB'den sil
  const { error } = await supabase
    .from("car_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  // Eğer primary silinmişse, başka birini primary yap
  if (image.is_primary) {
    const { data: remaining } = await supabase
      .from("car_images")
      .select("id")
      .eq("car_id", carId)
      .order("display_order")
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase
        .from("car_images")
        .update({ is_primary: true })
        .eq("id", remaining[0].id);
    }
  }

  revalidatePath(`/admin/cars/${carId}`);
  revalidatePath("/cars");
  revalidatePath("/");
  return { error: null };
}

export async function setPrimaryImage(imageId: string, carId: string) {
  const supabase = await createClient();

  // Tüm görselleri primary=false yap
  await supabase
    .from("car_images")
    .update({ is_primary: false })
    .eq("car_id", carId);

  // Seçileni primary=true yap
  const { error } = await supabase
    .from("car_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cars/${carId}`);
  revalidatePath("/cars");
  revalidatePath("/");
  return { error: null };
}