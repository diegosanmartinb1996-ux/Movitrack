import { defineField, defineType } from "sanity";

export const vehiculo = defineType({
  name: "vehiculo",
  title: "Vehículo",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Marca",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "model",
      title: "Modelo",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "version",
      title: "Versión",
      type: "string",
      description: "Ej: 4MATIC Sport, Limited, XLT 4x4",
    }),
    defineField({
      name: "slug",
      title: "URL (se genera sola)",
      type: "slug",
      options: {
        source: (doc) =>
          `${doc.brand ?? ""} ${doc.model ?? ""} ${doc.version ?? ""} ${doc.year ?? ""}`.trim(),
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "number",
      validation: (r) => r.required().min(1980).max(2100),
    }),
    defineField({
      name: "price",
      title: "Precio (CLP)",
      type: "number",
      description: "Solo el número, sin puntos ni símbolos. Ej: 24990000",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "km",
      title: "Kilometraje",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "fuel",
      title: "Combustible",
      type: "string",
      options: {
        list: ["Bencina", "Diésel", "Híbrido", "Eléctrico"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "transmission",
      title: "Transmisión",
      type: "string",
      options: { list: ["Automática", "Manual"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "traction",
      title: "Tracción",
      type: "string",
      options: { list: ["4x2", "4x4", "AWD"] },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
    }),
    defineField({
      name: "bodyType",
      title: "Tipo de vehículo",
      type: "string",
      options: {
        list: ["SUV", "Sedán", "Camioneta", "Hatchback", "Van"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Estado / Etiqueta",
      type: "string",
      options: {
        list: [
          { title: "Destacado", value: "destacado" },
          { title: "Nuevo ingreso", value: "nuevo-ingreso" },
          { title: "Oportunidad", value: "oportunidad" },
          { title: "Reservado", value: "reservado" },
          { title: "Vendido", value: "vendido" },
        ],
      },
      initialValue: "nuevo-ingreso",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "engine",
      title: "Motor",
      type: "string",
      description: "Ej: 2.0L Turbo, 211 hp",
    }),
    defineField({
      name: "featureTag",
      title: "Frase destacada",
      type: "string",
      description: "Una frase corta, ej: Único dueño, Bajo kilometraje",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "images",
      title: "Fotos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      description: "La primera foto es la principal. Arrastra para ordenar.",
    }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "recientes",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Precio (menor a mayor)",
      name: "precioAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      brand: "brand",
      model: "model",
      year: "year",
      status: "status",
      media: "images.0",
    },
    prepare({ brand, model, year, status, media }) {
      return {
        title: `${brand ?? ""} ${model ?? ""}`.trim(),
        subtitle: [year, status].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
