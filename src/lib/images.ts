/**
 * Imágenes de ambiente (Unsplash) usadas como fondo en secciones no-catálogo.
 * NOTA: estas son fotografías de stock temporales — reemplazar por material
 * propio de MOVITRACK cuando esté disponible.
 */
const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const AMBIENT = {
  homeHero: U("photo-1503376780353-7e6692767b70"), // deportivo negro, contraluz
  process: U("photo-1517524008697-84bbe3c3fd98"), // taller / detalle mecánico
  about: U("photo-1552519507-da3b142c6e3d"), // auto premium en estudio
  consignacion: U("photo-1494976388531-d1058494cdd8"), // vista trasera en carretera
  compra: U("photo-1492144534655-ae79c964c9d7"), // frontal, tono oscuro
  financiamiento: U("photo-1583121274602-3e2820c69888"), // interior / volante
  contacto: U("photo-1533473359331-0135ef1b58bf"), // fila de autos showroom
} as const;
