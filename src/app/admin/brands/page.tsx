import { createClient } from "@/lib/supabase/server";
import { TaxonomyList } from "@/components/admin/taxonomy-list";
import {
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/app/actions/taxonomy";

export const metadata = { title: "Markalar" };

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name");

  return (
    <>
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Taksonomi
        </p>
        <h1 className="font-serif text-4xl mb-2">Markalar</h1>
        <p className="text-sm text-muted">
          {brands?.length ?? 0} marka tanımlı
        </p>
      </header>

      <TaxonomyList
        items={brands ?? []}
        actions={{
          create: createBrand,
          update: updateBrand,
          remove: deleteBrand,
        }}
        itemLabel="Marka"
      />
    </>
  );
}
