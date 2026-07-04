"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AMBIENT } from "@/lib/images";

const TICKER_ITEMS = [
  "COMPRA",
  "VENTA",
  "CONSIGNACIÓN",
  "FINANCIAMIENTO",
  "CURICÓ · REGIÓN DEL MAULE",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-between overflow-hidden bg-ink">
      <Image
        src={AMBIENT.homeHero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right opacity-70"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink to-transparent"
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute -top-1/3 right-0 h-[80vh] w-[80vh] rounded-full bg-signal/10 blur-[160px]"
        aria-hidden
      />
      <div className="mask-fade-b absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      <Container className="relative flex flex-1 flex-col justify-center pt-28 pb-20">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.32em] text-white/45"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          Automotora en Curicó, Región del Maule
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="mt-8 max-w-5xl font-display text-[13vw] font-semibold leading-[0.92] tracking-tight text-balance md:text-[7.2vw] lg:text-[6.4rem]"
        >
          Encuentra tu
          <br />
          <span className="text-signal">próximo auto.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/60"
        >
          Compra, venta, consignación y financiamiento de vehículos seleccionados.
          Explora nuestro catálogo y coordina tu visita.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="/catalogo" size="lg">
            Ver catálogo
          </Button>
          <Button href="/consignacion" variant="outline" size="lg">
            Vender mi vehículo
          </Button>
        </motion.div>
      </Container>

      <div className="relative border-t border-white/10">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 py-4 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-10 font-data text-xs uppercase tracking-[0.2em] text-white/35"
              >
                {item}
                <span className="text-signal">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/30 md:flex"
      >
        <span className="font-data text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
