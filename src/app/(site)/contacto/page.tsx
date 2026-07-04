import type { Metadata } from "next";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import MapEmbed from "@/components/ui/MapEmbed";
import { InstagramGlyph } from "@/components/ui/icons";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Visita MOVITRACK en Membrillar 386, Curicó. Escríbenos por WhatsApp o llama directamente para coordinar una visita.",
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT.whatsappDisplay,
    href: whatsappLink(),
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneNumber}`,
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: CONTACT.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`,
  },
  {
    icon: Clock,
    label: "Horario",
    value: CONTACT.hours,
    href: null,
  },
];

export default function ContactoPage() {
  return (
    <div className="bg-ink py-20 md:py-24">
      <Container>
        <Eyebrow>Contacto</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Conversemos en persona, no con un formulario.
        </h1>
        <p className="mt-5 max-w-lg text-white/55">
          Escríbenos por WhatsApp o llámanos para coordinar una visita a nuestro
          local en Curicó. Te atendemos personalmente.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <Icon size={20} className="text-signal" />
                  <p className="mt-4 font-data text-[11px] uppercase tracking-[0.16em] text-white/40">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-white">{value}</p>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block border border-white/10 p-6 transition-colors hover:border-signal"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="border border-white/10 p-6">
                  {content}
                </div>
              );
            })}

            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-white/10 p-6 transition-colors hover:border-signal sm:col-span-2"
            >
              <InstagramGlyph size={20} className="text-signal" />
              <p className="mt-4 font-data text-[11px] uppercase tracking-[0.16em] text-white/40">
                Instagram
              </p>
              <p className="mt-1 text-sm text-white">@automotriz_movitrack</p>
            </a>
          </div>

          <MapEmbed className="aspect-[4/3] lg:aspect-auto lg:h-full" />
        </div>
      </Container>
    </div>
  );
}
