import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "İletişim",
};

type SearchParams = {
  type?: string;
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Girişliyse formu kullanıcı bilgileriyle ön doldur
  let defaultName = "";
  let defaultEmail = "";
  if (user) {
    defaultEmail = user.email ?? "";
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    defaultName =
      profile?.full_name ?? user.user_metadata?.full_name ?? "";
  }

  // URL'deki ?type=sell vs. enum eşlemesi
  const typeMapping: Record<string, string> = {
    sell: "fiyat_teklifi",
    test_drive: "test_surusu",
    info: "bilgi",
  };
  const defaultType = params.type
    ? typeMapping[params.type] ?? "bilgi"
    : "bilgi";

  return (
    <>
      <header className="bg-foreground text-background pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-accent mb-3 uppercase">
            İletişim
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Bize Yazın</h1>
          <p className="text-sm opacity-70 max-w-xl">
            Lüks otomotiv dünyasında size özel danışmanlık sunuyoruz.
            Mesajınızı bırakın, en kısa sürede dönüş yapalım.
          </p>
        </div>
      </header>

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <ContactForm
          defaultType={defaultType}
          defaultName={defaultName}
          defaultEmail={defaultEmail}
        />
      </section>
    </>
  );
}