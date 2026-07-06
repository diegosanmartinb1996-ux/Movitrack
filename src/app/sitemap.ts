import type { MetadataRoute } from "next";
import { getAllVehicles } from "@/lib/catalog";

const BASE_URL = "https://automotrizmovitrack.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/catalogo",
    "/consignacion",
    "/nosotros",
    "/contacto",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const vehicles = await getAllVehicles();
  const vehicleRoutes = vehicles.map((v) => ({
    url: `${BASE_URL}/vehiculos/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
