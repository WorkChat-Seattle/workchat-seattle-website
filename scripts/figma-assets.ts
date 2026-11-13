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
 *  - fill — выгрузить не рендер узла, а исходную картинку-заливку узла (без текста поверх; масштаб не используется);
 *  - avatarColor — цветная версия аватара (эллипс с заливкой-фото и обводкой-кольцом): исходное фото БЕЗ фильтра
 *    saturation из Figma (exposure запекается), обрезка как в узле, маска-эллипс, кольцо из stroke узла поверх;
 *    нужна для hover «ч/б → цвет» (animations.md, п. 9); задаётся вместе с fill: true;
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
  fill?: boolean;
  avatarColor?: boolean;
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

// Home, find-mentor: фон из колец и градиентов (desktop и tablet — готовые кадры background, mobile — собран из слоёв в коде).
figmaAssets.push(
  { nodeId: "1003:3503", name: "find-mentor-bg-desktop", format: "svg", scale: 1, dir: "home" },
  { nodeId: "1203:14460", name: "find-mentor-bg-tablet", format: "svg", scale: 1, dir: "home" },
);

// Home, resource-hub (1003:3521): фото-фон четвёртой карточки — заливка узла card-rectangle (под ним тёмная подложка с размытием в CSS).
figmaAssets.push({ nodeId: "1003:3527", name: "resource-hub-business", format: "jpg", scale: 1, dir: "home", fill: true });

