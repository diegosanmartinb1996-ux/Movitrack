import type { PaymentMethodId } from "@/lib/payments";

/**
 * Marcas de los medios de pago, dibujadas como SVG para no depender de
 * archivos externos. La de Mastercard es fiel (es geométrica); Visa, Amex y
 * Redcompra son versiones tipográficas en los colores oficiales.
 *
 * Para usar los logos oficiales: pedirlos a Getnet (es el procesador de
 * MOVITRACK; entrega el kit de marca a sus comercios) y reemplazar el SVG
 * correspondiente aquí manteniendo el mismo viewBox.
 */

function Visa() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Visa" className="h-full w-full">
      <text
        x="24"
        y="20.5"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="14"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.5"
        fill="#1434CB"
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Mastercard" className="h-full w-full">
      <defs>
        <clipPath id="mc-right">
          <circle cx="29" cy="15" r="9.5" />
        </clipPath>
      </defs>
      <circle cx="19" cy="15" r="9.5" fill="#EB001B" />
      <circle cx="29" cy="15" r="9.5" fill="#F79E1B" />
      <g clipPath="url(#mc-right)">
        <circle cx="19" cy="15" r="9.5" fill="#FF5F00" />
      </g>
    </svg>
  );
}

function Amex() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="American Express" className="h-full w-full">
      <rect x="4" y="5" width="40" height="20" rx="2.5" fill="#006FCF" />
      <text
        x="24"
        y="18.5"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.4"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

function Redcompra() {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label="Redcompra" className="h-full w-full">
      <text
        x="24"
        y="19"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.1"
        fill="#E1251B"
      >
        redcompra
      </text>
    </svg>
  );
}

const LOGOS: Record<PaymentMethodId, () => React.ReactElement> = {
  visa: Visa,
  mastercard: Mastercard,
  amex: Amex,
  redcompra: Redcompra,
};

export default function PaymentLogo({ id }: { id: PaymentMethodId }) {
  const Logo = LOGOS[id];
  return <Logo />;
}
