import type { Metadata } from "next";
import PageHero from "@/components/service/PageHero";
import ProcessSteps from "@/components/service/ProcessSteps";
import FAQAccordion from "@/components/service/FAQAccordion";
import ContactCTA from "@/components/service/ContactCTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo";
import { AMBIENT } from "@/lib/images";

export const metadata: Metadata = {
  title: "Consignación de vehículos",
  description:
    "Consigna tu vehículo en MOVITRACK: nosotros lo exhibimos, lo promocionamos y gestionamos la venta. Evaluación siempre en persona.",
};

const STEPS = [
  {
    title: "Evaluación en persona",
    description:
      "Agenda una visita y revisamos tu vehículo cara a cara: estado, documentación y expectativa de precio.",
  },
  {
    title: "Acuerdo de consignación",
    description:
      "Definimos juntos el precio de publicación y las condiciones del acuerdo, por escrito y sin letra chica.",
  },
  {
    title: "Exhibición y promoción",
    description:
      "Tu vehículo entra al showroom digital y físico de MOVITRACK, con fotografía y ficha completa.",
  },
  {
    title: "Venta y liquidación",
    description:
      "Gestionamos la negociación y el papeleo. Al concretarse la venta, se liquida según lo acordado.",
  },
];

const FAQS = [
  {
    question: "¿Qué diferencia hay entre consignar y vender directamente a MOVITRACK?",
    answer:
      "Al consignar, tú sigues siendo el dueño hasta que el vehículo se vende — nosotros lo exhibimos y gestionamos la venta a cambio de una comisión. Al vender directamente, te pagamos de inmediato y el vehículo pasa a ser nuestro.",
  },
  {
    question: "¿Cuánto tiempo toma vender un vehículo consignado?",
    answer:
      "Depende de la marca, modelo, precio y estado del mercado. En la evaluación en persona te damos una estimación realista según vehículos similares que hemos vendido.",
  },
  {
    question: "¿Necesito dejar el vehículo en MOVITRACK?",
    answer:
      "Sí, el vehículo se exhibe en nuestro showroom físico en Curicó para que los interesados puedan verlo y probarlo con respaldo de nuestro equipo.",
  },
  {
    question: "¿Qué documentación necesito para consignar?",
    answer:
      "Padrón, permiso de circulación al día, revisión técnica y verificación de gases vigentes, y certificado de anotaciones vigentes. Lo revisamos en detalle en la evaluación presencial.",
  },
];

export default function ConsignacionPage() {
  return (
    <>
      <JsonLd data={buildFaqSchema(FAQS)} />
      <PageHero
        eyebrow="Servicios · Consignación"
        title="Nosotros exhibimos y vendemos. Tú decides el precio."
        description="Consigna tu vehículo en MOVITRACK y déjanos gestionar la venta por ti, con la exhibición y el respaldo de nuestro local en Curicó."
        image={AMBIENT.consignacion}
      />
      <ProcessSteps title="Cómo funciona la consignación" steps={STEPS} />
      <FAQAccordion items={FAQS} />
      <ContactCTA
        title="Agenda una evaluación de tu vehículo"
        description="Escríbenos por WhatsApp o llámanos para coordinar una visita a nuestro local en Curicó."
        whatsappMessage="Hola, me gustaría consignar mi vehículo en MOVITRACK."
      />
    </>
  );
}
