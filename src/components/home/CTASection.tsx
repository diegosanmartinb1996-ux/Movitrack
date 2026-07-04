"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { AMBIENT } from "@/lib/images";
import { CONTACT, whatsappLink } from "@/lib/contact";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
      <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />
      <div
        className="absolute -left-40 top-1/2 h-[55vh] w-[55vh] -translate-y-1/2 rounded-full bg-signal/12 blur-[160px]"
        aria-hidden
      />

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Statement + acciones */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.3em] text-signal">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Vende o consigna con nosotros
          </div>

          <h2 className="mt-7 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl lg:text-[5rem]">
            Hablemos
            <br />
            de tu <span className="text-signal">auto.</span>
          </h2>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-white/75">
            Escríbenos y coordinamos una visita. Lo evaluamos y te damos una oferta
            directa, o lo consignamos para venderlo por ti.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={whatsappLink("Hola, quiero conversar sobre mi vehículo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] px-7 py-4 font-data text-xs uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={16} />
              Escríbenos por WhatsApp
            </a>
            <a
              href={`tel:${CONTACT.phoneNumber}`}
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 font-data text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-signal hover:text-signal"
            >
              <Phone size={15} />
              {CONTACT.phoneDisplay}
            </a>
          </div>

          <Link
            href="/consignacion"
            className="group mt-7 inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
          >
            Cómo funciona la consignación
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* Imagen enmarcada con dato local */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="bracket-frame relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]"
        >
          <Image
            src={AMBIENT.consignacion}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-7">
            <p className="font-data text-[10px] uppercase tracking-[0.24em] text-white/60">
              Visítanos
            </p>
            <p className="mt-1.5 font-display text-lg font-semibold leading-snug md:text-xl">
              {CONTACT.address}
            </p>
            <p className="mt-1 font-data text-[11px] uppercase tracking-[0.14em] text-white/60">
              {CONTACT.hours}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
