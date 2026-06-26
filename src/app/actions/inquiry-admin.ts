"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type InquiryStatus = "yeni" | "gorusuldu" | "tamamlandi" | "iptal";

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { error: null };
}

export async function deleteInquiry(inquiryId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", inquiryId);

  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { error: null };
}
