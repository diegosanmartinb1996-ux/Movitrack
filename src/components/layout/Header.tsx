"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { WhatsAppGlyph } from "@/components/ui/icons";
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
            className="h-10 w-auto md:h-12 xl:h-[54px]"
          />
          <span className="font-display text-2xl font-semibold tracking-[0.02em] md:text-[28px] xl:text-[31px]">
            MOVITRACK
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-display text-[14px] font-semibold uppercase tracking-[0.08em] text-white/85 transition-colors hover:text-white xl:text-[15px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-2.5 border border-white/35 py-2.5 pl-3.5 pr-4 font-display text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/70 hover:bg-white/5 lg:flex"
        >
          <WhatsAppGlyph size={18} className="text-[#25D366]" />
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
                className="border-b border-white/5 py-3 font-display text-base font-semibold uppercase tracking-[0.08em] text-white/85"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2.5 border border-white/35 px-4 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.08em] text-white"
            >
              <WhatsAppGlyph size={20} className="text-[#25D366]" />
              Escribir por WhatsApp
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
