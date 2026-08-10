/**
 * Loader de imágenes personalizado.
 *
 * Las fotos de los vehículos viven en el CDN de Sanity, que ya sabe redimensionar
 * y convertir a WebP/AVIF con parámetros en la URL. Pidiéndoselas directamente a
 * Sanity evitamos que Netlify vuelva a procesar cada foto (eso consume compute e
 * image transformations de la cuenta). El resto de las imágenes se devuelven tal
 * cual y se sirven como archivos estáticos desde el CDN.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes("cdn.sanity.io")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
