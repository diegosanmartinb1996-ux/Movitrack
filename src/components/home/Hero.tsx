"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AMBIENT } from "@/lib/images";
import { formatKm } from "@/lib/utils";
import type { Vehicle } from "@/data/vehicles";

const ROTATING = ["auto", "SUV", "sedán", "camioneta", "4x4"];

const TICKER_ITEMS = [
  "COMPRA",
  "VENTA",
  "CONSIGNACIÓN",
  "RECEPCIÓN EN PARTE DE PAGO",
  "CURICÓ · REGIÓN DEL MAULE",
];

const ease = [0.16, 1, 0.3, 1] as const;

const lineWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const line = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.12, duration: 0.7, ease },
  }),
};

export default function Hero({ featured }: { featured: Vehicle | null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex min-h-[94vh] flex-col justify-between overflow-hidden bg-ink">
      {/* Imagen con entrada cinematográfica (push-in) */}
      <motion.div
        initial={{ scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
        className="absolute inset-0"
      >
        <Image
          src={AMBIENT.homeHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right opacity-70"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" aria-hidden />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-ink to-transparent" aria-hidden />
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute -top-1/4 right-0 h-[80vh] w-[80vh] rounded-full bg-signal/10 blur-[160px]"
        aria-hidden
      />
      <div className="mask-fade-b absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      {/* Etiqueta vertical editorial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 items-center gap-3 font-data text-[10px] uppercase tracking-[0.4em] text-white/40 xl:flex"
      >
        <span className="h-px w-10 bg-white/30" />
        Showroom digital
      </motion.div>

      <Container className="relative flex flex-1 flex-col justify-center pt-28 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.32em] text-white/65"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          Automotora en Curicó, Región del Maule
        </motion.div>

        {/* Titular con revelado por máscara + palabra rotativa */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={lineWrap}
          className="mt-7 font-display font-semibold leading-[0.9] tracking-tight"
        >
          <span className="block overflow-hidden">
            <motion.span
              variants={line}
              className="block text-3xl text-white/90 md:text-4xl lg:text-5xl"
            >
              Encuentra tu próximo
            </motion.span>
          </span>
          <span className="mt-1 block overflow-hidden pb-[0.12em]">
            <motion.span variants={line} className="block">
              <span className="inline-flex items-baseline text-[16vw] leading-none md:text-[10vw] lg:text-[8.5rem]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING[index]}
                    initial={{ y: "0.4em", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-0.4em", opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease }}
                    className="inline-block text-signal"
                  >
                    {ROTATING[index]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-signal">.</span>
              </span>
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/80"
        >
          Compra, venta y consignación de vehículos seleccionados en Curicó.
          Explora nuestro catálogo y coordina tu visita.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={2}
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

      {/* Chip del último vehículo real */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
          className="absolute bottom-28 right-6 z-10 hidden md:right-12 lg:block"
        >
          <Link
            href={`/vehiculos/${featured.slug}`}
            className="group flex w-72 items-center gap-4 border border-white/15 bg-ink/70 p-3 backdrop-blur-md transition-colors hover:border-signal/60"
          >
            <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-ink-soft">
              {featured.images && featured.images[0] ? (
                <Image
                  src={featured.images[0]}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${featured.tone}`} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-data text-[9px] uppercase tracking-[0.2em] text-signal">
                Último ingreso
              </p>
              <p className="mt-1 truncate font-display text-sm font-semibold">
                {featured.brand} {featured.model}
              </p>
              <p className="mt-0.5 font-data text-[10px] uppercase tracking-[0.1em] text-white/60">
                {featured.year} · {formatKm(featured.km)}
              </p>
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-white/40 transition-colors group-hover:text-signal"
            />
          </Link>
        </motion.div>
      )}

      {/* Ticker */}
      <div className="relative border-t border-white/10 bg-ink/40 backdrop-blur-sm">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 py-4 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-10 font-data text-xs uppercase tracking-[0.2em] text-white/55"
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
        transition={{ delay: 1.4, duration: 0.6 }}
        className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 md:flex"
      >
        <span className="font-data text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
