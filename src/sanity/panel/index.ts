import type { Tool } from "sanity";
import { CarIcon } from "./icons";
import { PanelTool } from "./PanelTool";

/** Panel de autos estilo app: la pantalla principal del Studio. */
export const panelTool: Tool = {
  name: "autos",
  title: "Autos",
  icon: CarIcon,
  component: PanelTool,
};
