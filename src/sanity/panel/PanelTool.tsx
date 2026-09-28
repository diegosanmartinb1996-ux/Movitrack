"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useClient, useColorSchemeValue, useCurrentUser, useWorkspace, type SanityClient } from "sanity";
import { useRouter } from "sanity/router";
import { apiVersion } from "@/sanity/env";
import { STATUSES, statusLabel } from "@/sanity/vehicleOptions";
import {
  VEHICLES_QUERY,
  groupOf,
  mergeVehicles,
  vehicleName,
  type Group,
  type PanelVehicle,
} from "./data";
import { formatCLP, formatKm } from "@/lib/utils";
import {
  CarIcon,
  CheckCircleIcon,
  ClockIcon,
  CloseIcon,
  EditIcon,
  GlobeIcon,
  GridIcon,
  HomeIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
  StackIcon,
  TickIcon,
  TrashIcon,
} from "./icons";
import { PanelRootContext } from "./StatusMenu";
import { StatusPill, VehicleCard, VehiclePhoto } from "./VehicleCard";
import { VehicleSheet } from "./VehicleSheet";
import s from "./panel.module.css";

type View = "inicio" | Group | "todos";

const VIEWS: { key: View; label: string; icon: ComponentType }[] = [
  { key: "inicio", label: "Inicio", icon: HomeIcon },
  { key: "venta", label: "En venta", icon: CarIcon },
  { key: "reservado", label: "Reservados", icon: ClockIcon },
  { key: "vendido", label: "Vendidos", icon: CheckCircleIcon },
  { key: "todos", label: "Todos", icon: StackIcon },
];

