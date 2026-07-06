import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, MessageCircle, CalendarCheck, Gauge, Fuel, Cog, Calendar } from "lucide-react";
import Container from "@/components/ui/Container";
import StatusTag from "@/components/ui/StatusTag";
import Button from "@/components/ui/Button";
import VehicleGallery from "@/components/vehicles/VehicleGallery";
import VehicleCard from "@/components/vehicles/VehicleCard";
import JsonLd from "@/components/seo/JsonLd";
import type { Vehicle } from "@/data/vehicles";
import { getAllVehicles, getVehicleBySlug, getRelatedVehicles } from "@/lib/catalog";
import { formatCLP, formatKm } from "@/lib/utils";
import { whatsappLink, CONTACT } from "@/lib/contact";

const BASE_URL = "https://automotrizmovitrack.cl";

export const revalidate = 60;

export async function generateStaticParams() {
  const vehicles = await getAllVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`;
  const description = `${title} · ${formatKm(vehicle.km)} · ${vehicle.transmission} · ${formatCLP(vehicle.price)}. ${vehicle.description}`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

const SPECS = (v: Vehicle) => [
  { icon: Calendar, label: "Año", value: String(v.year) },
  { icon: Gauge, label: "Kilometraje", value: formatKm(v.km) },
  { icon: Cog, label: "Transmisión", value: v.transmission },
  { icon: Fuel, label: "Combustible", value: v.fuel },
];

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const related = await getRelatedVehicles(vehicle, 3);
  const message = `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year} que vi en el sitio.`;

  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.km,
      unitCode: "KMT",
    },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    color: vehicle.color,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "CLP",
      availability:
        vehicle.status === "vendido"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: `${BASE_URL}/vehiculos/${vehicle.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Catálogo", item: `${BASE_URL}/catalogo` },
      { "@type": "ListItem", position: 2, name: vehicle.brand, item: `${BASE_URL}/catalogo` },
      {
        "@type": "ListItem",
        position: 3,
        name: vehicle.model,
        item: `${BASE_URL}/vehiculos/${vehicle.slug}`,
      },
    ],
  };

  return (
    <div className="bg-ink py-10 md:py-14">
      <JsonLd data={vehicleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Container>
        <nav className="flex flex-wrap items-center gap-2 font-data text-[11px] uppercase tracking-[0.14em] text-white/60">
          <Link href="/catalogo" className="hover:text-white">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-white/80">{vehicle.brand}</span>
          <span>/</span>
          <span className="text-white">{vehicle.model}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <VehicleGallery vehicle={vehicle} />
          </div>

          <div className="lg:pt-2">
            <StatusTag status={vehicle.status} />
            <p className="mt-4 font-data text-xs uppercase tracking-[0.16em] text-white/60">
              {vehicle.brand}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {vehicle.model} <span className="text-white/70">{vehicle.version}</span>
            </h1>
            <p className="mt-4 font-display text-3xl font-semibold text-signal">
              {formatCLP(vehicle.price)}
            </p>

            <p className="mt-6 text-sm leading-relaxed text-white/80">{vehicle.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6">
              {SPECS(vehicle).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-signal" />
                  <div>
                    <p className="font-data text-[10px] uppercase tracking-[0.14em] text-white/60">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 font-data text-xs uppercase tracking-[0.14em] text-white/60">
              {vehicle.engine} · {vehicle.color} · {vehicle.traction}
            </p>

            {vehicle.status === "vendido" ? (
              <p className="mt-8 border border-white/15 px-4 py-3 text-sm text-white/70">
                Este vehículo ya fue vendido. Explora otras unidades similares en el catálogo.
              </p>
            ) : (
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 font-data text-xs uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={16} />
                  Consultar por WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${CONTACT.phoneNumber}`}
                    className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3.5 font-data text-xs uppercase tracking-[0.14em] text-white/80 hover:border-white"
                  >
                    <Phone size={15} />
                    Llamar
                  </a>
                  <Button href="/contacto" variant="outline" size="sm" icon={<CalendarCheck size={15} />}>
                    Agendar visita
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 border-t border-white/10 pt-14">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Vehículos similares
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={String(i + 1).padStart(2, "0")} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
