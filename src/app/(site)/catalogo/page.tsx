import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import CatalogClient from "@/components/catalog/CatalogClient";
import { getAllVehicles } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo de vehículos",
  description:
    "Explora el catálogo de vehículos de MOVITRACK en Curicó. Filtra por marca, tipo, año, precio, transmisión y combustible.",
};

export const revalidate = 60;

export default async function CatalogoPage() {
  const vehicles = await getAllVehicles();
  return (
    <div className="bg-ink py-16 md:py-20">
      <Container>
        <Eyebrow>Catálogo</Eyebrow>
        <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Nuestros vehículos
        </h1>
        <p className="mt-4 max-w-xl text-white/55">
          Filtra por lo que necesitas y coordina una visita cuando encuentres el
          tuyo.
        </p>

        <div className="mt-14">
          <CatalogClient vehicles={vehicles} />
        </div>
      </Container>
    </div>
  );
}
