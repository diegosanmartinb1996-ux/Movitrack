import type { SanityClient } from "sanity";
import { urlForImage } from "@/sanity/lib/image";
import { FOR_SALE_STATUSES } from "@/sanity/vehicleOptions";

export type SanityImage = {
  _type: "image";
  _key: string;
  asset?: { _type: "reference"; _ref: string };
  hotspot?: unknown;
  crop?: unknown;
};

export type PanelVehicle = {
  /** Id publicado (sin prefijo drafts.) */
  id: string;
  /** Solo existe como borrador: todavía no se ve en el sitio. */
  onlyDraft: boolean;
  /** Tiene cambios sin publicar hechos desde la vista avanzada. */
  hasDraft: boolean;
  createdAt: string;
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
  images: SanityImage[];
};

export type Group = "venta" | "reservado" | "vendido";

export const VEHICLES_QUERY = `*[_type == "vehiculo"] | order(_createdAt desc){
  _id, _createdAt, brand, model, version, "slug": slug.current, year, price, km,
  fuel, transmission, traction, color, bodyType, status, engine, featureTag,
  description, images
}`;

type RawVehicle = Omit<PanelVehicle, "id" | "onlyDraft" | "hasDraft" | "createdAt" | "images"> & {
  _id: string;
  _createdAt: string;
  images?: SanityImage[];
};

/** Une borradores y publicados en una sola lista, priorizando lo publicado. */
export function mergeVehicles(docs: RawVehicle[]): PanelVehicle[] {
  const byId = new Map<string, { pub?: RawVehicle; draft?: RawVehicle }>();
  for (const doc of docs) {
    const isDraft = doc._id.startsWith("drafts.");
    const id = isDraft ? doc._id.slice(7) : doc._id;
    const entry = byId.get(id) ?? {};
    if (isDraft) entry.draft = doc;
    else entry.pub = doc;
    byId.set(id, entry);
  }
  const out: PanelVehicle[] = [];
  for (const [id, { pub, draft }] of byId) {
    const src = (pub ?? draft)!;
    const { _id: _ignored, _createdAt, images, ...fields } = src;
    void _ignored;
    out.push({
      ...fields,
      id,
      onlyDraft: !pub,
      hasDraft: Boolean(pub && draft),
      createdAt: _createdAt,
      images: Array.isArray(images) ? images.filter((i) => i?.asset?._ref) : [],
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function groupOf(v: Pick<PanelVehicle, "status">): Group {
  if (v.status === "vendido") return "vendido";
  if (v.status === "reservado") return "reservado";
  return "venta";
}

export function isForSale(status?: string) {
  return FOR_SALE_STATUSES.includes(status as never);
}

export function imageUrl(img: SanityImage, width: number, height: number) {
  try {
    return urlForImage(img as never)
      .width(width)
      .height(height)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

export function vehicleName(v: Pick<PanelVehicle, "brand" | "model">) {
  return [v.brand?.trim(), v.model?.trim()].filter(Boolean).join(" ") || "Auto sin nombre";
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/** Genera una URL que no choque con otro auto. */
export async function uniqueSlug(client: SanityClient, base: string, id: string) {
  const root = base || "auto";
  let candidate = root;
  for (let n = 2; n < 50; n++) {
    const taken = await client.fetch<number>(
      `count(*[_type == "vehiculo" && slug.current == $slug && !(_id in [$id, $draftId])])`,
      { slug: candidate, id, draftId: `drafts.${id}` }
    );
    if (!taken) return candidate;
    candidate = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

export function newKey() {
  return Math.random().toString(36).slice(2, 12);
}
