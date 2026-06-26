"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Mail,
  Tag,
  Folder,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Araçlar", icon: Car },
  { href: "/admin/inquiries", label: "Sorgular", icon: Mail },
  { href: "/admin/brands", label: "Markalar", icon: Tag },
  { href: "/admin/categories", label: "Kategoriler", icon: Folder },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-foreground text-background flex flex-col">
      <div className="p-6 border-b border-background/10">
        <Link
          href="/admin"
          className="font-serif text-lg tracking-[0.2em] uppercase"
        >
          Luxury Motors
        </Link>
        <p className="text-xs tracking-[0.2em] text-accent mt-1 uppercase">
          Admin
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-xs tracking-[0.2em] uppercase transition-colors ${
                active
                  ? "bg-background/10 text-accent"
                  : "hover:bg-background/5"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-background/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-xs tracking-[0.2em] uppercase hover:bg-background/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
          Siteyi Görüntüle
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.2em] uppercase hover:bg-background/5 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Çıkış
          </button>
        </form>
        <div className="pt-4 px-4">
          <p className="text-xs text-background/60 truncate">{userName}</p>
        </div>
      </div>
    </aside>
  );
}
