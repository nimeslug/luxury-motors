import Link from "next/link";

const navLinks = {
  katalog: [
    { label: "Tüm Araçlar", href: "/cars" },
    { label: "Markalar", href: "/brands" },
    { label: "Kategoriler", href: "/categories" },
    { label: "Öne Çıkanlar", href: "/" },
  ],
  kurumsal: [
    { label: "Hakkımızda", href: "/about" },
    { label: "İletişim", href: "/contact" },
    { label: "Gizlilik Politikası", href: "/privacy" },
    { label: "Çerez Politikası", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Üst: marka + slogan */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-16">
          <Link href="/">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase">
              Luxury Motors
            </span>
          </Link>
          <p className="text-xs tracking-[0.3em] uppercase text-muted">
            Premium Automobiles
          </p>
        </div>

        {/* Orta: sütunlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted mb-5">
              Katalog
            </h3>
            <ul className="space-y-3">
              {navLinks.katalog.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted mb-5">
              Kurumsal
            </h3>
            <ul className="space-y-3">
              {navLinks.kurumsal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted mb-5">
              İletişim
            </h3>
            <address className="not-italic text-sm space-y-2">
              <p className="text-muted mb-2">Showroom — İstanbul</p>
              <p>Etiler Mah. Nispetiye Cd. No: 42</p>
              <p>Beşiktaş, İstanbul</p>
              <p className="pt-3">
                <a href="tel:+902120000000" className="hover:text-accent transition-colors">
                  +90 212 000 00 00
                </a>
              </p>
              <p>
                <a href="mailto:info@luxurymotors.com" className="hover:text-accent transition-colors">
                  info@luxurymotors.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Alt: copyright + atelier imza */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-xs tracking-wider text-muted">
            © {new Date().getFullYear()} Luxury Motors. Tüm hakları saklıdır.
          </p>
          
          <p className="text-xs tracking-[0.25em] text-muted uppercase flex items-center gap-3">
            <span>Designed &amp; Developed by</span>
            <span className="font-serif text-foreground tracking-[0.2em] text-sm">
              NIMESLUG
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}