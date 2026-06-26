"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

type State = { error: string | null };

// BRANDS
export async function createBrand(
  _prev: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  if (!name) return { error: "İsim gerekli" };

  const { error } = await supabase.from("brands").insert({
    name,
    slug: slugify(name),
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { error: null };
}

export async function updateBrand(brandId: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("brands")
    .update({ name, slug: slugify(name) })
    .eq("id", brandId);

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { error: null };
}

export async function deleteBrand(brandId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brands").delete().eq("id", brandId);

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { error: null };
}

// CATEGORIES
export async function createCategory(
  _prev: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  if (!name) return { error: "İsim gerekli" };

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { error: null };
}

export async function updateCategory(categoryId: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name) })
    .eq("id", categoryId);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { error: null };
}