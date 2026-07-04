import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import { CONTACT } from "@/lib/contact";
import "./globals.css";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "MOVITRACK",
  image: "https://www.movitrack.cl/logo-movitrack.svg",
  url: "https://www.movitrack.cl",
  telephone: CONTACT.phoneNumber,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Membrillar 386",
    addressLocality: "Curicó",
    addressRegion: "Región del Maule",
    addressCountry: "CL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:30",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:30",
      closes: "14:00",
    },
  ],
  sameAs: [CONTACT.instagram],
};

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.movitrack.cl"),
  title: {
    default: "MOVITRACK — Automotora en Curicó",
    template: "%s · MOVITRACK",
  },
  description:
    "MOVITRACK: compra, venta y consignación de vehículos en Curicó, Región del Maule.",
  keywords: [
    "automotora Curicó",
    "comprar auto usado Curicó",
    "vender auto Maule",
    "consignar vehículo",
    "autos usados Región del Maule",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "MOVITRACK",
    title: "MOVITRACK — Automotora en Curicó",
    description:
      "Compra, venta y consignación de vehículos en Curicó. Explora el catálogo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${jetbrainsMono.variable} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
        />
        <JsonLd data={ORGANIZATION_SCHEMA} />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
