import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel de administración no debe aparecer en buscadores.
      disallow: "/studio",
    },
    sitemap: "https://automotrizmovitrack.cl/sitemap.xml",
  };
}
