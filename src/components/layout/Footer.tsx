import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { CONTACT } from "@/lib/contact";
import { InstagramGlyph } from "@/components/ui/icons";

const COLUMNS = [
  {
    title: "Catálogo",
    links: [
      { href: "/catalogo", label: "Catálogo completo" },
      { href: "/catalogo?orden=destacados", label: "Vehículos destacados" },
      { href: "/catalogo?orden=recientes", label: "Nuevos ingresos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/consignacion", label: "Consigna tu vehículo" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt="MOVITRACK"
              width={110}
              height={120}
              className="h-10 w-auto"
            />
            <span className="font-display text-xl font-semibold tracking-[0.02em]">
              MOVITRACK
            </span>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
            Automotora especializada en compra, venta y consignación de vehículos
            en Curicó, Región del Maule.
          </p>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.16em] text-white/70 hover:text-signal"
          >
            <InstagramGlyph />
            @automotriz_movitrack
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-data text-[11px] uppercase tracking-[0.2em] text-signal">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} MOVITRACK — {CONTACT.address}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-data uppercase tracking-[0.12em]">
            <span>{CONTACT.phoneDisplay}</span>
            <span>{CONTACT.hours}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
