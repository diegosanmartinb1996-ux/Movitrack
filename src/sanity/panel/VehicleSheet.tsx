"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import type { SanityClient } from "sanity";
import {
  BODY_TYPES,
  FOR_SALE_STATUSES,
  FUELS,
  STATUSES,
  TRACTIONS,
  TRANSMISSIONS,
} from "@/sanity/vehicleOptions";
import {
  imageUrl,
  newKey,
  slugify,
  uniqueSlug,
  type PanelVehicle,
  type SanityImage,
} from "./data";
import { formatCLP, formatKm } from "@/lib/utils";
import { CloseIcon, PhotoIcon, StarIcon, TickIcon } from "./icons";
import { VehicleCard } from "./VehicleCard";
import s from "./panel.module.css";

type Photo = {
  key: string;
  preview: string;
  state: "queued" | "uploading" | "ready" | "error";
  image?: SanityImage;
};

/** Fotos que se suben a la vez; más satura conexiones móviles. */
const MAX_PARALLEL_UPLOADS = 3;
/** HEIC queda fuera a propósito: el iPhone lo convierte a JPG al elegir. */
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Form = {
  brand: string;
  model: string;
  version: string;
  year: string;
  price: string;
  km: string;
  fuel: string;
  transmission: string;
  traction: string;
  color: string;
  bodyType: string;
  status: string;
  engine: string;
  featureTag: string;
  description: string;
};

const STEPS = ["Fotos", "Datos", "Precio", "Revisar"];

const toText = (v: unknown) => (v === undefined || v === null ? "" : String(v));

function initialForm(v?: PanelVehicle): Form {
  return {
    brand: toText(v?.brand),
    model: toText(v?.model),
    version: toText(v?.version),
    year: toText(v?.year),
    price: toText(v?.price),
    km: toText(v?.km),
    fuel: v?.fuel ?? "Bencina",
    transmission: v?.transmission ?? "Automática",
    traction: toText(v?.traction),
    color: toText(v?.color),
    bodyType: toText(v?.bodyType),
    status: v?.status ?? "nuevo-ingreso",
    engine: toText(v?.engine),
    featureTag: toText(v?.featureTag),
    description: toText(v?.description),
  };
}

function missingFields(f: Form) {
  const out: string[] = [];
  if (!f.brand.trim()) out.push("marca");
  if (!f.model.trim()) out.push("modelo");
  const year = Number(f.year);
  if (!/^\d{4}$/.test(f.year) || year < 1980 || year > 2100) out.push("año");
  if (!f.bodyType) out.push("tipo de vehículo");
  if (!(Number(f.price) > 0)) out.push("precio");
  if (f.km === "") out.push("kilometraje");
  return out;
}

