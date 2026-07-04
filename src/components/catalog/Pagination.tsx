"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const goTo = (p: number) => {
    onChange(p);
    scrollToTop();
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-16 flex items-center justify-center gap-2 border-t border-white/10 pt-10">
      <button
        onClick={() => goTo(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-signal hover:text-signal disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/70"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center font-data text-xs transition-colors",
            p === page ? "bg-signal text-white" : "text-white/60 hover:text-white"
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-signal hover:text-signal disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/70"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
