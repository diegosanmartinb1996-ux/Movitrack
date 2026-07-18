export const CONTACT = {
  whatsappNumber: "56989982479",
  whatsappDisplay: "+56 9 8998 2479",
  phoneNumber: "+56989982479",
  phoneDisplay: "+56 9 8998 2479",
  address: "Membrillar 386, Curicó, Región del Maule",
  email: "contacto@movitrack.cl",
  hours: "Lun–Vie 9:30–18:30 · Sáb 9:30–13:30",
  instagram: "https://www.instagram.com/automotriz_movitrack/",
};

export function whatsappLink(message = "Hola, quiero más información") {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
