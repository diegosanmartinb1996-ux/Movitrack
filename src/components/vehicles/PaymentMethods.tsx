import { CreditCard } from "lucide-react";
import PaymentLogo from "@/components/ui/PaymentLogos";
import { PAYMENT_METHODS } from "@/lib/payments";

export default function PaymentMethods() {
  return (
    <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <p className="flex items-center gap-2 font-body font-medium text-[12px] uppercase tracking-[0.08em] text-white/70">
        <CreditCard size={15} className="shrink-0 text-signal" />
        Medios de pago
      </p>

      <ul className="mt-4 flex flex-wrap gap-2.5">
        {PAYMENT_METHODS.map(({ id, name }) => (
          <li
            key={id}
            title={name}
            className="flex h-9 w-[58px] items-center justify-center rounded-md bg-white px-1.5"
          >
            <PaymentLogo id={id} />
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm leading-relaxed text-white/80">
        Aceptamos pago con tarjetas de crédito y débito. También trabajamos con
        crédito automotriz y recibimos tu vehículo en parte de pago.
      </p>
    </div>
  );
}