// Home, find-mentor: аватары менторов с кольцом-ореолом (прозрачность — поэтому PNG). Номера как в Figma (Avatar02…08);
// у tablet те же люди, у mobile четыре аватара (m1…m4 — слева направо и сверху вниз).
figmaAssets.push(
  { nodeId: "1003:3514", name: "avatar-d02", format: "png", scale: 2, dir: "home" },
  { nodeId: "1003:3513", name: "avatar-d03", format: "png", scale: 2, dir: "home" },
  { nodeId: "1003:3512", name: "avatar-d04", format: "png", scale: 2, dir: "home" },
  { nodeId: "1003:3511", name: "avatar-d05", format: "png", scale: 2, dir: "home" },
  { nodeId: "1003:3510", name: "avatar-d07", format: "png", scale: 2, dir: "home" },
  { nodeId: "1003:3509", name: "avatar-d08", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14471", name: "avatar-t02", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14470", name: "avatar-t03", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14469", name: "avatar-t04", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14468", name: "avatar-t05", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14467", name: "avatar-t07", format: "png", scale: 2, dir: "home" },
  { nodeId: "1203:14466", name: "avatar-t08", format: "png", scale: 2, dir: "home" },
  { nodeId: "1110:10748", name: "avatar-m1", format: "png", scale: 2, dir: "home" },
  { nodeId: "1110:10751", name: "avatar-m2", format: "png", scale: 2, dir: "home" },
  { nodeId: "1110:10750", name: "avatar-m3", format: "png", scale: 2, dir: "home" },
  { nodeId: "1110:10749", name: "avatar-m4", format: "png", scale: 2, dir: "home" },
);

// Home, testimonials (1088:1724): фото автора отзыва (заливка узла photo в card-testimonial, обрезка и круг — в CSS)
// и знак кавычек (контур в glyphs.ts).
figmaAssets.push(
  { nodeId: "I1003:3490;1048:1383", name: "testimonial-kristina", format: "jpg", scale: 1, dir: "home", fill: true },
  { nodeId: "I1003:3490;1048:1385", name: "quote-mark", format: "svg", scale: 1, dir: "ui", publish: false },
);

// Home, testimonials, остальные отзывы (секция Testimonials 1819:24757): фото авторов — заливки узлов photo.
figmaAssets.push(
  { nodeId: "I1349:6401;1048:1383", name: "testimonial-natalia", format: "jpg", scale: 1, dir: "home", fill: true },
  { nodeId: "I1347:6391;1048:1383", name: "testimonial-yana", format: "jpg", scale: 1, dir: "home", fill: true },
);

// Страница 404 (кадры `1454:22166` / `1454:22422` / `1454:22443`): фото «кофе» с разной обрезкой по размерам, декоративное.
figmaAssets.push(
  { nodeId: "1454:22459", name: "coffee-mobile", format: "jpg", scale: 2, dir: "not-found" },
  { nodeId: "1454:22438", name: "coffee-tablet", format: "jpg", scale: 2, dir: "not-found" },
  { nodeId: "1454:22230", name: "coffee-desktop", format: "jpg", scale: 2, dir: "not-found" },
);

// faq-toggle (`1041:1384`): плюс и крестик 24×24 — контуры в glyphs.ts
figmaAssets.push(
  { nodeId: "1041:1378", name: "faq-toggle-plus", format: "svg", scale: 1, dir: "ui", publish: false },
  { nodeId: "1041:1382", name: "faq-toggle-close", format: "svg", scale: 1, dir: "ui", publish: false },
);

// About (`1003:3944`): фото hero (три обрезки), фоны Our Values (5 ценностей × 3 размера — рендер узла background: обрезка и фильтры из Figma),
// портреты команды (слой image карточки card-team-member, ч/б из макета; PNG — у слоя прозрачный фон, под ним тон карточки).
figmaAssets.push(
  { nodeId: "1003:4019", name: "about-hero-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1240:14912", name: "about-hero-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1113:11044", name: "about-hero-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1029:1366", name: "values-community-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1240:14872", name: "values-community-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1113:10983", name: "values-community-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23369", name: "values-support-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23521", name: "values-support-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23445", name: "values-support-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23388", name: "values-growth-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23540", name: "values-growth-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23464", name: "values-growth-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23407", name: "values-empowerment-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23559", name: "values-empowerment-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23483", name: "values-empowerment-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23426", name: "values-learning-desktop", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23578", name: "values-learning-tablet", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "1278:23502", name: "values-learning-mobile", format: "jpg", scale: 2, dir: "about" },
  { nodeId: "I1047:6886;1010:1364", name: "team-masha", format: "png", scale: 2, dir: "about" },
  { nodeId: "I1047:6892;1077:3170", name: "team-tatyana", format: "png", scale: 2, dir: "about" },
  { nodeId: "I1047:6898;1077:3164", name: "team-julia", format: "png", scale: 2, dir: "about" },
);

// Mentorship (`1003:4997`): фото hero (3 обрезки) и логотипы внешних программ (Upwardly Global — SVG, ADPList — PNG).
figmaAssets.push(
  { nodeId: "1003:5080", name: "mentorship-hero-desktop", format: "jpg", scale: 2, dir: "mentorship" },
  { nodeId: "1240:15223", name: "mentorship-hero-tablet", format: "jpg", scale: 2, dir: "mentorship" },
  { nodeId: "1135:11315", name: "mentorship-hero-mobile", format: "jpg", scale: 2, dir: "mentorship" },
  { nodeId: "I1047:7232;1577:15105", name: "logo-upwardly-global", format: "svg", scale: 1, dir: "mentorship" },
  { nodeId: "I1047:7243;1013:1369", name: "logo-adplist", format: "png", scale: 2, dir: "mentorship" },
);

// Volunteer (`1003:4794`): четыре фото-плитки card-image в разных обрезках (desktop / tablet / mobile); номера 1…4 — по порядку в макете. Mobile-плитки 2–4 в Figma скрыты (не рендерятся) — берём заливку узла (fill).
figmaAssets.push(
  { nodeId: "1047:7014", name: "volunteer-photo-1-desktop", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1240:15770", name: "volunteer-photo-1-tablet", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1145:11813", name: "volunteer-photo-1-mobile", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1047:7024", name: "volunteer-photo-2-desktop", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1240:15781", name: "volunteer-photo-2-tablet", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1145:11797", name: "volunteer-photo-2-mobile", format: "jpg", scale: 2, dir: "volunteer", fill: true },
  { nodeId: "1047:7034", name: "volunteer-photo-3-desktop", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1240:15797", name: "volunteer-photo-3-tablet", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1145:11829", name: "volunteer-photo-3-mobile", format: "jpg", scale: 2, dir: "volunteer", fill: true },
  { nodeId: "1047:7035", name: "volunteer-photo-4-desktop", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1240:15808", name: "volunteer-photo-4-tablet", format: "jpg", scale: 2, dir: "volunteer" },
  { nodeId: "1145:11840", name: "volunteer-photo-4-mobile", format: "jpg", scale: 2, dir: "volunteer", fill: true },
);

// Home, find-mentor: цветные версии аватаров для hover (animations.md, п. 9). Только те, что в макете чёрно-белые
// (saturation −1): Avatar02, 04, 05, 07, 08. Avatar03 в макете цветной — отдельной версии не нужно. Для mobile не нужны (нет hover).
figmaAssets.push(
  { nodeId: "1003:3514", name: "avatar-d02-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1003:3512", name: "avatar-d04-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1003:3511", name: "avatar-d05-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1003:3510", name: "avatar-d07-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1003:3509", name: "avatar-d08-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1203:14471", name: "avatar-t02-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1203:14469", name: "avatar-t04-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1203:14468", name: "avatar-t05-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1203:14467", name: "avatar-t07-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
  { nodeId: "1203:14466", name: "avatar-t08-color", format: "png", scale: 2, dir: "home", fill: true, avatarColor: true },
);

// Карты событий (cookie-consent.md): статичная картинка для состояния consent, 704×704 (2× для 350), PNG 1×.
figmaAssets.push(
  { nodeId: "1510:28488", name: "map-inkspire-print-studio", format: "png", scale: 1, dir: "events" },
  { nodeId: "1562:19208", name: "map-19015-n-creek-pkwy", format: "png", scale: 1, dir: "events" },
);

// Превью для соцсетей (docs/social-previews.md): общие картинки 1200×630, EN и RU. Подключаются в lib/seo.ts.
figmaAssets.push(
  { nodeId: "1481:11920", name: "og-default", format: "png", scale: 1, dir: "og" },
  { nodeId: "1789:17200", name: "og-default-ru", format: "png", scale: 1, dir: "og" },
);
