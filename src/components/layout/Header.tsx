"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import { whatsappLink } from "@/lib/contact";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/consignacion", label: "Consignación" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="relative z-10 flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/logo-mark.png"
            alt="MOVITRACK"
            width={110}
            height={120}
            priority
            className="h-10 w-auto"
          />
          <span className="font-display text-xl font-semibold tracking-[0.02em] md:text-2xl">
            MOVITRACK
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-data text-[10.5px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white xl:text-[11px] xl:tracking-[0.18em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-2 bg-signal px-4 py-2.5 font-data text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-signal-glow lg:flex"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>

        <button
          className="relative z-10 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-ink lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 font-data text-xs uppercase tracking-[0.18em] text-white/70"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 bg-signal px-4 py-3.5 font-data text-xs uppercase tracking-[0.14em] text-white"
            >
              <MessageCircle size={16} />
              Escribir por WhatsApp
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