export function VehicleSheet({
  client,
  vehicle,
  onClose,
  onSaved,
}: {
  client: SanityClient;
  vehicle?: PanelVehicle;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const editing = Boolean(vehicle);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(() => initialForm(vehicle));
  const [photos, setPhotos] = useState<Photo[]>(() =>
    (vehicle?.images ?? []).map((img) => ({
      key: img._key,
      preview: imageUrl(img, 400, 300) ?? "",
      state: "ready" as const,
      image: img,
    }))
  );
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const objectUrls = useRef<string[]>([]);
  // Cola de subida: archivos pendientes, cuántos van subiendo y qué subió esta sesión.
  const files = useRef(new Map<string, File>());
  const queue = useRef<string[]>([]);
  const active = useRef(0);
  const alive = useRef(true);
  const saved = useRef(false);
  const freshAssets = useRef(new Map<string, string>());
  const dropped = useRef(new Set<string>());
  const removedExisting = useRef<string[]>([]);

  // Al cerrar sin guardar, borra las fotos que se alcanzaron a subir.
  useEffect(() => {
    alive.current = true;
    const urls = objectUrls.current;
    const fresh = freshAssets.current;
    const wasSaved = saved;
    return () => {
      alive.current = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
      if (!wasSaved.current) fresh.forEach((assetId) => client.delete(assetId).catch(() => {}));
    };
  }, [client]);

  function discardAsset(assetId: string) {
    client.delete(assetId).catch(() => {});
  }

  function requestClose() {
    if (dirty && !confirmClose) {
      setConfirmClose(true);
      return;
    }
    onClose();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setError(null);
    setConfirmClose(false);
  }

  function setPhotoState(key: string, patch: Partial<Photo>) {
    setPhotos((p) => p.map((ph) => (ph.key === key ? { ...ph, ...patch } : ph)));
  }

  /** Sube de a pocas fotos a la vez; se vuelve a llamar cuando termina cada una. */
  function pump() {
    while (alive.current && active.current < MAX_PARALLEL_UPLOADS && queue.current.length) {
      const key = queue.current.shift()!;
      const file = files.current.get(key);
      if (!file) continue;
      active.current++;
      setPhotoState(key, { state: "uploading" });
      client.assets
        .upload("image", file, { filename: file.name })
        .then(
          (asset) => {
            if (!alive.current || dropped.current.has(key)) {
              discardAsset(asset._id);
              return;
            }
            freshAssets.current.set(key, asset._id);
            files.current.delete(key);
            setPhotoState(key, {
              state: "ready",
              image: { _type: "image", _key: key, asset: { _type: "reference", _ref: asset._id } },
            });
          },
          () => {
            if (alive.current) setPhotoState(key, { state: "error" });
          }
        )
        .finally(() => {
          active.current--;
          pump();
        });
    }
  }

  function addFiles(list: FileList | File[]) {
    const all = Array.from(list);
    const images = all.filter((f) => ACCEPTED_TYPES.includes(f.type));
    setError(
      images.length < all.length ? "Algunos archivos no se agregaron: solo se aceptan fotos JPG, PNG o WebP." : null
    );
    if (!images.length) return;
    setDirty(true);
    const added: Photo[] = images.map((file) => {
      const key = newKey();
      const preview = URL.createObjectURL(file);
      objectUrls.current.push(preview);
      files.current.set(key, file);
      queue.current.push(key);
      return { key, preview, state: "queued" };
    });
    setPhotos((p) => [...p, ...added]);
    pump();
  }

  function retryPhoto(key: string) {
    setError(null);
    setPhotoState(key, { state: "queued" });
    queue.current.push(key);
    pump();
  }

  function movePhoto(from: number, to: number) {
    if (from === to) return;
    setPhotos((p) => {
      const next = [...p];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDirty(true);
  }

  function removePhoto(key: string) {
    const photo = photos.find((ph) => ph.key === key);
    const freshId = freshAssets.current.get(key);
    if (freshId) {
      // Subida en esta sesión y aún sin usar: se borra de inmediato.
      freshAssets.current.delete(key);
      discardAsset(freshId);
    } else if (photo?.state === "ready" && photo.image?.asset?._ref) {
      // Foto ya guardada: se borra recién cuando se guardan los cambios.
      removedExisting.current.push(photo.image.asset._ref);
    } else if (photo?.state === "uploading") {
      dropped.current.add(key);
    }
    queue.current = queue.current.filter((k) => k !== key);
    files.current.delete(key);
    setPhotos((p) => p.filter((ph) => ph.key !== key));
    setDirty(true);
  }

  function onThumbDragOver(e: DragEvent, index: number) {
    if (dragIndex === null) return;
    e.preventDefault();
    if (index !== dragIndex) {
      movePhoto(dragIndex, index);
      setDragIndex(index);
    }
  }

  async function save() {
    const missing = missingFields(form);
    if (missing.length) {
      setError(`Falta completar: ${missing.join(", ")}.`);
      return;
    }
    if (photos.some((p) => p.state === "uploading" || p.state === "queued")) {
      setError("Espera a que terminen de subir las fotos.");
      return;
    }
    if (photos.some((p) => p.state === "error")) {
      setError("Hay fotos que no se pudieron subir. Reinténtalas o quítalas en el paso Fotos.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const id = vehicle?.id ?? crypto.randomUUID();
      const draftId = `drafts.${id}`;
      const slug =
        vehicle?.slug ??
        (await uniqueSlug(
          client,
          slugify(`${form.brand} ${form.model} ${form.version} ${form.year}`),
          id
        ));

      const existing = editing
        ? ((await client.getDocument(id)) ?? (await client.getDocument(draftId)))
        : undefined;
      // Conserva cualquier campo que el panel no maneja.
      const rest: Record<string, unknown> = { ...(existing ?? {}) };
      for (const k of ["_id", "_rev", "_createdAt", "_updatedAt"]) delete rest[k];

      const doc: Record<string, unknown> = {
        ...rest,
        _id: id,
        _type: "vehiculo",
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        price: Number(form.price),
        km: Number(form.km),
        fuel: form.fuel,
        transmission: form.transmission,
        bodyType: form.bodyType,
        status: form.status,
        slug: { _type: "slug", current: slug },
        images: photos.filter((p) => p.state === "ready" && p.image).map((p) => p.image),
      };
      const optional = {
        version: form.version,
        traction: form.traction,
        color: form.color,
        engine: form.engine,
        featureTag: form.featureTag,
        description: form.description,
      };
      for (const [key, value] of Object.entries(optional)) {
        if (value.trim()) doc[key] = value.trim();
        else delete doc[key];
      }

      await client
        .transaction()
        .createOrReplace(doc as { _id: string; _type: string })
        .delete(draftId)
        .commit();
      saved.current = true;

      // Limpia las fotos que se quitaron del auto. Si otro documento las usa, Sanity no las borra.
      for (const assetId of removedExisting.current) discardAsset(assetId);

      onSaved(editing ? "Cambios guardados. Ya se ven en el sitio." : "Publicado. Ya aparece en el catálogo.");
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Revisa tu conexión e intenta de nuevo.");
      setSaving(false);
    }
  }

  const statusOptions = editing
    ? STATUSES
    : STATUSES.filter((st) => FOR_SALE_STATUSES.includes(st.value));
  const readyCount = photos.filter((p) => p.state === "ready").length;
  const failedCount = photos.filter((p) => p.state === "error").length;
  const pendingCount = photos.length - readyCount - failedCount;
  const missing = missingFields(form);

  const preview: PanelVehicle = {
    id: vehicle?.id ?? "nuevo",
    onlyDraft: false,
    hasDraft: false,
    createdAt: "",
    brand: form.brand || "Marca",
    model: form.model || "Modelo",
    year: Number(form.year) || undefined,
    price: Number(form.price) || 0,
    km: Number(form.km) || 0,
    fuel: form.fuel,
    bodyType: form.bodyType,
    status: form.status,
    images: [],
  };

  return (
    <div
      className={s.veil}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label={editing ? "Editar auto" : "Subir auto"}>
        <div className={s.sheetHead}>
          <div className={s.sheetHeadRow}>
            <h3 className={s.sheetTitle}>{editing ? "Editar auto" : "Subir auto"}</h3>
            <span className={s.muted}>Paso {step + 1} de 4</span>
          </div>
          <div className={s.steps}>
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                className={i === step ? s.stepOn : i < step ? s.stepDone : undefined}
                onClick={() => setStep(i)}
              >
                {i < step ? "✓ " : ""}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={s.sheetBody}>
          {vehicle?.hasDraft && (
            <p className={s.note}>
              Este auto tiene cambios sin publicar hechos en la vista avanzada. Al guardar aquí se
              reemplazan por lo que ves en este formulario.
            </p>
          )}

          {step === 0 && (
            <>
              <label
                className={`${s.dropzone} ${dragOver ? s.dropOver : ""}`}
                onDragOver={(e) => {
                  if (dragIndex !== null) return;
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  if (dragIndex !== null) return;
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
              >
                <PhotoIcon />
                <b>Arrastra aquí todas las fotos del auto</b>
                <span className={s.muted}>
                  O haz clic para elegirlas desde el computador o el celular. La primera queda de portada.
                </span>
                <input
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {photos.length > 0 ? (
                <>
                  <div className={s.thumbs}>
                    {photos.map((ph, i) => (
                      <div
                        key={ph.key}
                        className={`${s.thumb} ${dragIndex === i ? s.thumbDragging : ""}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          setDragIndex(i);
                        }}
                        onDragOver={(e) => onThumbDragOver(e, i)}
                        onDragEnd={() => setDragIndex(null)}
                        onDrop={(e) => e.preventDefault()}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {ph.preview && <img src={ph.preview} alt="" />}
                        {i === 0 && <span className={s.thumbCover}>Portada</span>}
                        <div className={s.thumbTools}>
                          {i !== 0 && (
                            <button type="button" aria-label="Usar como portada" title="Usar como portada" onClick={() => movePhoto(i, 0)}>
                              <StarIcon />
                            </button>
                          )}
                          <button type="button" aria-label="Quitar foto" title="Quitar foto" onClick={() => removePhoto(ph.key)}>
                            <CloseIcon />
                          </button>
                        </div>
                        {ph.state === "queued" && <div className={s.thumbState}>En espera</div>}
                        {ph.state === "uploading" && <div className={s.thumbState}>Subiendo…</div>}
                        {ph.state === "error" && (
                          <div className={s.thumbState}>
                            <span>No se pudo subir</span>
                            <button type="button" className={s.retry} onClick={() => retryPhoto(ph.key)}>
                              Reintentar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className={s.muted}>Arrastra las fotos para cambiar el orden.</span>
                </>
              ) : (
                <span className={s.muted}>Puedes agregar las fotos ahora o más tarde.</span>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div className={s.two}>
                <TextField id="brand" label="Marca" placeholder="Toyota" value={form.brand} onChange={(v) => update("brand", v)} />
                <TextField id="model" label="Modelo" placeholder="RAV4" value={form.model} onChange={(v) => update("model", v)} />
                <TextField id="version" label="Versión" placeholder="Limited 4x4" value={form.version} onChange={(v) => update("version", v)} />
                <TextField
                  id="year"
                  label="Año"
                  placeholder="2021"
                  inputMode="numeric"
                  value={form.year}
                  onChange={(v) => update("year", v.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
              <Chips label="Tipo de vehículo" options={BODY_TYPES} value={form.bodyType} onChange={(v) => update("bodyType", v)} />
              <Chips label="Combustible" options={FUELS} value={form.fuel} onChange={(v) => update("fuel", v)} />
              <Chips label="Transmisión" options={TRANSMISSIONS} value={form.transmission} onChange={(v) => update("transmission", v)} />
              <Chips
                label="Tracción (opcional)"
                options={TRACTIONS}
                value={form.traction}
                onChange={(v) => update("traction", form.traction === v ? "" : v)}
              />
              <div className={s.two}>
                <TextField id="engine" label="Motor (opcional)" placeholder="2.0L Turbo, 211 hp" value={form.engine} onChange={(v) => update("engine", v)} />
                <TextField id="color" label="Color (opcional)" placeholder="Gris plata" value={form.color} onChange={(v) => update("color", v)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={s.two}>
                <TextField
                  id="price"
                  label="Precio"
                  placeholder="18.990.000"
                  inputMode="numeric"
                  value={form.price}
                  format={(v) => Number(v).toLocaleString("es-CL")}
                  onChange={(v) => update("price", v.replace(/\D/g, ""))}
                  hint={form.price ? `Se verá como ${formatCLP(Number(form.price))}` : "Escribe solo el número"}
                />
                <TextField
                  id="km"
                  label="Kilometraje"
                  placeholder="45.000"
                  inputMode="numeric"
                  value={form.km}
                  format={(v) => Number(v).toLocaleString("es-CL")}
                  onChange={(v) => update("km", v.replace(/\D/g, ""))}
                  hint={form.km ? `Se verá como ${formatKm(Number(form.km))}` : "Escribe solo el número"}
                />
              </div>
              <Chips
                label="Etiqueta en el catálogo"
                options={statusOptions.map((st) => st.value)}
                labels={Object.fromEntries(STATUSES.map((st) => [st.value, st.title]))}
                value={form.status}
                onChange={(v) => update("status", v)}
              />
              <TextField
                id="featureTag"
                label="Frase destacada (opcional)"
                placeholder="Único dueño"
                value={form.featureTag}
                onChange={(v) => update("featureTag", v)}
              />
              <div className={s.field}>
                <label className={s.label} htmlFor="panel-description">
                  Descripción (opcional)
                </label>
                <textarea
                  id="panel-description"
                  className={`${s.input} ${s.textarea}`}
                  placeholder="Mantenciones al día, papeles al día, neumáticos nuevos."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className={s.review}>
              <VehicleCard
                vehicle={preview}
                coverOverride={photos.find((p) => p.state === "ready")?.preview}
                as="div"
              />
              <div className={s.checks}>
                <p>Así se verá en el catálogo</p>
                <Check ok={readyCount > 0} text={readyCount ? `${readyCount} ${readyCount === 1 ? "foto" : "fotos"}` : "Sin fotos (puedes agregarlas después)"} />
                {failedCount > 0 && (
                  <Check
                    ok={false}
                    text={`${failedCount} ${failedCount === 1 ? "foto no se pudo subir" : "fotos no se pudieron subir"}. Reinténtalas o quítalas en el paso Fotos.`}
                  />
                )}
                {pendingCount > 0 && <Check ok={false} text={`${pendingCount} ${pendingCount === 1 ? "foto" : "fotos"} todavía subiendo`} />}
                <Check ok={Boolean(form.brand.trim() && form.model.trim())} text="Marca y modelo" />
                <Check ok={!missing.includes("año")} text="Año" />
                <Check ok={Boolean(form.bodyType)} text="Tipo de vehículo" />
                <Check ok={!missing.includes("precio")} text={form.price ? `Precio ${formatCLP(Number(form.price))}` : "Precio"} />
                <Check ok={form.km !== ""} text={form.km ? `Kilometraje ${formatKm(Number(form.km))}` : "Kilometraje"} />
              </div>
            </div>
          )}
        </div>

        <div className={s.sheetFoot}>
          {confirmClose ? (
            <>
              <span className={s.muted}>¿Descartar lo que llevas?</span>
              <span style={{ display: "flex", gap: 8 }}>
                <button type="button" className={`${s.btn} ${s.secondary}`} onClick={() => setConfirmClose(false)}>
                  Seguir editando
                </button>
                <button type="button" className={`${s.btn} ${s.danger}`} onClick={onClose}>
                  Descartar
                </button>
              </span>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${s.btn} ${s.secondary}`}
                onClick={() => (step === 0 ? requestClose() : setStep(step - 1))}
              >
                {step === 0 ? "Cancelar" : "Atrás"}
              </button>
              {error && <span className={s.footError}>{error}</span>}
              {step < 3 ? (
                <button type="button" className={`${s.btn} ${s.primary}`} onClick={() => setStep(step + 1)}>
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  className={`${s.btn} ${s.primary}`}
                  aria-busy={saving}
                  onClick={() => !saving && save()}
                >
                  {saving ? "Guardando…" : editing ? "Guardar cambios" : "Publicar en el sitio"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  hint,
  format,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric";
  hint?: string;
  /** Formato al salir del campo; mientras se escribe se ve el valor tal cual. */
  format?: (v: string) => string;
}) {
  const [focused, setFocused] = useState(false);
  const shown = format && !focused && value ? format(value) : value;
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={`panel-${id}`}>
        {label}
      </label>
      <input
        id={`panel-${id}`}
        className={s.input}
        value={shown}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint !== undefined && <span className={s.hint}>{hint}</span>}
    </div>
  );
}

function Chips({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={s.field} role="group" aria-label={label}>
      <span className={s.label}>{label}</span>
      <div className={s.chips}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={value === opt}
            className={value === opt ? s.chipOn : undefined}
            onClick={() => onChange(opt)}
          >
            {labels?.[opt] ?? opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Check({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`${s.check} ${ok ? s.ok : s.missing}`}>
      {ok ? <TickIcon /> : <CloseIcon />}
      <span style={{ color: "var(--ink)" }}>{text}</span>
    </div>
  );
}
