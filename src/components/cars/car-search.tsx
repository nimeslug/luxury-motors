"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function CarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") || "");

  // Debounce: 500ms yazma durunca URL'i güncelle
  useEffect(() => {
  const timer = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");  // ← bu satır eklendi
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  return () => clearTimeout(timer);
}, [value]);

  return (
    <div className="relative max-w-md">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none"
        strokeWidth={1.5}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Model ara..."
        className="w-full pl-12 pr-4 py-3 bg-background/10 border border-background/20 text-background placeholder:text-background/50 text-sm focus:outline-none focus:border-background transition-colors"
      />
    </div>
  );
}