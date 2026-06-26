import { createClient } from "@/lib/supabase/server";
import { TaxonomyList } from "@/components/admin/taxonomy-list";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/taxonomy";

export const metadata = { title: "Kategoriler" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <>
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Taksonomi
        </p>
        <h1 className="font-serif text-4xl mb-2">Kategoriler</h1>
        <p className="text-sm text-muted">
          {categories?.length ?? 0} kategori tanımlı
        </p>
      </header>

      <TaxonomyList
        items={categories ?? []}
        actions={{
          create: createCategory,
          update: updateCategory,
          remove: deleteCategory,
        }}
        itemLabel="Kategori"
      />
    </>
  );
}