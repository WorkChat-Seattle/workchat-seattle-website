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

// Шапка и мобильное меню: своих картинок нет — логотип, бургер и иконки уже в коде.
// Футер (1110:10554): фото разной обрезки по размерам и рисунок «обнимающие руки».
figmaAssets.push(
  { nodeId: "1048:1442", name: "footer-photo-desktop", format: "png", scale: 2, dir: "footer" },
  { nodeId: "1203:14234", name: "footer-photo-tablet", format: "png", scale: 2, dir: "footer" },
  { nodeId: "1119:2092", name: "footer-photo-mobile", format: "png", scale: 2, dir: "footer" },
  // один рисунок на tablet и desktop (172×78, на desktop 150×68 — тот же контур)
  { nodeId: "1203:14254", name: "footer-hug", format: "svg", scale: 1, dir: "footer" },
);

// Subscribe (1084:10472): фон — фото под размытием (размытие и подложка — в CSS, токены blur-subscribe-*).
// Фон сильно размыт, поэтому масштаб 1, а не 2 — иначе PNG на несколько МБ без выигрыша в качестве.
figmaAssets.push(
  { nodeId: "1023:1361", name: "subscribe-bg-desktop", format: "png", scale: 1, dir: "subscribe" },
  { nodeId: "1203:14161", name: "subscribe-bg-tablet", format: "png", scale: 1, dir: "subscribe" },
  { nodeId: "1084:10458", name: "subscribe-bg-mobile", format: "png", scale: 1, dir: "subscribe" },
);

// Get involved (1084:10523): фото-плитка card-image, разная обрезка по размерам.
figmaAssets.push(
  { nodeId: "1013:1397", name: "get-involved-desktop", format: "png", scale: 2, dir: "get-involved" },
  { nodeId: "1203:14187", name: "get-involved-tablet", format: "png", scale: 2, dir: "get-involved" },
  { nodeId: "1084:10478", name: "get-involved-mobile", format: "png", scale: 2, dir: "get-involved" },
);
