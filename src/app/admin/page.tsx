import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Car, Mail, Heart, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Sayımları paralel al
  const [carsRes, inquiriesRes, favoritesRes, usersRes, recentInquiriesRes] =
    await Promise.all([
      supabase.from("cars").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("favorites").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select(
          "id, full_name, email, inquiry_type, status, created_at, cars ( model )"
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const stats = [
    {
      label: "Araç",
      value: carsRes.count ?? 0,
      icon: Car,
      href: "/admin/cars",
    },
    {
      label: "Sorgu",
      value: inquiriesRes.count ?? 0,
      icon: Mail,
      href: "/admin/inquiries",
    },
    {
      label: "Favori",
      value: favoritesRes.count ?? 0,
      icon: Heart,
      href: null,
    },
    {
      label: "Kullanıcı",
      value: usersRes.count ?? 0,
      icon: Users,
      href: null,
    },
  ];

  const inquiryTypeMap: Record<string, string> = {
    bilgi: "Bilgi",
    test_surusu: "Test Sürüşü",
    fiyat_teklifi: "Fiyat Teklifi",
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    yeni: { label: "Yeni", color: "bg-accent text-white" },
    inceleniyor: { label: "İnceleniyor", color: "bg-yellow-500 text-white" },
    tamamlandi: { label: "Tamamlandı", color: "bg-green-600 text-white" },
    iptal: { label: "İptal", color: "bg-muted text-white" },
  };

  const recentInquiries = recentInquiriesRes.data ?? [];

  return (
    <>
      <header className="mb-12">
        <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
          Yönetim Paneli
        </p>
        <h1 className="font-serif text-4xl">Dashboard</h1>
      </header>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div className="p-6 border border-border hover:border-foreground transition-colors h-full">
              <Icon
                className="w-6 h-6 mb-4 text-muted"
                strokeWidth={1.5}
              />
              <p className="font-serif text-4xl mb-1">{stat.value}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-muted">
                {stat.label}
              </p>
            </div>
          );

          if (stat.href) {
            return (
              <Link key={stat.label} href={stat.href} className="block">
                {content}
              </Link>
            );
          }
          return <div key={stat.label}>{content}</div>;
        })}
      </div>

      {/* Son Sorgular */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">Son Sorgular</h2>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <p className="text-sm text-muted">Henüz sorgu yok.</p>
        ) : (
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface/50">
                <tr className="text-xs tracking-[0.2em] uppercase text-muted">
                  <th className="text-left p-4 font-normal">Kişi</th>
                  <th className="text-left p-4 font-normal hidden md:table-cell">
                    Konu
                  </th>
                  <th className="text-left p-4 font-normal hidden lg:table-cell">
                    Araç
                  </th>
                  <th className="text-left p-4 font-normal">Durum</th>
                  <th className="text-left p-4 font-normal hidden md:table-cell">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  const status = statusMap[inq.status] ?? statusMap.yeni;
                  const carName = Array.isArray(inq.cars)
                    ? inq.cars[0]?.model
                    : (inq.cars as { model: string } | null)?.model;
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
                        {inquiryTypeMap[inq.inquiry_type]}
                      </td>
                      <td className="p-4 text-muted hidden lg:table-cell">
                        {carName ?? "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-muted hidden md:table-cell text-xs">
                        {new Date(inq.created_at!).toLocaleDateString(
                          "tr-TR",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}