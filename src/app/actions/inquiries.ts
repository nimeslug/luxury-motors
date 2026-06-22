"use server";

import { createClient } from "@/lib/supabase/server";

type InquiryState = { error: string | null; success: boolean };

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const type = formData.get("type") as
    | "bilgi"
    | "test_surusu"
    | "fiyat_teklifi";
  const carId = formData.get("carId") as string | null;

  if (!fullName || !email || !message) {
    return {
      error: "Lütfen tüm zorunlu alanları doldurun.",
      success: false,
    };
  }

  const { error } = await supabase.from("inquiries").insert({
    full_name: fullName,
    email,
    phone: phone || null,
    message,
    inquiry_type: type,
    car_id: carId || null,
    user_id: user?.id ?? null,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}