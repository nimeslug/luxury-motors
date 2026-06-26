import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Sorgular" };

const statusMap: Record<string, { label: string; color: string }> = {
  yeni: { label: "Yeni", color: "bg-accent text-white" },
  gorusuldu: { label: "Görüşüldü", color: "bg-yellow-500 text-white" },
  tamamlandi: { label: "Tamamlandı", color: "bg-green-600 text-white" },
  iptal: { label: "İptal", color: "bg-muted text-white" },
};

const typeMap: Record<string, string> = {
  bilgi: "Bilgi",
  test_surusu: "Test Sürüşü",
  fiyat_teklifi: "Fiyat Teklifi",
};

type SearchParams = { status?: string };

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("inquiries")
    .select(`
      id, full_name, email, phone, inquiry_type, status, message, created_at,
      cars ( id, model, slug )
    `)
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq(
      "status",
      params.status as "yeni" | "gorusuldu" | "tamamlandi" | "iptal"
    );
  }

  const { data: inquiries } = await query;
  const list = inquiries ?? [];

  const statusFilters = [
    { value: "", label: "Tümü" },
    { value: "yeni", label: "Yeni" },
    { value: "gorusuldu", label: "Görüşüldü" },
    { value: "tamamlandi", label: "Tamamlandı" },
    { value: "iptal", label: "İptal" },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Müşteri İletişimi
        </p>
        <h1 className="font-serif text-4xl mb-2">Sorgular</h1>
        <p className="text-sm text-muted">{list.length} sorgu listeleniyor</p>
      </header>

      <div className="flex gap-2 mb-8 flex-wrap">
        {statusFilters.map((f) => {
          const active = (params.status ?? "") === f.value;
          const href = f.value ? `?status=${f.value}` : "/admin/inquiries";
          return (
            <Link
              key={f.value}
              href={href}
              className={`px-4 py-2 text-xs tracking-[0.2em] uppercase border transition-colors ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="text-center py-24 border border-border">
          <p className="font-serif text-2xl mb-2">Sorgu yok</p>
          <p className="text-sm text-muted">
            Bu kriterlere uyan sorgu bulunamadı.
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface/50">
              <tr className="text-xs tracking-[0.2em] uppercase text-muted">
                <th className="text-left p-4 font-normal">Kişi</th>
                <th className="text-left p-4 font-normal hidden md:table-cell">Konu</th>
                <th className="text-left p-4 font-normal hidden lg:table-cell">Araç</th>
                <th className="text-left p-4 font-normal">Durum</th>
                <th className="text-left p-4 font-normal hidden md:table-cell">Tarih</th>
                <th className="text-right p-4 font-normal">Detay</th>
              </tr>
            </thead>
            <tbody>
              {list.map((inq) => {
                const status = statusMap[inq.status] ?? statusMap.yeni;
                const car = Array.isArray(inq.cars)
                  ? inq.cars[0]
                  : (inq.cars as { model: string } | null);
                return (
                  <tr
                    key={inq.id}
                    className="border-t border-border hover:bg-surface/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{inq.full_name}</p>
                      <p className="text-xs text-muted">{inq.email}</p>
                    </td>
                    <td className="p-4 text-muted hidden md:table-cell">
                      {typeMap[inq.inquiry_type]}
                    </td>
                    <td className="p-4 text-muted hidden lg:table-cell">
                      {car?.model ?? "—"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-muted hidden md:table-cell text-xs">
                      {new Date(inq.created_at!).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors"
                      >
                        Aç
                        <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}