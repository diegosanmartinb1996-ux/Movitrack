import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Handshake, MapPin, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import MapEmbed from "@/components/ui/MapEmbed";
import ContactCTA from "@/components/service/ContactCTA";
import { CONTACT } from "@/lib/contact";
import { AMBIENT } from "@/lib/images";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "MOVITRACK es una automotora de Curicó especializada en compra, venta y consignación de vehículos en la Región del Maule.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparencia primero",
    description:
      "Documentación clara, evaluación honesta y sin letra chica en cada operación.",
  },
  {
    icon: Handshake,
    title: "Trato directo",
    description:
      "Sin intermediarios innecesarios: hablas directamente con quien evalúa tu vehículo.",
  },
  {
    icon: MapPin,
    title: "Raíces en el Maule",
    description: "Conocemos el mercado local y trabajamos con bancos que operan en la región.",
  },
  {
    icon: Clock,
    title: "Procesos ágiles",
    description: "Evaluaciones rápidas y respuestas concretas, sin trámites eternos.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <div className="relative overflow-hidden border-b border-white/10 bg-ink py-24 md:py-32">
        <Image
          src={AMBIENT.about}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40"
          aria-hidden
        />
        <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
        <Container className="relative">
          <Eyebrow>Nosotros</Eyebrow>
          <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Una automotora de Curicó, para quienes prefieren el trato directo.
          </h1>
          <p className="mt-5 max-w-xl text-white/75">
            Compramos, vendemos y consignamos vehículos en Curicó y la Región del
            Maule. Trabajamos con trato directo y cercano, atendiéndote personalmente
            en cada paso.
          </p>
        </Container>
      </div>

      <section className="border-b border-white/10 bg-ink py-20 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <Icon size={22} className="text-signal" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-ink py-20 md:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Visítanos en Curicó
            </h2>
            <p className="mt-4 max-w-md text-white/75">{CONTACT.address}</p>
            <p className="mt-2 font-data text-sm uppercase tracking-[0.1em] text-white/60">
              {CONTACT.hours}
            </p>
            <p className="mt-1 font-data text-sm uppercase tracking-[0.1em] text-white/60">
              {CONTACT.phoneDisplay}
            </p>
          </div>
          <MapEmbed className="aspect-[4/3]" />
        </Container>
      </section>

      <ContactCTA
        title="Conversemos"
        description="Escríbenos por WhatsApp o llama directo — respondemos de lunes a sábado."
        whatsappMessage="Hola, quiero más información sobre MOVITRACK."
      />
    </>
  );
}
