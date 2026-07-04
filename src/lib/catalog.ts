import "server-only";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { isSanityConfigured } from "@/sanity/env";
import type { Vehicle } from "@/data/vehicles";

const TONE_BY_BODY: Record<string, string> = {
  SUV: "from-neutral-800 via-neutral-900 to-black",
  Sedán: "from-slate-700 via-neutral-900 to-black",
  Camioneta: "from-stone-700 via-neutral-900 to-black",
  Hatchback: "from-zinc-700 via-neutral-900 to-black",
  Van: "from-neutral-700 via-neutral-900 to-black",
};

const VEHICLES_QUERY = `*[_type == "vehiculo" && defined(slug.current)] | order(_createdAt desc){
  _id, _createdAt, brand, model, version, "slug": slug.current, year, price, km,
  fuel, transmission, traction, color, bodyType, status, engine, featureTag, description, images
}`;

type SanityVehicle = {
  _id: string;
  _createdAt: string;
  brand?: string;
  model?: string;
  version?: string;
  slug?: string;
  year?: number;
  price?: number;
  km?: number;
  fuel?: string;
  transmission?: string;
  traction?: string;
  color?: string;
  bodyType?: string;
  status?: string;
  engine?: string;
  featureTag?: string;
  description?: string;
  images?: unknown[];
};

function mapSanityVehicle(doc: SanityVehicle): Vehicle {
  const daysListed = Math.max(
    0,
    Math.floor((Date.now() - new Date(doc._createdAt).getTime()) / 86_400_000)
  );

  const images = Array.isArray(doc.images)
    ? doc.images
        .map((img) => {
          try {
            return urlForImage(img as never)
              .width(1600)
              .fit("max")
              .auto("format")
              .url();
          } catch {
            return null;
          }
        })
        .filter((u): u is string => Boolean(u))
    : [];

  return {
    id: doc._id,
    slug: doc.slug ?? doc._id,
    brand: doc.brand ?? "",
    model: doc.model ?? "",
    version: doc.version ?? "",
    year: doc.year ?? 0,
    price: doc.price ?? 0,
    km: doc.km ?? 0,
    fuel: (doc.fuel as Vehicle["fuel"]) ?? "Bencina",
    transmission: (doc.transmission as Vehicle["transmission"]) ?? "Automática",
    traction: (doc.traction as Vehicle["traction"]) ?? "4x2",
    color: doc.color ?? "",
    bodyType: (doc.bodyType as Vehicle["bodyType"]) ?? "SUV",
    status: (doc.status as Vehicle["status"]) ?? "nuevo-ingreso",
    engine: doc.engine ?? "",
    featureTag: doc.featureTag ?? "",
    tone: TONE_BY_BODY[doc.bodyType ?? ""] ?? "from-neutral-800 via-neutral-900 to-black",
    description: doc.description ?? "",
    views: 0,
    daysListed,
    images,
  };
}

/**
 * Devuelve los vehículos publicados en Sanity. Si Sanity no está configurado
 * o hay un error, devuelve una lista vacía (la página muestra su estado vacío).
 */
export async function getAllVehicles(): Promise<Vehicle[]> {
  if (!isSanityConfigured) return [];
  try {
    const docs = await client.fetch<SanityVehicle[]>(
      VEHICLES_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    return Array.isArray(docs) ? docs.map(mapSanityVehicle) : [];
  } catch {
    return [];
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const all = await getAllVehicles();
  return all.find((v) => v.slug === slug) ?? null;
}

export async function getRelatedVehicles(
  vehicle: Vehicle,
  count = 3
): Promise<Vehicle[]> {
  const all = await getAllVehicles();
  const others = all.filter((v) => v.id !== vehicle.id && v.status !== "vendido");
  const sameKind = others.filter(
    (v) => v.bodyType === vehicle.bodyType || v.brand === vehicle.brand
  );
  const pool = [...sameKind, ...others.filter((v) => !sameKind.includes(v))];
  return pool.slice(0, count);
}