type Sheet = { mode: "create" } | { mode: "edit"; vehicle: PanelVehicle } | null;
type Toast = { text: string; error?: boolean } | null;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function initials(name?: string) {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/** Conecta el panel con el Studio: cliente autenticado, tema y usuario. */
export function PanelTool() {
  const client = useClient({ apiVersion });
  const scheme = useColorSchemeValue();
  const user = useCurrentUser();
  const router = useRouter();
  const { basePath } = useWorkspace();

  return (
    <PanelApp
      client={client}
      scheme={scheme}
      user={user}
      onOpenAdvanced={() => router.navigateUrl({ path: `${basePath}/structure` })}
    />
  );
}

export function PanelApp({
  client,
  scheme,
  user,
  onOpenAdvanced,
}: {
  client: SanityClient;
  scheme: string;
  user: { name?: string; profileImage?: string } | null;
  onOpenAdvanced: () => void;
}) {
  const [vehicles, setVehicles] = useState<PanelVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [view, setView] = useState<View>("inicio");
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "row">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    () =>
      client.fetch(VEHICLES_QUERY).then(
        (docs) => {
          setVehicles(mergeVehicles(docs));
          setLoadError(false);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoadError(true);
          setLoading(false);
        }
      ),
    [client]
  );

  // Agrupa en una sola recarga los avisos que llegan casi juntos (cambio propio + aviso en vivo).
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scheduleLoad = useCallback(() => {
    clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(load, 400);
  }, [load]);

  // Carga inicial y actualización en vivo cuando alguien cambia un auto.
  useEffect(() => {
    load();
    let sub: { unsubscribe: () => void } | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      sub = client
        .listen('*[_type == "vehiculo"]', {}, { visibility: "query", includeResult: false })
        .subscribe({
          next: scheduleLoad,
          // Si se corta la conexión, vuelve a conectarse y recarga la lista.
          error: (err: unknown) => {
            console.error(err);
            retry = setTimeout(() => {
              scheduleLoad();
              connect();
            }, 5000);
          },
        });
    };
    connect();
    const onVisible = () => {
      if (document.visibilityState === "visible") scheduleLoad();
    };
    window.addEventListener("online", scheduleLoad);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(retry);
      clearTimeout(reloadTimer.current);
      sub?.unsubscribe();
      window.removeEventListener("online", scheduleLoad);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [client, load, scheduleLoad]);

  const showToast = useCallback((text: string, error = false) => {
    setToast({ text, error });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const counts = useMemo(() => {
    const c = { venta: 0, reservado: 0, vendido: 0 };
    // Los borradores no se ven en el sitio, así que no cuentan en el inventario.
    for (const v of vehicles) if (!v.onlyDraft) c[groupOf(v)]++;
    return c;
  }, [vehicles]);

  const q = query.trim().toLowerCase();
  const filtered = vehicles.filter((v) => {
    if (view !== "inicio" && view !== "todos" && (v.onlyDraft || groupOf(v) !== view)) return false;
    if (!q) return true;
    return [v.brand, v.model, v.version, v.year].join(" ").toLowerCase().includes(q);
  });
  const selected = vehicles.find((v) => v.id === selectedId) ?? null;
  const showHome = view === "inicio" && !q;

  function go(next: View) {
    setView(next);
    setSelectedId(null);
    setConfirmDelete(false);
  }

  function select(id: string) {
    setSelectedId((cur) => (cur === id ? null : id));
    setConfirmDelete(false);
  }

  async function setStatus(v: PanelVehicle, status: string) {
    setBusy(true);
    try {
      const tx = client.transaction();
      if (!v.onlyDraft) tx.patch(v.id, (p) => p.set({ status }));
      if (v.onlyDraft || v.hasDraft) tx.patch(`drafts.${v.id}`, (p) => p.set({ status }));
      await tx.commit();
      setVehicles((vs) => vs.map((x) => (x.id === v.id ? { ...x, status } : x)));
      scheduleLoad();
      showToast(
        status === "vendido"
          ? `${vehicleName(v)} marcado como vendido.`
          : status === "reservado"
            ? `${vehicleName(v)} marcado como reservado.`
            : `${vehicleName(v)} ahora dice "${statusLabel(status)}".`
      );
    } catch (err) {
      console.error(err);
      showToast("No se pudo cambiar la etiqueta. Intenta de nuevo.", true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(v: PanelVehicle) {
    setBusy(true);
    try {
      await client.transaction().delete(v.id).delete(`drafts.${v.id}`).commit();
      setVehicles((vs) => vs.filter((x) => x.id !== v.id));
      setSelectedId(null);
      setConfirmDelete(false);
      scheduleLoad();
      showToast("Auto eliminado del catálogo.");
    } catch (err) {
      console.error(err);
      showToast("No se pudo eliminar. Intenta de nuevo.", true);
    } finally {
      setBusy(false);
    }
  }

  function navButton(item: (typeof VIEWS)[number]) {
    const Icon = item.icon;
    const count =
      item.key === "inicio" ? null : item.key === "todos" ? vehicles.length : counts[item.key];
    return (
      <button
        key={item.key}
        type="button"
        className={`${s.nav} ${view === item.key ? s.navOn : ""}`}
        aria-current={view === item.key ? "page" : undefined}
        onClick={() => go(item.key)}
      >
        <Icon />
        {item.label}
        {count !== null && <span className={s.navCount}>{count}</span>}
      </button>
    );
  }

  const title = q ? "Resultados" : (VIEWS.find((v) => v.key === view)?.label ?? "");

  return (
    <PanelRootContext.Provider value={rootEl}>
      <div ref={setRootEl} className={s.root} data-scheme={scheme}>
        <aside className={s.side} aria-label="Menú del panel">
          <div className={s.brand}>
            <div className={s.brandMark}>
              M<b>.</b>
            </div>
            <span className={s.brandName}>MOVITRACK</span>
          </div>
          {navButton(VIEWS[0])}
          <div className={s.group}>Autos</div>
          {VIEWS.slice(1).map(navButton)}
          <div className={s.group}>Sitio</div>
          <a className={s.nav} href="/catalogo" target="_blank" rel="noopener noreferrer">
            <GlobeIcon />
            Ver catálogo
          </a>
          <button
            type="button"
            className={s.nav}
            onClick={onOpenAdvanced}
          >
            <SlidersIcon />
            Vista avanzada
          </button>
          <div className={s.sideFoot}>
            <div className={s.avatar}>
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt="" />
              ) : (
                initials(user?.name)
              )}
            </div>
            <span className={s.ellipsis}>{user?.name ?? "Sesión iniciada"}</span>
          </div>
        </aside>

        <section className={s.main}>
          <nav className={s.mobileTabs} aria-label="Secciones">
            {VIEWS.map(navButton)}
          </nav>

          <header className={s.bar}>
            <h2 className={s.title}>{title}</h2>
            <div className={s.capsule} role="group" aria-label="Vista">
              <button
                type="button"
                className={layout === "grid" ? s.capOn : undefined}
                aria-label="Vista en cuadrícula"
                aria-pressed={layout === "grid"}
                onClick={() => setLayout("grid")}
              >
                <GridIcon />
              </button>
              <button
                type="button"
                className={layout === "row" ? s.capOn : undefined}
                aria-label="Vista en lista"
                aria-pressed={layout === "row"}
                onClick={() => {
                  setLayout("row");
                  if (view === "inicio") go("todos");
                }}
              >
                <ListIcon />
              </button>
            </div>
            <label className={s.search}>
              <SearchIcon />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar marca o modelo"
                aria-label="Buscar"
              />
            </label>
            <button type="button" className={`${s.btn} ${s.primary}`} onClick={() => setSheet({ mode: "create" })}>
              <PlusIcon />
              Subir auto
            </button>
          </header>

          <div className={`${s.body} ${selected ? s.bodySplit : ""}`}>
            <div className={s.stack}>
              {loading ? (
                <div className={s.empty}>Cargando autos…</div>
              ) : loadError ? (
                <div className={s.empty}>
                  <b>No se pudieron cargar los autos</b>
                  <span>Revisa tu conexión a internet.</span>
                  <button type="button" className={`${s.btn} ${s.secondary}`} onClick={load}>
                    Reintentar
                  </button>
                </div>
              ) : showHome ? (
                <>
                  <p className={s.hello}>
                    {greeting()}
                    {user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Así está el inventario hoy.
                  </p>
                  <div className={s.tiles}>
                    {(
                      [
                        ["venta", "En venta", "var(--green)"],
                        ["reservado", "Reservados", "var(--orange)"],
                        ["vendido", "Vendidos", "var(--ink-3)"],
                      ] as const
                    ).map(([key, label, color]) => (
                      <button key={key} type="button" className={s.tile} onClick={() => go(key)}>
                        <span className={s.tileLabel}>
                          <i className={s.dot} style={{ background: color }} />
                          {label}
                        </span>
                        <span className={s.tileValue}>{counts[key]}</span>
                      </button>
                    ))}
                  </div>
                  {vehicles.length ? (
                    <>
                      <p className={s.sectionTitle}>Últimos subidos</p>
                      <div className={s.grid}>
                        {vehicles.slice(0, 8).map((v) => (
                          <VehicleCard
                            key={v.id}
                            vehicle={v}
                            selected={v.id === selectedId}
                            onSelect={() => select(v.id)}
                            onChangeStatus={(status) => setStatus(v, status)}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={s.empty}>
                      <b>Sube tu primer auto</b>
                      <span>Agrega las fotos y los datos, y queda publicado en el catálogo.</span>
                      <button type="button" className={`${s.btn} ${s.primary}`} onClick={() => setSheet({ mode: "create" })}>
                        <PlusIcon />
                        Subir auto
                      </button>
                    </div>
                  )}
                </>
              ) : filtered.length ? (
                <div className={layout === "grid" ? s.grid : s.rows}>
                  {filtered.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      layout={layout}
                      selected={v.id === selectedId}
                      onSelect={() => select(v.id)}
                      onChangeStatus={(status) => setStatus(v, status)}
                    />
                  ))}
                </div>
              ) : (
                <div className={s.empty}>
                  <b>{q ? "No hay autos que coincidan" : "No hay autos en esta sección"}</b>
                  <span>{q ? "Prueba con otra marca o modelo." : "Cuando cambies el estado de un auto, aparecerá aquí."}</span>
                </div>
              )}
            </div>

            {selected && (
              <aside className={s.inspector} aria-label="Detalle del auto">
                <VehiclePhoto vehicle={selected} width={640} height={440}>
                  <button
                    type="button"
                    className={s.closeBtn}
                    aria-label="Cerrar detalle"
                    onClick={() => setSelectedId(null)}
                  >
                    <CloseIcon />
                  </button>
                </VehiclePhoto>
                <div className={s.inspectorBody}>
                  <div>
                    <h3 className={s.inspectorTitle}>{vehicleName(selected)}</h3>
                    <div className={s.muted}>{[selected.version, selected.year].filter(Boolean).join(" · ")}</div>
                  </div>
                  <div className={s.priceLine}>
                    <span className={s.bigPrice}>
                      {typeof selected.price === "number" ? formatCLP(selected.price) : "Sin precio"}
                    </span>
                    <StatusPill vehicle={selected} />
                  </div>
                  {selected.onlyDraft && (
                    <p className={s.note}>
                      Este auto todavía no se ve en el sitio. Ábrelo con Editar y publícalo.
                    </p>
                  )}
                  <dl className={s.specs}>
                    <dt>Kilometraje</dt>
                    <dd>{typeof selected.km === "number" ? formatKm(selected.km) : "Sin dato"}</dd>
                    <dt>Combustible</dt>
                    <dd>{selected.fuel ?? "Sin dato"}</dd>
                    <dt>Transmisión</dt>
                    <dd>{selected.transmission ?? "Sin dato"}</dd>
                    <dt>Tipo</dt>
                    <dd>{selected.bodyType ?? "Sin dato"}</dd>
                    <dt>Fotos</dt>
                    <dd>{selected.images.length}</dd>
                  </dl>

                  <div className={s.field} role="group" aria-label="Etiqueta en el catálogo">
                    <span className={s.label}>Etiqueta en el catálogo</span>
                    <div className={s.chips}>
                      {STATUSES.map((st) => (
                        <button
                          key={st.value}
                          type="button"
                          aria-pressed={selected.status === st.value}
                          aria-busy={busy}
                          className={selected.status === st.value ? s.chipOn : undefined}
                          onClick={() => !busy && selected.status !== st.value && setStatus(selected, st.value)}
                        >
                          {st.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={s.actions}>
                    <button
                      type="button"
                      className={`${s.btn} ${s.primary} ${s.full}`}
                      onClick={() => setSheet({ mode: "edit", vehicle: selected })}
                    >
                      <EditIcon />
                      Editar datos y fotos
                    </button>
                    {!selected.onlyDraft && selected.slug && (
                      <a
                        className={`${s.btn} ${s.secondary}`}
                        href={`/vehiculos/${selected.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GlobeIcon />
                        Ver en el sitio
                      </a>
                    )}
                    {confirmDelete ? (
                      <button
                        type="button"
                        className={`${s.btn} ${s.danger}`}
                        aria-busy={busy}
                        onClick={() => !busy && remove(selected)}
                      >
                        Confirmar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${s.btn} ${s.danger}`}
                        onClick={() => setConfirmDelete(true)}
                      >
                        <TrashIcon />
                        Eliminar
                      </button>
                    )}
                  </div>
                  {confirmDelete && (
                    <p className={s.note}>
                      Se borra del catálogo y no se puede deshacer. Si solo se vendió, mejor márcalo como
                      vendido.
                    </p>
                  )}
                </div>
              </aside>
            )}
          </div>
        </section>

        {sheet && (
          <VehicleSheet
            client={client}
            vehicle={sheet.mode === "edit" ? sheet.vehicle : undefined}
            onClose={() => setSheet(null)}
            onSaved={(message) => {
              setSheet(null);
              scheduleLoad();
              showToast(message);
            }}
          />
        )}

        {toast && (
          <div className={`${s.toast} ${toast.error ? s.toastError : ""}`} role="status">
            {toast.error ? <CloseIcon /> : <TickIcon />}
            {toast.text}
          </div>
        )}
      </div>
    </PanelRootContext.Provider>
  );
}
