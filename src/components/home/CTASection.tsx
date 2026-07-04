"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/contact";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-28">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
      <div
        className="absolute left-1/2 top-0 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-signal/10 blur-[160px]"
        aria-hidden
      />
      <Container className="relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-data text-[11px] uppercase tracking-[0.3em] text-white/40">
            ¿Tienes un vehículo para vender?
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Hablemos de tu auto.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-white/55">
            Escríbenos y coordinamos una visita. Lo evaluamos y te damos una oferta
            directa, o lo consignamos para venderlo por ti.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={whatsappLink("Hola, quiero conversar sobre mi vehículo.")} size="lg">
              Escríbenos por WhatsApp
            </Button>
            <Button href="/consignacion" variant="outline" size="lg">
              Consignar mi vehículo
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
