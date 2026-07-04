import Hero from "@/components/home/Hero";
import ShowroomReveal from "@/components/home/ShowroomReveal";
import CTASection from "@/components/home/CTASection";
import { getAllVehicles } from "@/lib/catalog";

export const revalidate = 60;

export default async function HomePage() {
  const vehicles = await getAllVehicles();
  const featured =
    vehicles.find((v) => v.status !== "vendido") ?? vehicles[0] ?? null;
  return (
    <>
      <Hero featured={featured} />
      <ShowroomReveal vehicles={vehicles} />
      <CTASection />
    </>
  );
}
