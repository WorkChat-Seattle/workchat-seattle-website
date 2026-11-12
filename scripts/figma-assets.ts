/**
 * Список картинок для выгрузки из Figma (CLAUDE.md, «Правила вёрстки», п. 6).
 * Скрипт `npm run export:figma` (scripts/export-figma.ts) ещё не написан — ждёт
 * FIGMA_TOKEN в .env.local. Пока этих SVG разово скачаны через Figma MCP в
 * design-assets/ui/, контуры лежат в components/ui/glyphs.ts.
 */
export type FigmaAsset = {
  nodeId: string;
  name: string;
  format: "png" | "svg";
  scale: number;
};

export const figmaAssets: FigmaAsset[] = [
  // логотип и иконки (SVG)
  { nodeId: "1048:1421", name: "logo", format: "svg", scale: 1 },
  { nodeId: "1009:1291", name: "icon-date", format: "svg", scale: 1 },
  { nodeId: "1009:1294", name: "icon-location", format: "svg", scale: 1 },
  { nodeId: "1036:1378", name: "icon-time", format: "svg", scale: 1 },
  { nodeId: "1036:1381", name: "icon-language", format: "svg", scale: 1 },
  { nodeId: "1017:1347", name: "icon-chevron-down", format: "svg", scale: 1 },
  // круглые кнопки (default / hover × right / left) и соцсети
  { nodeId: "1003:8026", name: "round-default-right", format: "svg", scale: 1 },
  { nodeId: "1003:8029", name: "round-default-left", format: "svg", scale: 1 },
  { nodeId: "1003:8032", name: "round-hover-right", format: "svg", scale: 1 },
  { nodeId: "1003:8035", name: "round-hover-left", format: "svg", scale: 1 },
  { nodeId: "1003:8088", name: "social-default-linkedin", format: "svg", scale: 1 },
  { nodeId: "1003:8091", name: "social-default-facebook", format: "svg", scale: 1 },
  { nodeId: "1003:8094", name: "social-hover-facebook", format: "svg", scale: 1 },
  { nodeId: "1003:8097", name: "social-hover-linkedin", format: "svg", scale: 1 },
];
