"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { STATUSES, statusLabel } from "@/sanity/vehicleOptions";
import { groupOf, type Group, type PanelVehicle } from "./data";
import { ChevronDownIcon, TickIcon } from "./icons";
import s from "./panel.module.css";

/** Elemento raíz del panel: los menús se dibujan ahí para no quedar recortados por la tarjeta. */
export const PanelRootContext = createContext<HTMLElement | null>(null);

export const GROUP_PILL: Record<Group, string> = {
  venta: s.pillVenta,
  reservado: s.pillReservado,
  vendido: s.pillVendido,
};

const MENU_WIDTH = 200;
const MENU_HEIGHT = 270;

/** Etiqueta de la tarjeta que, al tocarla, abre un menú para cambiarla. */
export function StatusMenu({
  vehicle,
  onChange,
  className,
}: {
  vehicle: PanelVehicle;
  onChange: (status: string) => void;
  className?: string;
}) {
  const root = useContext(PanelRootContext);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const open = pos !== null;

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    if (open || !trigger.current) {
      setPos(null);
      return;
    }
    const r = trigger.current.getBoundingClientRect();
    // Abre hacia abajo; si no cabe, hacia arriba.
    const below = r.bottom + 6;
    const top =
      below + MENU_HEIGHT > window.innerHeight ? Math.max(8, r.top - 6 - MENU_HEIGHT) : below;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - MENU_WIDTH - 8));
    setPos({ top, left });
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: Event) => {
      const target = e.target as Node;
      if (menu.current?.contains(target) || trigger.current?.contains(target)) return;
      setPos(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setPos(null);
        trigger.current?.focus();
      }
    };
    const close = () => setPos(null);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  const label = statusLabel(vehicle.status);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`${s.pill} ${s.pillButton} ${GROUP_PILL[groupOf(vehicle)]} ${className ?? ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Etiqueta: ${label}. Cambiar etiqueta`}
        onClick={toggle}
      >
        {label}
        <ChevronDownIcon />
      </button>
      {open &&
        root &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            aria-label="Cambiar etiqueta"
            className={s.menu}
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
            onKeyDown={onMenuKey}
          >
            {STATUSES.map((st) => {
              const current = st.value === vehicle.status;
              return (
                <div key={st.value}>
                  {st.value === "reservado" && <div className={s.menuSep} />}
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={current}
                    className={s.menuItem}
                    onClick={() => {
                      setPos(null);
                      if (!current) onChange(st.value);
                    }}
                  >
                    <span className={`${s.menuDot} ${GROUP_PILL[groupOf({ status: st.value })]}`} />
                    {st.title}
                    {current && <TickIcon />}
                  </button>
                </div>
              );
            })}
          </div>,
          root
        )}
    </>
  );
}
