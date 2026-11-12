/**
 * Список картинок для выгрузки из Figma (CLAUDE.md, «Правила вёрстки», п. 6).
 * Запуск: `npm run export:figma` (scripts/export-figma.ts), токен — FIGMA_TOKEN
 * в .env.local. Список пополняется постранично.
 *
 * Поля:
 *  - nodeId — узел в файле PRALafbEv1Nz9J0GRcw7sa;
 *  - name   — имя файла, kebab-case, без расширения;
 *  - format — png (фото) или svg (логотип, иконки; затем SVGO);
 *  - scale  — для png 2 (кадр 1440 → 2880 px по ширине); для svg 1;
 *  - dir    — подпапка: оригинал → design-assets/<dir>/, копия → public/images/<dir>/;
 *  - publish — false: только оригинал (контуры уже встроены в код, см. glyphs.ts);
 *  - currentColor — в копии для сайта заменить цвета на currentColor (только svg);
 *  - keepIds — svg_include_id=true: у каждого <path> id по имени слоя Figma; в SVGO
 *    отключены mergePaths и cleanupIds (нужно для анимации частей, напр. точек логотипа).
 */
export type FigmaAsset = {
  nodeId: string;
  name: string;
  format: "png" | "svg";
  scale: number;
  dir: string;
  publish?: boolean;
  currentColor?: boolean;
  keepIds?: boolean;
};

export const figmaAssets: FigmaAsset[] = [
  // логотип и иконки (SVG). Контуры встроены в components/ui/glyphs.ts,
  // поэтому иконки в public не копируются. Логотип — слои wordmark, bubble,
  // dot-1…dot-3 (id у <path>).
  { nodeId: "1048:1421", name: "logo", format: "svg", scale: 1, dir: "ui", currentColor: true, keepIds: true },
  { nodeId: "1009:1291", name: "icon-date", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1009:1294", name: "icon-location", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1036:1378", name: "icon-time", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1036:1381", name: "icon-language", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1017:1347", name: "icon-chevron-down", format: "svg", scale: 1, dir: "ui", publish: false },
  // круглые кнопки (default / hover × right / left) и соцсети
  { nodeId: "1003:8026", name: "round-default-right", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8029", name: "round-default-left", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8032", name: "round-hover-right", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8035", name: "round-hover-left", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8088", name: "social-default-linkedin", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8091", name: "social-default-facebook", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8094", name: "social-hover-facebook", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1003:8097", name: "social-hover-linkedin", format: "svg", scale: 1, dir: "ui", publish: false },
];
