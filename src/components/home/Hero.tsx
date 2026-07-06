"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AMBIENT } from "@/lib/images";
import { CONTACT } from "@/lib/contact";

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

export default function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  // Posición normalizada del cursor (0..1) dentro del hero.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // Inclinación 3D de la escena y parallax de las capas, suavizado con springs.
  const sx = useSpring(px, { stiffness: 55, damping: 20 });
  const sy = useSpring(py, { stiffness: 55, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [7, -7]);
  const rotateX = useTransform(sy, [0, 1], [-4, 4]);
  const imgX = useTransform(sx, [0, 1], [24, -24]);
  const imgY = useTransform(sy, [0, 1], [14, -14]);
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(36vw 36vw at ${glowX} ${glowY}, rgba(225,6,0,0.18), rgba(225,6,0,0.04) 45%, transparent 70%)`;

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, []);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <section
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex min-h-[94vh] flex-col justify-between overflow-hidden bg-ink [perspective:1400px]"
    >
      {/* Escena inclinable: la foto del auto con parallax */}
      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className="absolute inset-0 [transform-style:preserve-3d]"
      >
        <motion.div
          style={reduceMotion ? undefined : { x: imgX, y: imgY }}
          className="absolute -inset-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.03 }}
            transition={{
              opacity: { duration: 1.4, ease },
              scale: { duration: 8, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={AMBIENT.homeHero}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Foco de luz que sigue el cursor */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: spotlight }}
        />
      )}

      {/* Degradados: oscuros a la izquierda para el texto, claros a la derecha
          para que el auto se vea nítido (menos apagado que antes) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/15"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-ink to-transparent"
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
      <div
        className="absolute -top-1/4 right-0 h-[80vh] w-[80vh] rounded-full bg-signal/10 blur-[160px]"
        aria-hidden
      />
      <div
        className="mask-fade-b absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />

      {/* Etiqueta vertical editorial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 items-center gap-3 font-data text-[10px] uppercase tracking-[0.4em] text-white/40 xl:flex"
      >
        <span className="h-px w-10 bg-white/30" />
        Curicó · Maule
      </motion.div>

      <Container className="relative flex flex-1 flex-col justify-center pt-28 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.32em] text-white/70"
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
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/85"
        >
          Compra, venta y consignación de vehículos seleccionados en Curicó.
          Con 16 años en el mercado, explora nuestro catálogo y coordina tu
          visita.
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

      {/* Ticker */}
      <div className="relative flex items-stretch border-t border-white/10 bg-ink/40 backdrop-blur-sm">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/10 px-3 py-4 font-data text-[9px] uppercase tracking-[0.1em] text-white/70 sm:px-6 sm:text-[11px] sm:tracking-[0.14em]">
          <MapPin size={14} className="shrink-0 text-signal" />
          <span className="max-w-[38vw] truncate sm:max-w-none sm:whitespace-nowrap">
            {CONTACT.address}
          </span>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 py-4 pl-8 whitespace-nowrap">
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
