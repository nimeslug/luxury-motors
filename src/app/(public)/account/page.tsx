import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import Link from "next/link";
import { Heart, LogOut, Mail } from "lucide-react";

export const metadata = {
  title: "Hesabım",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Girişli değilse login'e yönlendir
  if (!user) {
    redirect("/login");
  }

  // Profil bilgisi
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name || user.user_metadata?.full_name || "Kullanıcı";
  const initial = fullName.charAt(0).toUpperCase();

  // Favori sayısı
  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const memberSince = new Date(user.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });

  return (
    <>
      <header className="bg-foreground text-background pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            Hesap
          </p>
          <h1 className="font-serif text-5xl md:text-6xl">Hoş Geldiniz</h1>
        </div>
      </header>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol: profil + istatistikler */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 pb-10 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center font-serif text-3xl flex-shrink-0">
                {initial}
              </div>
              <div>
                <h2 className="font-serif text-3xl mb-2">{fullName}</h2>
                <p className="text-sm text-muted flex items-center gap-2 mb-1">
                  <Mail className="w-3 h-3" strokeWidth={1.5} />
                  {user.email}
                </p>
                <p className="text-xs text-muted">Üye: {memberSince}</p>
              </div>
            </div>

            <div className="pt-10 space-y-6">
              <h3 className="text-xs tracking-[0.3em] uppercase text-accent">
                İstatistikler
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <Link
                  href="/favorites"
                  className="group block p-6 border border-border hover:border-foreground transition-colors"
                >
                  <Heart
                    className="w-6 h-6 mb-3 group-hover:text-accent transition-colors"
                    strokeWidth={1.5}
                  />
                  <p className="font-serif text-3xl mb-1">
                    {favoritesCount ?? 0}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted">
                    Favori Araç
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Sağ: aksiyon paneli */}
          <aside className="lg:border-l border-border lg:pl-12">
            <div className="space-y-3">
              <Link
                href="/favorites"
                className="flex items-center justify-between p-4 border border-border hover:bg-surface transition-colors group"
              >
                <span className="text-xs tracking-[0.2em] uppercase">
                  Favorilerim
                </span>
                <Heart
                  className="w-4 h-4 group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                />
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-4 border border-border hover:bg-surface transition-colors group cursor-pointer"
                >
                  <span className="text-xs tracking-[0.2em] uppercase">
                    Çıkış Yap
                  </span>
                  <LogOut
                    className="w-4 h-4 group-hover:text-accent transition-colors"
                    strokeWidth={1.5}
                  />
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}