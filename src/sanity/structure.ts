import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "@/sanity/env";
import { CarIcon, CheckCircleIcon, ClockIcon, StackIcon } from "@/sanity/panel/icons";

/** Menú de la vista avanzada, agrupado igual que el panel de autos. */
export const structure: StructureResolver = (S) => {
  const list = (title: string, filter: string) =>
    S.documentList()
      .title(title)
      .schemaType("vehiculo")
      .apiVersion(apiVersion)
      .filter(`_type == "vehiculo" && ${filter}`)
      .defaultOrdering([{ field: "_createdAt", direction: "desc" }]);

  return S.list()
    .title("Autos")
    .items([
      S.listItem()
        .title("En venta")
        .icon(CarIcon)
        .child(list("En venta", `!(status in ["reservado", "vendido"])`)),
      S.listItem()
        .title("Reservados")
        .icon(ClockIcon)
        .child(list("Reservados", `status == "reservado"`)),
      S.listItem()
        .title("Vendidos")
        .icon(CheckCircleIcon)
        .child(list("Vendidos", `status == "vendido"`)),
      S.divider(),
      S.documentTypeListItem("vehiculo").title("Todos los autos").icon(StackIcon),
    ]);
};
