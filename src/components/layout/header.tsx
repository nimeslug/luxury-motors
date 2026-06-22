"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import type { User } from "@supabase/supabase-js";

export function Header({ user }: { user: User | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled || mobileOpen ? "text-foreground" : "text-white";
  const bgColor =
    scrolled || mobileOpen
      ? "bg-background border-b border-border"
      : "bg-transparent";

  const firstName = user?.user_metadata?.full_name?.split(" ")[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${bgColor}`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 py-5 flex items-center justify-between ${textColor} transition-colors duration-500`}
      >
        {/* Sol nav (masaüstü) */}
        <nav className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase">
          <Link href="/cars" className="hover:text-accent transition-colors">
            Araçlar
          </Link>
          <Link
            href="/#categories"
            className="hover:text-accent transition-colors"
          >
            Kategoriler
          </Link>
        </nav>

        {/* Logo (orta) */}
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.2em] uppercase whitespace-nowrap"
        >
          Luxury Motors
        </Link>

        {/* Sağ nav (masaüstü) */}
        <nav className="hidden md:flex gap-6 text-xs tracking-[0.2em] uppercase items-center">
          {user ? (
            <>
              <Link
                href="/account"
                className="hover:text-accent transition-colors"
              >
                {firstName || "Hesabım"}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-accent transition-colors"
            >
              Giriş Yap
            </Link>
          )}
        </nav>

        {/* Mobile menu butonu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Menüyü Aç"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border text-foreground">
          <nav className="px-6 py-6 flex flex-col gap-4 text-xs tracking-[0.2em] uppercase">
            <Link
              href="/cars"
              onClick={() => setMobileOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Araçlar
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileOpen(false)}
              className="hover:text-accent transition-colors"
            >
              Kategoriler
            </Link>

            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-4">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block hover:text-accent transition-colors"
                  >
                    {firstName || "Hesabım"}
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="hover:text-accent transition-colors"
                    >
                      Çıkış
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-accent transition-colors"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}