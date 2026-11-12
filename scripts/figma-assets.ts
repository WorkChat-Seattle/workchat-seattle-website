/**
 * Список картинок для выгрузки из Figma (CLAUDE.md, «Правила вёрстки», п. 6).
 * Запуск: `npm run export:figma` (scripts/export-figma.ts), токен — FIGMA_TOKEN
 * в .env.local. Список пополняется постранично.
 *
 * Поля:
 *  - nodeId — узел в файле PRALafbEv1Nz9J0GRcw7sa;
 *  - name   — имя файла, kebab-case, без расширения;
 *  - format — jpg (фото, без прозрачности), png (только если нужна прозрачность) или svg (логотип, иконки; затем SVGO);
 *  - scale  — для фото 2 (кадр 1440 → 2880 px по ширине); для svg 1;
 *  - dir    — подпапка: оригинал → design-assets/<dir>/, копия → public/images/<dir>/;
 *  - publish — false: только оригинал (контуры уже встроены в код, см. glyphs.ts);
 *  - currentColor — в копии для сайта заменить цвета на currentColor (только svg);
 *  - keepIds — svg_include_id=true: у каждого <path> id по имени слоя Figma; в SVGO
 *    отключены mergePaths и cleanupIds (нужно для анимации частей, напр. точек логотипа).
 */
export type FigmaAsset = {
  nodeId: string;
  name: string;
  format: "jpg" | "png" | "svg";
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
  { nodeId: "1048:1442", name: "footer-photo-desktop", format: "jpg", scale: 2, dir: "footer" },
  { nodeId: "1203:14234", name: "footer-photo-tablet", format: "jpg", scale: 2, dir: "footer" },
  { nodeId: "1119:2092", name: "footer-photo-mobile", format: "jpg", scale: 2, dir: "footer" },
  // один рисунок на tablet и desktop (172×78, на desktop 150×68 — тот же контур)
  { nodeId: "1203:14254", name: "footer-hug", format: "svg", scale: 1, dir: "footer" },
);

// Subscribe (1084:10472): фон — фото под размытием (размытие и подложка — в CSS, токены blur-subscribe-*).
figmaAssets.push(
  { nodeId: "1023:1361", name: "subscribe-bg-desktop", format: "jpg", scale: 2, dir: "subscribe" },
  { nodeId: "1203:14161", name: "subscribe-bg-tablet", format: "jpg", scale: 2, dir: "subscribe" },
  { nodeId: "1084:10458", name: "subscribe-bg-mobile", format: "jpg", scale: 2, dir: "subscribe" },
);

// Get involved (1084:10523): фото-плитка card-image, разная обрезка по размерам.
figmaAssets.push(
  { nodeId: "1013:1397", name: "get-involved-desktop", format: "jpg", scale: 2, dir: "get-involved" },
  { nodeId: "1203:14187", name: "get-involved-tablet", format: "jpg", scale: 2, dir: "get-involved" },
  { nodeId: "1084:10478", name: "get-involved-mobile", format: "jpg", scale: 2, dir: "get-involved" },
);

// Home, hero (1003:3576): фото на всю ширину, три обрезки. Отражение на desktop уже в файле.
figmaAssets.push(
  { nodeId: "1110:10615", name: "hero-mobile", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14329", name: "hero-tablet", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3577", name: "hero-desktop", format: "jpg", scale: 2, dir: "home" },
);

// Home, what-we-do (1003:3563): фото-плитки и рисунок «обнимающие руки» (один контур на все размеры).
figmaAssets.push(
  { nodeId: "1110:10621", name: "what-we-do-1-mobile", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14335", name: "what-we-do-1-tablet", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1047:6865", name: "what-we-do-1-desktop", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1047:6866", name: "what-we-do-2-desktop", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14352", name: "what-we-do-3-tablet", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1047:6867", name: "what-we-do-3-desktop", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3574", name: "hug-illustration", format: "svg", scale: 1, dir: "home" },
);

// Home, community (1003:3548): коллаж фото. Desktop — 10 фото (d01…d10 = community01…10), tablet — 6 (t01…t06,
// порядок слева направо и сверху вниз), mobile — 6 (m01…m06, 3 сверху, 3 снизу). Обрезка внутри узла.
figmaAssets.push(
  { nodeId: "1003:3559", name: "community-d01", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3558", name: "community-d02", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3557", name: "community-d03", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3556", name: "community-d04", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3555", name: "community-d05", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3554", name: "community-d06", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3553", name: "community-d07", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3552", name: "community-d08", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3551", name: "community-d09", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1003:3550", name: "community-d10", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14391", name: "community-t01", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14392", name: "community-t02", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14393", name: "community-t03", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14394", name: "community-t04", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14395", name: "community-t05", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1203:14396", name: "community-t06", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10671", name: "community-m01", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10672", name: "community-m02", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10673", name: "community-m03", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10674", name: "community-m04", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10675", name: "community-m05", format: "jpg", scale: 2, dir: "home" },
  { nodeId: "1110:10676", name: "community-m06", format: "jpg", scale: 2, dir: "home" },
);
