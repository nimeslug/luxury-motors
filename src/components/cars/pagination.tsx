"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  if (totalPages <= 1) return null;

  // Sayfa numaralarını oluştur (üç noktayla kısaltma destekli)
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  const arrowClass = "p-2 transition-colors";

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-16"
      aria-label="Sayfalama"
    >
      {/* Önceki */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className={`${arrowClass} hover:text-accent`}
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      ) : (
        <span className={`${arrowClass} opacity-30 cursor-not-allowed`}>
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </span>
      )}

      {/* Sayfa numaraları */}
      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-3 text-muted">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
              page === currentPage
                ? "bg-foreground text-background"
                : "hover:text-accent"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Sonraki */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className={`${arrowClass} hover:text-accent`}
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      ) : (
        <span className={`${arrowClass} opacity-30 cursor-not-allowed`}>
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </span>
      )}
    </nav>
  );
}