export const CONTACT = {
  whatsappNumber: "56989982479",
  whatsappDisplay: "+56 9 8998 2479",
  phoneNumber: "+56752316765",
  phoneDisplay: "(75) 231 6765",
  address: "Membrillar 386, Curicó, Región del Maule",
  email: "contacto@movitrack.cl",
  hours: "Lun–Vie 9:30–19:00 · Sáb 9:30–14:00",
  instagram: "https://www.instagram.com/automotriz_movitrack/",
};

export function whatsappLink(message = "Hola, quiero más información") {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
