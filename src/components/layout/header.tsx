"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const leftNav = [
  { label: "Markalar", href: "/brands" },
  { label: "Araçlar", href: "/cars" },
  { label: "Kategoriler", href: "/categories" },
];

const rightNav = [
  { label: "Hakkımızda", href: "/about" },
  { label: "İletişim", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Saydam halde beyaz, scroll'lu halde siyah
  const textColor = scrolled ? "text-foreground" : "text-white";
  const hoverColor = "hover:text-accent";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Desktop */}
        <div className={cn("hidden md:grid grid-cols-3 items-center h-20 transition-colors", textColor)}>
          <nav className="flex items-center gap-8 justify-self-start">
            {leftNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("text-xs tracking-[0.2em] uppercase transition-colors", hoverColor)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="justify-self-center">
            <span className="font-serif text-xl tracking-[0.2em] uppercase">
              Luxury Motors
            </span>
          </Link>

          <div className="flex items-center gap-8 justify-self-end">
            <nav className="flex items-center gap-8">
              {rightNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("text-xs tracking-[0.2em] uppercase transition-colors", hoverColor)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/favorites" aria-label="Favoriler" className={cn("transition-colors", hoverColor)}>
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <Link href="/login" aria-label="Hesabım" className={cn("transition-colors", hoverColor)}>
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className={cn("md:hidden flex items-center justify-between h-16 transition-colors", textColor)}>
          <button
            aria-label="Menüyü aç"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
          <Link href="/">
            <span className="font-serif text-base tracking-[0.15em] uppercase">
              Luxury Motors
            </span>
          </Link>
          <Link href="/login" aria-label="Hesabım">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-6 flex flex-col gap-5 bg-background text-foreground">
            {[...leftNav, ...rightNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.2em] uppercase hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/favorites"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.2em] uppercase hover:text-accent transition-colors"
            >
              Favoriler
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}