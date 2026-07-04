"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import VehicleCard from "@/components/vehicles/VehicleCard";
import type { Vehicle } from "@/data/vehicles";

export default function ShowroomReveal({ vehicles }: { vehicles: Vehicle[] }) {
  const showcase = vehicles.filter((v) => v.status !== "vendido").slice(0, 6);

  if (showcase.length === 0) return null;

  return (
    <section className="relative border-t border-white/10 bg-ink-soft py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Catálogo</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Últimos ingresos
            </h2>
          </div>
          <Button href="/catalogo" variant="outline" className="shrink-0">
            Ver todo el catálogo
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {showcase.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <VehicleCard vehicle={vehicle} index={`0${i + 1}`} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
