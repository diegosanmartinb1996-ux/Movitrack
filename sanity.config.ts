"use client";

import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "@/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { panelTool } from "@/sanity/panel";
import { structure } from "@/sanity/structure";

const theme = buildLegacyTheme({
  "--font-family-base":
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "Segoe UI", system-ui, sans-serif',
  "--font-family-monospace": '"SF Mono", ui-monospace, Menlo, Consolas, monospace',
  "--black": "#0a0a0a",
  "--white": "#ffffff",
  "--brand-primary": "#e10600",
  "--component-bg": "#ffffff",
  "--component-text-color": "#1d1d1f",
  "--default-button-color": "#6e6e73",
  "--default-button-primary-color": "#e10600",
  "--default-button-success-color": "#1f9d47",
  "--default-button-warning-color": "#c46a00",
  "--default-button-danger-color": "#d70015",
  "--focus-color": "#e10600",
  "--gray-base": "#1d1d1f",
  "--gray": "#6e6e73",
  "--main-navigation-color": "#0a0a0a",
  "--main-navigation-color--inverted": "#ffffff",
  "--state-info-color": "#0a84ff",
  "--state-success-color": "#1f9d47",
  "--state-warning-color": "#c46a00",
  "--state-danger-color": "#d70015",
  "--screen-medium-break": "",
  "--screen-default-break": "",
});

export default defineConfig({
  name: "movitrack",
  title: "MOVITRACK · Panel",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  theme,
  plugins: [
    structureTool({ title: "Vista avanzada", structure }),
    // Herramienta técnica: solo en desarrollo para no confundir en el panel real.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
  // El panel de autos va primero para que sea lo que se abre en /studio.
  tools: (prev) => [panelTool, ...prev],
});
