"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone, MapPin, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { AMBIENT } from "@/lib/images";
import { CONTACT, whatsappLink } from "@/lib/contact";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CTASection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden border-t border-white/10 bg-ink">
      {/* Imagen de fondo integrada */}
      <Image
        src={AMBIENT.homeCta}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[60%_center] opacity-90"
      />
      {/* Degradados para legibilidad e integración con el negro */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />
      <div
        className="absolute -left-40 top-1/2 h-[55vh] w-[55vh] -translate-y-1/2 rounded-full bg-signal/12 blur-[160px]"
        aria-hidden
      />

      <Container className="relative py-28 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.3em] text-signal">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Vende o consigna con nosotros
          </div>

          <h2 className="mt-7 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Hablemos
            <br />
            de tu <span className="text-signal">auto.</span>
          </h2>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-white/80">
            Escríbenos y acércate con tu auto a nuestro local. Lo evaluamos en el
            momento y lo consignamos para venderlo por ti.
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
              className="inline-flex items-center justify-center gap-2 border border-white/30 bg-ink/40 px-7 py-4 font-data text-base uppercase tracking-[0.1em] text-white backdrop-blur-sm transition-colors hover:border-signal hover:text-signal"
            >
              <Phone size={18} />
              {CONTACT.phoneDisplay}
            </a>
          </div>

          <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-6">
            <span className="flex items-center gap-2 font-data text-sm uppercase tracking-[0.08em] text-white">
              <MapPin size={17} className="text-signal" />
              {CONTACT.address}
            </span>
            <span className="font-data text-[11px] uppercase tracking-[0.14em] text-white/60">
              {CONTACT.hours}
            </span>
          </div>

          <Link
            href="/consignacion"
            className="group mt-7 inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
          >
            Cómo funciona la consignación
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
