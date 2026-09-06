/**
 * Medios de pago que se muestran en la ficha de cada vehículo.
 *
 * MOVITRACK procesa con Getnet. Esta lista debe reflejar las marcas
 * efectivamente habilitadas en su terminal — confirmar antes de publicar.
 * Editar esta lista es lo único necesario para agregar o quitar un medio:
 * el componente se adapta solo.
 */
export type PaymentMethodId =
  | "visa"
  | "mastercard"
  | "amex"
  | "redcompra";

/**
 * American Express está desactivada por ahora: su logo sigue disponible en
 * PaymentLogos, así que para reactivarla basta con volver a agregar
 * `{ id: "amex", name: "American Express" }` a esta lista.
 */
export const PAYMENT_METHODS: { id: PaymentMethodId; name: string }[] = [
  { id: "visa", name: "Visa" },
  { id: "mastercard", name: "Mastercard" },
  { id: "redcompra", name: "Redcompra" },
];
