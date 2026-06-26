import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, User, Calendar, Car } from "lucide-react";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";

type Props = {
  params: Promise<{ id: string }>;
};

const typeMap: Record<string, string> = {
  bilgi: "Genel Bilgi",
  test_surusu: "Test Sürüşü",
  fiyat_teklifi: "Fiyat Teklifi",
};

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select("*, cars ( id, model, slug, brands ( name ) )")
    .eq("id", id)
    .single();

  if (error || !inquiry) notFound();

  const car = Array.isArray(inquiry.cars) ? inquiry.cars[0] : inquiry.cars;
  const carBrandName = car?.brands
    ? Array.isArray(car.brands)
      ? car.brands[0]?.name
      : car.brands?.name
    : null;

  const createdDate = new Date(inquiry.created_at!).toLocaleString("tr-TR");

  return (
    <>
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        Sorgular
      </Link>

      <header className="mb-12">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Sorgu Detayı
        </p>
        <h1 className="font-serif text-4xl">{inquiry.full_name}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
              Mesaj
            </h2>
            <div className="p-6 border border-border bg-surface/30">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </section>

          {car && (
            <section>
              <h2 className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
                İlgili Araç
              </h2>
              <Link
                href={"/admin/cars/" + car.id}
                className="flex items-center gap-4 p-4 border border-border hover:border-foreground transition-colors"
              >
                <Car className="w-5 h-5 text-muted" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="font-medium">{car.model}</p>
                  <p className="text-xs text-muted">{carBrandName}</p>
                </div>
              </Link>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section>
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
              Durum
            </h2>
            <InquiryStatusSelect
              inquiryId={inquiry.id}
              currentStatus={inquiry.status}
            />
          </section>

          <section className="space-y-3 text-sm">
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
              İletişim
            </h2>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted flex-shrink-0" strokeWidth={1.5} />
              <span>{inquiry.full_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted flex-shrink-0" strokeWidth={1.5} />
              <span className="break-all">{inquiry.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted flex-shrink-0" strokeWidth={1.5} />
              <span>{inquiry.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <Calendar className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-xs">{createdDate}</span>
            </div>
          </section>

          <section>
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
              Konu
            </h2>
            <p className="text-sm">{typeMap[inquiry.inquiry_type]}</p>
          </section>
        </aside>
      </div>
    </>
  );
}