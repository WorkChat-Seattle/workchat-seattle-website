# WorkChat Seattle — сайт по макету Figma

Актуально на 11.11.2026. Сайт некоммерческого сообщества WorkChat Seattle (женщины-профессионалы, Seattle area, 501(c)(3), сообщество с 2018 года). Домен — https://workchatseattle.org. Верстаем по макету Figma через Figma MCP, код хранится в GitHub, деплой на Vercel. Дальше сайт тоже ведём через Claude Code.

## Документы проекта
Этот файл главный. Подробности — в дополнениях в папке `docs/`, при противоречии верен этот файл, а между дополнениями — более поздний документ.
- **decisions-2026-11-05.md** — менторы («View all mentors»), Donate, пустой Upcoming, Show more, Featured на Home, Registration closed, обложки, био команды, картинки.
- **dynamic-content.md** — события и менторы из Notion, Upcoming → Past, публикация в 4 канала. Его раздел «Открытые вопросы» закрыт решениями 05.11; раздел «Счётчик N people going» устарел — счётчика на сайте нет.
- **event-pages-sizes.md** — кадры страниц всех событий во всех размерах.
- **forms-to-notion.md** — формы: Notion + почта, выпадающие списки, тексты окон, согласия, FAQ Mentorship, Subscribe через Zeffy.
- **ru-version.md** — русская версия, таблица текстов EN/RU, стиль русских текстов. Пункт 1 раздела «Что нашла витрина» (длинные вопросы в выпадающих списках) решён — см. «Правила вёрстки», п. 8.
- **cookie-consent.md** — cookies, баннер, окно настроек, карта. Его «Открытые вопросы» закрыты: RU-тексты есть в таблице, срок хранения выбора — 12 месяцев, cookie `wc_consent`, для ЕС отдельного режима нет (см. «Cookies»).
- **privacy-policy.md** — страница Privacy Policy.
- **social-previews.md** — картинки-превью (Open Graph), включая og-event (решено 11.11).
- **seo-ai-visibility.md** — robots, sitemap, метаданные, JSON-LD, проверка.
- **animations.md** — анимации: появление при прокрутке, кнопки, ссылки, карточки, логотип, шапка, параллакс, Numbers, Find your mentor, слайдер отзывов, Our Values (закреплённый блок), FAQ. Эталон — тестовая версия, репозиторий **WorkChat-Seattle/workchat-animations-reference** на GitHub (бывший `julia-seas/workchat-v2`) (Home — `index.html`; About — `about.html`, `assets/js/about-values.js`; общие скрипты — `assets/js/site.js`; стили — `styles.css`). Параметры переносим как есть.
- **after-launch-updates.md** — правки после запуска: ветка → PR → Vercel Preview → merge, источники правок, откат, возможная GitHub Action.
- **handoff.md** — задания из чата проекта. По просьбе «прочитай handoff» выполнить **последнее** задание из этого файла и кратко дописать итог (что сделано, что решить) в раздел «Ответ» под ним.
- **figma-adaptive-handoff.md** — как устроен файл Figma (для работы в Figma, не для вёрстки).

## Стек
- **Next.js (App Router) + TypeScript**, **Tailwind CSS v4**, деплой на Vercel. Страницы — SSG/ISR, содержимое отдаётся в HTML с сервера (seo-ai-visibility.md, п. 5).
- **Языки:** EN без префикса (`/`, `/events/<slug>`), RU с префиксом `/ru` (`/ru`, `/ru/events/<slug>`), slug одинаковый. Privacy Policy только на английском. Подробности — ru-version.md.
- **Тексты интерфейса** — словари `en` / `ru`, собранные из Google-таблицы «WorkChat — тексты сайта EN/RU» (https://docs.google.com/spreadsheets/d/1pAWcR_tmgkjm55qbNIX0NstggJhiiEXS8lOj2JgQNgw/edit). У Claude Code доступа к таблице нет: её выгрузка лежит в `content/texts/*.csv` (по файлу на вкладку, правила — `content/texts/README.md`). Словари собирать скриптом из этих CSV; сами CSV руками не править. Тексты обновляются командой `npm run texts` (`scripts/fetch-texts.ts`): скачивает каждую вкладку опубликованной таблицы (CSV по gid) в `content/texts/*.csv` и пересобирает словари; файл не перезаписывается, если скачивание не удалось или пропал ключ, используемый в коде. Google обновляет опубликованную версию с задержкой до нескольких минут. В компонентах текста нет, только ключи.
- **Данные** (события, спикеры, менторы, команда, FAQ, ценности, варианты форм) — файлы `data/*.ts`; события и менторы переносятся из Notion (dynamic-content.md). Страницы событий и менторов генерируются из данных.
- **Формы** Mentorship, Volunteer, Suggest an event → свой Route Handler `app/api/forms/[form]/route.ts` → запись в Notion + письмо на workchatseattle@gmail.com через Resend, антиспам Cloudflare Turnstile + honeypot (forms-to-notion.md).
- **Subscribe** — встроенная форма Zeffy (iframe), не наш сервер.
- **Donate** — внешняя ссылка на кампанию Zeffy: https://www.zeffy.com/en-US/donation-form/support-workchat-seattle (шапка, мобильное меню, get-involved, футер). Страницы `/donate` нет.
- **События** — регистрация в Zeffy (Registration link из данных); `/`, `/events`, `/events/[slug]` — ISR `revalidate = 3600`. Все события бесплатные (решено 13.11): в Event JSON-LD `offers` с `price: 0`, `priceCurrency: USD` (константы `EVENT_PRICE`, `EVENT_PRICE_CURRENCY` в `lib/constants.ts`) и `url` = Registration link, если она есть.
- **Анимации** — без библиотек: CSS-переходы, `@keyframes`, хук `useInView` (IntersectionObserver) и общий обработчик прокрутки на `requestAnimationFrame` (animations.md).

### Правила Tailwind
1. Цвета, шрифты, размеры текста, брейкпоинты — только из токенов в `@theme` (см. «Токены»). Стандартная палитра Tailwind отключена. Произвольные значения (`bg-[#323232]`, `left-[420px]`, `text-[56px]`) запрещены; единичное исключение — только с комментарием, почему.
2. Классы из ответа Figma MCP не копировать как есть: `absolute`, `left-[…]`, `top-[…]`, фиксированные `w-[…]`/`h-[…]` у секций и текстовых блоков. Раскладка — flex / grid по сетке и отступам ниже.
3. Отступы — шкала Tailwind (`--spacing: 4px`, т. е. `p-10` = 40 px); все отступы макета кратны 4.
4. Компоненты со сложными состояниями (Values, модальные окна, мобильное меню, выпадающие списки, cookie-окно) можно писать с отдельным CSS-модулем — внутри тоже только токены (`var(--color-…)`).
5. Повторяющиеся наборы классов — в компонент, а не через `@apply` повсюду. Типографические стили — через `@utility` (см. «Типографика»).
6. Длительности и кривые анимаций — тоже токены (`--duration-*`, `--ease-*` в `@theme`), значения — из animations.md.

## Макет
- Figma fileKey: `PRALafbEv1Nz9J0GRcw7sa`, страница **Claude** (`1003:3470`).
- Компоненты — секция **Components** (`1003:7995`).
- Читать макет через `get_design_context` (fileKey + nodeId), сверять через `get_screenshot`. Ответ `get_design_context` — ориентир, а не готовый код (см. «Правила Tailwind» и «Правила вёрстки»).

### Кадры страниц (nodeId)
| Страница | Маршрут | 390 (mobile) | 768 (tablet) | 1440 (desktop) | 1920 |
|---|---|---|---|---|---|
| Home | `/` | `1110:10587` | `1203:14301` | `1003:3471` | `1198:3496` |
| About | `/about` | `1113:11016` | `1240:14904` | `1003:3944` | `1264:16782` |
| Mentorship | `/mentorship` | `1135:11286` | `1240:15215` | `1003:4997` | `1264:17023` |
| Mentor info | `/mentors/[slug]` | `1145:11990` | `1240:15965` | `1003:4640` | `1264:17634` |
| Volunteer | `/volunteer` | `1145:11767` | `1240:15704` | `1003:4794` | `1264:17395` |
| Events | `/events` | `1145:12534` | `1240:16472` | `1003:4174` | `1264:18058` |
| Events — нет предстоящих | `/events` | `1582:26100` | `1582:26137` | `1582:24736` | `1582:26177` |
| Event page (How AI…) | `/events/[slug]` | `1145:12238` | `1240:16177` | `1003:5145` | `1264:17819` |
| Privacy Policy | `/privacy-policy` | `1457:23154` | `1457:23047` | `1457:22619` | `1457:22833` |
| 404 | `app/not-found.tsx` | `1454:22443` | `1454:22422` | `1454:22166` | `1454:22294` |

- Кадры 1920 отдельно не верстаем: они показывают широкий экран — контент 1200 по центру, фоны на всю ширину.
- Страницы остальных событий (онлайн, без спикеров, прошедшие) во всех размерах — event-pages-sizes.md.
- Окно «Suggest an event» на Events: `Events / … / Suggest event` (390 `1381:13870`, 768 `1381:13914`, 1440 `1381:14032`, 1920 `1381:14148`) и `… / Thank you` (390 `1381:13901`, 768 `1381:13982`, 1440 `1381:14099`, 1920 `1381:14215`).
- Состояния форм — секция **Form states** (`1442:18556`); открытый выпадающий список — `Volunteer / help dropdown open` 1440 `1648:28105`, 390 `1648:28140`.
- Cookie-баннер и окно настроек — секция **Cookie consent** (cookie-consent.md).
- Русская версия: **Home / RU** 1440 `1648:28532`, витрина компонентов **RU / Components check** `1672:24122`.
- Превью для соцсетей: OG / Default `1481:11920`, OG / Default / RU `1789:17200`, og-event `1481:11940` (примеры EN `1795:17228`, RU `1795:17268`).

## Брейкпоинты и сетка
Mobile-first. В Tailwind: `--breakpoint-*: initial; --breakpoint-md: 768px; --breakpoint-xl: 1280px;` — классы без префикса = mobile, `md:` = tablet, `xl:` = desktop.

| Диапазон | Макет | Поля | Контент | Между секциями | Заголовок→текст |
|---|---|---|---|---|---|
| < 768 | 390 | 20 | резиновый | 80 | 20 |
| 768–1279 | 768 | 40 | резиновый, 4 колонки (172 при 768, без зазоров; направляющие 40/212/384/556/728) | 120 | 20 |
| ≥ 1280 | 1440 / 1920 | авто | `max-width: 1200px`, по центру | 160 | 20 (с 14.11, было 40) |

- **Desktop:** контейнер 1200, на 1440 поля по 120, на 1920 — по 360. Полноширинные фоны секций, subscribe и footer идут на всю ширину окна, контент внутри них — в контейнере 1200.
- **Tablet (по макету 768):**
  - заголовки и одиночные тексты начинаются со 2-й колонки (отступ 172 от контента, x=212);
  - карточки на всю ширину контента (688) с внутренними отступами 40;
  - внутри карточек две колонки 264 и 304, промежуток 40;
  - поля форм на всю ширину; подписи, согласие и кнопка формы — со 2-й колонки;
  - отдельные кнопки под блоками — со 2-й колонки, по ширине текста; «Back to all…» и «Show more» — по центру;
  - над фоном футера светлая полоса 40 (она есть в компоненте футера).
- **Mobile:**
  - внутри карточек отступы 20, текст→контент 40;
  - кнопки друг под другом через 10;
  - область нажатия ≥ 44;
  - над фоном футера полоса 40 — даёт обёртка футера, на всех страницах (включая 404 и Privacy Policy).
- **Отступ перед футером (по кадрам Figma, уточнено 12.11):** над тёмным фоном футера полоса 40 на всех размерах (на tablet и desktop она в компоненте, на mobile её даёт обёртка); на desktop и 1920 ещё 160 от get-involved до верха фото футера (фото выступает в полосу). На Mentorship 1440 в макете 400 — не повторять, разобрать на шаге Mentorship.
- **Шапка:** мобильная (бургер) на mobile и tablet, десктопная — с 1280.
  - Открытое меню — компонент `mobile-menu` (варианты `size = mobile | tablet`): ссылки About Us, Events, Mentorship, Volunteer, Donate и переключатель EN/RU.
  - Бургер — `icon/menu` с состояниями `state = closed | open`.
  - Поведение: кнопка-бургер с `aria-expanded` и `aria-controls`; при открытом меню фокус остаётся внутри, прокрутка страницы заблокирована; закрытие по Esc, по повторному нажатию и при переходе по ссылке; после закрытия фокус возвращается на бургер.
  - Переключатель EN / RU ведёт на ту же страницу на другом языке; без автоопределения языка и редиректов.
- Русские тексты длиннее английских: блоки растут по высоте, фиксированных высот у текстовых блоков нет.

## Токены
Цвета в Figma заведены переменными. В коде (`app/globals.css`):
- **примитивы** — обычные CSS-переменные в `:root` (`--gray-900`, `--neutral-600`, …), утилит для них нет;
- **семантика** — в `@theme` с префиксом `--color-` и ссылкой на примитив: Figma `bg/page` → `--color-bg-page: var(--neutral-600)`, `text/heading` → `--color-text-heading`. Классы: `bg-bg-page`, `text-text-heading`, `border-border-divider`;
- стандартные цвета Tailwind отключены (`--color-*: initial;`), чтобы в разметке были только наши токены.

**Примитивы**

| Токен | Значение | | Токен | Значение |
|---|---|---|---|---|
| gray/900 | #323232 | | neutral/900 | #d7cec8 |
| gray/700 | #4a4a4a | | neutral/800 | #dbd4ce |
| gray/500 | #565252 | | neutral/600 | #edeae6 |
| gray/300 | #857f7f | | neutral/500 | #f1eeeb |
| white | #ffffff | | neutral/400 | #f5f3f1 |
| green | #0d5a3b | | neutral/200 | #faf9f7 |
| red/600 | #a63d33 | | | |

Альфа-примитивы:
- white-alpha/90 — #ffffff 90%;
- neutral-alpha/80 — #faf9f7 80%;
- neutral-alpha/50 — #faf9f7 50%;
- dark-alpha/70 — #3a3a3a 70%;
- dark-alpha/10 — #3a3a3a 10%;
- alpha/70 — #323232 70%;
- black-alpha/50 — #121212 50%.

**Семантика**
- **Фоны:**
  - bg/page → neutral/600;
  - bg/card-neutral → neutral/400;
  - bg/card-light → neutral/200;
  - bg/card-muted → neutral/500;
  - bg/card-dark → neutral/800 (hover: bg/card-dark-hover → neutral/900);
  - bg/card-white → white;
  - bg/card-green → green;
  - bg/card-transparent → neutral-alpha/50;
  - bg/glass → neutral-alpha/80;
  - bg/inverse → gray/900;
  - bg/input → white.
- **Текст:**
  - text/heading → gray/900;
  - text/body → gray/700;
  - text/muted → gray/500;
  - text/placeholder → gray/300;
  - text/white → white;
  - text/inverse → neutral/600;
  - text/inverse-muted → neutral-alpha/50.
- **Кнопки:**
  - button/dark → gray/700 (hover: button/hover → gray/900);
  - button/white → white;
  - button/outline → gray/700;
  - button/text-light → neutral/200;
  - button/text-dark → gray/700.
- **Обводки:**
  - border/divider → neutral/800;
  - border/input-hover → neutral/800;
  - border/input-focus → gray/300.
- **Прочее:**
  - status/error → red/600;
  - decor/card-outline → white-alpha/90;
  - decor/icon → gray/300;
  - decor/accent → gray/900;
  - icon/bg → gray/700;
  - icon/glyph → white;
  - overlay/blur-light → dark-alpha/10;
  - overlay/hover-dark → black-alpha/50 (также затемнение под модальными окнами).
- **Градиенты (paint styles):**
  - bg/gradient-center — white 0% → 100% → 0%;
  - bg/gradient-bottom-neutral — #edeae6 0% → 100%;
  - bg/gradient-neutral-top — #edeae6 0% → 100%.
- Тень модальных окон и выпадающих списков — 0 8 24, 12% (в `@theme` как `--shadow-modal`).

Направление градиентов и параметры размытия (стеклянная карточка subscribe) брать из `get_design_context` конкретного узла и заводить токенами.

## Типографика
Шрифт — **Google Sans**. Лицензия SIL Open Font License 1.1 (проверено 05.11.2026): бесплатно, в том числе для встраивания на сайт. Кириллица есть — для RU шрифт не меняем.

**Подключение:**
- Только с нашего сервера через `next/font/local` (без запросов к Google — cookie-consent.md). Переменная шрифта → `--font-sans` в `@theme`.
- Файлы: вариативный шрифт (ось веса 400–700) и отдельный файл курсива, WOFF2. Источник — пакет `@fontsource-variable/google-sans` или Google Fonts (Download).
- Подмножества: latin, latin-ext, cyrillic, cyrillic-ext. Курсив нужен только для body-italic-accent (Bold Italic).
- Веса: 400, 500, 700, курсив 700. `display: 'swap'`, запасной — системный sans-serif.
- Рядом с файлами шрифта положить `OFL.txt`.

Стили заводить через `@utility` (например `@utility text-h1 { … }` с размерами для `md` и `xl` внутри), чтобы в разметке был один класс на стиль.

Размеры: font-size / line-height, letter-spacing.

| Стиль | desktop (≥1280) | tablet | mobile |
|---|---|---|---|
| h1 | 80 / 90%, −2% | 56 | 36 |
| h2 | 56 / 90%, −3% | 46 | 34 |
| h3 | 30 / 90%, −3% | 28 | 28 |
| numbers | 65 / 90%, −3% | 36 | 36 |
| button | Medium 16 / auto | Medium 18 | Medium 18 |

Общие для всех брейкпоинтов:
- body — Regular 16 / 130%;
- caption — 16 / 110%, −3%, UPPERCASE;
- feature — Medium 100%: 18 на desktop (≥1280), 20 на tablet и mobile (в Figma mobile/feature и tablet/feature);
- body-bold-accent — Bold 16 / 130%;
- body-italic-accent — Bold Italic 16 / 100%;
- button-selected — Bold 16, −2% (активный пункт меню).

У h1 и h2 в Figma включён Title Case, а сами тексты записаны обычным регистром. В коде — `text-transform: capitalize` на h1/h2 **только для `:lang(en)`**; для русского регистр как в тексте. Тексты не переписывать.

## Компоненты
Варианты в Figma задаются свойством `size = desktop | mobile | tablet`. В коде — один компонент на весь набор, адаптив через классы `md:` / `xl:`, а не три разных компонента. Набор id для `get_design_context`:
- **Базовые:**
  - button `1003:8012` (option dark/white/outlined; state default/hover; у dark есть state=disabled — opacity 50%, подписи «Sending…» и «Registration closed»);
  - button-round `1003:8025`;
  - button-vertical `1048:1439`;
  - button-social `1003:8087` (linkedin/facebook);
  - menu-button `1003:7999`;
  - Language `1003:8105`;
  - logo `1048:1421`;
  - icon `1036:1384` (type date/location/time/language);
  - icon/chevron-down `1017:1347`;
  - icon/menu `1291:5` (state closed/open);
  - avatar `1009:1302` (фото спикера в card-speaker, круглое);
  - pagination-dot `1123:2094`;
  - tag (фильтр по тегам на Events; 10 тегов — dynamic-content.md).
- **Формы:**
  - form-field `1017:1449` (text/select; default/hover/focus/filled/error);
  - form-textarea `1017:1470`;
  - checkbox-consent `1442:22081` (state unchecked/checked; в коде нативный `<input type="checkbox">` с `<label>`);
  - modal-message `1442:18126` — результат отправки формы (type success/error × size) — см. «Состояния отправки форм»;
  - modal-suggest-event `1381:13869` — окно формы «Suggest an event» (state form/sending × size);
  - выпадающие списки (одиночный выбор и чекбоксы) — по образцу `Volunteer / help dropdown open`, правила — forms-to-notion.md, «Выпадающие списки»; длинный текст — «Правила вёрстки», п. 8.
- **Раскладка:**
  - header `1084:10369`;
  - mobile-menu `1298:12443` (mobile `1297:66`, tablet `1298:12421`);
  - footer `1110:10554` (в нём ссылки Privacy Policy и «Cookie Settings» — `<button>`, открывает окно настроек cookies);
  - subscribe `1084:10472` — только state=default: наш заголовок и подпись + iframe Zeffy (см. «Subscribe»). Варианты sending / success / error устарели, не верстать;
  - get-involved `1084:10523` (+ get-involved/mobile `1084:10473`).
- **Карточки:**
  - card-square `1003:8038`;
  - card-rectangle `1003:8059`;
  - card-image `1009:1304`;
  - number-card `1075:3170`;
  - card-testimonial `1084:10455`;
  - quote-accent `1084:10527`;
  - values / value-tab `1113:10994` / `1029:1364` (см. «Блок Our Values»);
  - card-team-member `1077:3174` (state default/hover × color; био — см. ниже);
  - card-mentor `1010:1323`;
  - mentor-profile `1145:12181`;
  - card-program `1135:11285`;
  - list-item `1010:1361`;
  - faq-item / faq-toggle `1010:1354` / `1041:1384`.
- **События:**
  - card-featured-event `1084:10416`;
  - card-event `1145:12510`;
  - card-event-past `1145:12533` (в рамке `tags` один или два тега через разделитель);
  - card-speaker `1145:12237`;
  - event-detail `1034:1380`;
  - empty-state (пустой Upcoming Events — decisions-2026-11-05.md, п. 3).
- **Cookies и карта** (cookie-consent.md): toggle, cookie-banner, cookie-settings, map-embed (state loaded/consent).

### Блок Our Values (страница About)
Один интерактивный блок с вкладками. Компонент `values` (`1113:10994`) — 15 вариантов: `size = desktop | mobile | tablet` × `active = community | support | growth | empowerment | learning`. Вкладки — экземпляры `value-tab` (`1029:1364`, `state = default | active`, текстовое свойство `label`).

| `active` | Вкладка | Описание |
|---|---|---|
| community | Community & Belonging | We foster meaningful connections and build a community where every woman feels welcome, respected, and valued. |
| support | Support | We understand the unique challenges women may face in their careers. We create a safe space for honest conversations, practical help, and mutual support. |
| growth | Growth | We help women move toward their professional goals — whether they are looking for a job, changing careers, developing new skills, or advancing in their field. |
| empowerment | Empowerment | We help women build the confidence, agency, influence, and leadership skills they need to shape their own professional paths. |
| learning | Continuous Learning | We believe professional growth is an ongoing process. We encourage curiosity, knowledge-sharing, experimentation, and learning from both successes and setbacks. |

- В коде — один компонент `Values` с состоянием активной вкладки. Данные — массив `{ id }`, тексты — из словаря (EN выше, RU — вкладка About таблицы).
- **Раскладка:**
  - **desktop:** список вкладок 308 слева, описание шириной 347 от x=720 (через 600 от начала контента), заголовок блока — со 2-й колонки (x=420);
  - **tablet:** вкладки 344 слева, описание 344 справа (от x=384), заголовок — со 2-й колонки, шаг вкладок 65;
  - **mobile:** вкладки списком на всю ширину с шагом 45, описание под ними через 40.
- **Стиль вкладок:** h3. Активная — `text-white`; неактивная — `text-inverse-muted` с opacity 50%.
- **Фон** — фотография, у каждой вкладки своя, меняется при переключении. Выгрузить 5 фото скриптом картинок (п. 6 «Правил вёрстки») из вариантов desktop (`values-community.webp` … `values-learning.webp`) с фильтрами из Figma (не повторять CSS-фильтрами). `object-fit: cover`; следующее фото предзагружать.
- **Анимация (решено 11.11, по версии Юлии в workchat-v2):** блок закрепляется на экране (`position: sticky`), и ценности сменяются прокруткой страницы — шаг 60vh на ценность; фон перетекает, текст уезжает и приезжает по словам, клик по вкладке плавно прокручивает к её шагу. Параметры — animations.md, п. 11. Без движения (reduced motion) — без закрепления, переключение нажатием.
- **Доступность:** ARIA tabs (`role="tablist"`, `role="tab"` + `aria-selected`, `role="tabpanel"`), стрелки ↑/↓, видимый фокус, по умолчанию активна первая вкладка. Неактивные панели — `aria-hidden` + `inert`.
- **Все 5 панелей в HTML** (для поиска и ИИ), наложены grid в одну ячейку — так же высота не прыгает. Высоты в макете: desktop 800, tablet 605, mobile 558 (минимальная).

### Команда (card-team-member, About)
Био каждого человека (два абзаца) — в `data/team.ts`, тексты — секция Figma «Overlays» (`1633:28076`). Оверлей с био: на устройствах с мышью — по `:hover` и `:focus-within`; на телефонах и планшетах — по нажатию (`<button aria-expanded aria-controls>`), одновременно открыт один, закрытие повторным нажатием, другой карточкой или Esc. Текст био в HTML всегда, до открытия — визуально скрыт. Подробности — decisions-2026-11-05.md, п. 8.

### Менторы
- **Mentorship:** карточки `card-mentor` — LinkedIn и «View profile» → `/mentors/[slug]`. Кнопка «View all mentors» — `<button aria-expanded aria-controls>`, разворачивает остальные карточки на месте; показывать, только если менторов больше, чем видно по умолчанию (сейчас двое — кнопки нет). Скрытые карточки — в HTML (`hidden`).
- **Mentor info:** «Get connected» в `mentor-profile` — `<a href="mailto:{email}">`; показывать только при наличии email и Consent received. LinkedIn — `button-social`.
- Публикуются только карточки с Consent received; порядок — поле Order.
- Форма на Mentorship — для тех, кто хочет **стать ментором**; у секции `id="mentor-form"` и `scroll-margin-top` под шапку.

### События
Логика — dynamic-content.md и decisions-2026-11-05.md:
- Прошло ли событие — по времени окончания в `America/Los_Angeles`. Upcoming — ближайшие сверху, Past — последние сверху, у Past фильтр по тегам.
- **Featured на Home:** ближайшее предстоящее, если нет — последнее прошедшее (docs/decisions-2026-11-05.md, п. 5; подтверждено 12.11). Кнопки «Details» (dark) → `/events/[slug]` и «See all events» (outlined) → `/events`.
- **Пустой Upcoming:** блок empty-state + кнопка «Suggest an event».
- **Past Events:** кнопка карточки → `/events/[slug]`; «Video recording» — внешняя ссылка из Recording link (только если есть). «Show more» — `<button>`, по 10 событий; показывать, только если прошедших больше 10; после подгрузки фокус на первую новую карточку.
- **Event page:** онлайн-событие — без блока Location; без спикеров — без Speakers. Счётчика участников («N people going») и аватаров участников нет — убраны из макета (проверено 11.11 на всех 20 кадрах; аватары на странице — только фото спикеров). У прошедшего события обе Register — `<button disabled>Registration closed</button>`, Share активна; клиентский компонент переключает Register в момент окончания.
- **Карта (офлайн-события):** интерактивная Google Maps (JS API) по адресу, по умолчанию включена; если Embedded content выключен или есть GPC — статичная картинка с нашего сервера + «Show map» (cookie-consent.md). Ссылка «открыть в Google Maps» — из поля Google Maps link.

### Состояния отправки форм (Mentorship, Volunteer, Suggest an event)
Примеры — секция **Form states** (`1442:18556`). Subscribe — форма Zeffy, свои состояния показывает сама.
- **Sending:** кнопка отправки — `button` option=dark, state=disabled, «Sending…»; `disabled` + `aria-busy`; поля не очищаются. У Suggest an event — `modal-suggest-event` state=sending.
- **Success и Error — модальное окно `modal-message`** (`1442:18126`, `type = success | error` × `size`):
  - затемнение `overlay/hover-dark` (desktop, tablet), окно по центру: desktop 680 (мин. высота 388), tablet 640 (мин. 378); на mobile — во весь экран без затемнения;
  - фон `bg/card-neutral`, тень модальных окон; крестик, иконка 64, заголовок (h2 по размеру), текст (body), кнопка «Close» (outlined);
  - success — зелёная `icon-success`; error — `icon-error` цвета `status/error`;
  - у Suggest an event результат заменяет окно формы;
  - после ошибки данные в полях сохраняются, кнопка снова активна;
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; фокус внутри окна; прокрутка заблокирована; закрытие по крестику, «Close», Esc и клику по затемнению; после закрытия фокус на кнопку отправки (после успеха — на начало формы).
- Ошибки полей — `form-field` / `form-textarea` state=error, текст «This field is required» и т. п. под полем, **в потоке**: он не налезает на следующее поле.
- **Тексты (итоговые; RU — вкладка «Общее» таблицы):**
  - Mentorship и Volunteer success: «Thank You!» / «We’ve received your information and will get back to you within 3 business days with the next steps.»
  - Suggest an event success: «Thank You!» / «We’ve received your suggestion. Our team will review it and may reach out to you by email.»
  - Error: «Something went wrong» / «We couldn't send your form. Please try again in a few minutes. If the problem continues, email us at workchatseattle@gmail.com.» (Suggest an event — «We couldn't send your suggestion. …»). Адрес — ссылка `mailto:`, берётся из константы `FORMS_TO_EMAIL`.
- Кнопки отправки форм ментора и волонтёра: EN «Submit», RU «Отправить заявку».
- «Privacy Policy» внутри текстов согласия, под Subscribe и в cookie-окне — подчёркнутая ссылка `/privacy-policy`; в согласии — внутри `<label>` чекбокса.
- Данные в полях на примерах (Anna Petrova и т. д.) — только для макета.

### Subscribe
`subscribe` (`1084:10472`): наш заголовок и подзаголовок, внутри контейнер `zeffy-embed` (фон #EDEAE6 — токен, без скругления, отступы сверху/снизу 40) с кодом:
`<div data-zeffy-embed data-form-url="/en-US/embed/newsletter-form/stay-connected-36">` + `<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js">`.
Под формой наша подпись: «By clicking the "Submit" button, you agree to the terms of our Privacy Policy.» Внутри iframe ничего не настраивается, он только на английском. Подробности раскладки — forms-to-notion.md.

### Resource Hub на Home
Resource Hub скрыт флагом `SHOW_RESOURCE_HUB` (`lib/constants.ts`) до готовности контента; при возврате — решить, куда ведут кнопки карточек (`data/resources.ts`). Код, картинки и тексты сохранены; пока флаг выключен, секция не рендерится (в HTML ничего нет), у Find your mentor отступ сверху как у обычной секции.

### Страница 404
Шутка «у страницы перерыв на кофе». `app/global-not-found.tsx` (`experimental.globalNotFound` в `next.config.ts`; обычный `not-found.tsx` при корневом layout с сегментом `[lang]` не подходит — Next показывает свою оболочку), статус 404, `robots: { index: false }`. Язык берётся из пути: `proxy.ts` кладёт его в заголовок `x-pathname`; страница ловит и несуществующие адреса, и `notFound()` внутри страниц. Общая рамка (skip-ссылка, шапка, футер) — `components/layout/site-chrome.tsx`, блок — `not-found-block.tsx`.
- **Состав:** header → блок `not-found` → footer (без subscribe и get-involved).
- **Блок `not-found`** собран как card-featured-event: карточка с текстом (`bg/card-neutral`) + фото, без скруглений.
  - **desktop:** 1200×600 по центру, 148 от верха. Слева карточка 600 с отступами 80, текст по центру по вертикали; справа фото 600×600. До футера 160.
  - **tablet:** карточка 688: сверху фото 688×460, ниже текст с отступами 40. Сверху 60, снизу 120.
  - **mobile:** сверху фото 350×350, ниже текст с отступами 20, кнопка на всю ширину. Сверху 40, снизу 80.
  - Внутри текста: метка → заголовок → описание через 20, текст → кнопка 40.
- **Тексты (EN; RU — вкладка 404, заголовок «Страничка ушла на повышение»):** метка «Error 404»; заголовок «Looks like this page is on a coffee break» — `h1`, стиль h2 по размеру; описание «We've sent someone to find it.» `<br>` «Why don't you take a little break too?»; кнопка `button` dark «Back to Homepage» — `<a href="/">`.
- **Фото:** выгрузить из кадров 404 (`404-coffee-desktop.webp`, `-tablet`, `-mobile`), разная обрезка, переключать через `<picture>` по брейкпоинтам; декоративное, `alt=""`.

### Страница Privacy Policy
`/privacy-policy`, только на английском (из RU ведёт сюда же). header → intro (`h1` стиля h2, «Effective date: …», вводный текст) → 13 разделов на `faq-item` (кнопка с `aria-expanded` и анимацией высоты, как FAQ — animations.md, п. 12; первый раздел открыт) → блок контактов (раздел 14) → footer. Источник текста — `content/texts/privacy-policy.md` (выгрузка Google Doc), из него `npm run privacy:build` собирает `data/privacy-policy.ts`; раскладка и ссылки — privacy-policy.md. Заголовок h1 — «Privacy Policy» (как в Figma, задан в `scripts/build-privacy.ts`), контакты — раздел 14 «Organization Information and Contact Details».

### Cookies
Баннер, окно настроек, категории и Consent Mode для GA4 — cookie-consent.md. Кратко: Necessary всегда; Analytics (GA4) и Embedded content (карта) включены по умолчанию, можно выключить; Hotjar — только после согласия (пока не подключаем, баннер type=notice); GPC выключает всё опциональное. Тексты RU — вкладка «Общее». Выбор хранится в first-party cookie `wc_consent` 12 месяцев.
- **Посетители из ЕС (решено 11.11):** отдельного режима (opt-in по GDPR, определение страны) **не делаем** — одна модель для всех. Через пару месяцев после запуска посмотреть в GA4 долю посетителей из ЕС и вернуться к вопросу, если она заметная.

### SEO и превью
- robots, sitemap, метаданные, hreflang, JSON-LD (NGO + WebSite, Event, ProfilePage) — seo-ai-visibility.md; title / description — вкладка SEO таблицы.
- Картинки-превью: общая EN (`app/opengraph-image.png`), общая RU, генерируемые для событий EN и RU по шаблону og-event (логотип высотой 60, название, краткое описание, дата / время / место) — social-previews.md.

## Правила вёрстки
1. **Не переносить абсолютные координаты.** Секции десктопа в Figma собраны без auto-layout, MCP отдаёт `position: absolute` и x/y. Раскладку строить flex/grid по сетке и отступам выше, координаты — только чтобы понять порядок и выравнивание.
2. **Порядок работы:**
   1. проект Next.js + Tailwind v4: токены, брейкпоинты, шрифт, типографика;
   2. словари `en` / `ru` из таблицы текстов, маршрутизация EN и `/ru`;
   3. базовые компоненты;
   4. раскладка: header с мобильным меню, footer, subscribe (Zeffy), get-involved;
   5. страницы по одной, начиная с Home (сначала EN, потом проверка RU), затем 404 и Privacy Policy — в статике, без анимаций;
   6. события и менторы из файлов данных (логика Upcoming/Past, Featured, Registration closed);
   7. анимации по animations.md (отдельным проходом, когда страницы совпали с макетом);
   8. формы: клиент (валидация, выпадающие списки, состояния), затем сервер (Notion, Resend, Turnstile);
   9. cookies и карта;
   10. SEO, превью, JSON-LD;
   11. проверка (п. 3 и seo-ai-visibility.md, п. 8).
3. На каждой странице сверять 390, 768, 1440 и 1920 со скриншотами кадров и промежуточные ширины 360, 430, 1024, 1280 — на обоих языках.
4. Семантическая разметка: один h1 на страницу, `<nav>`, `<main>`, `<footer>`, `<button>` для действий, `<a href>` для переходов (без переходов через `onClick`), `<label>` у полей, `lang` у `<html>` (`en` / `ru`), skip link. FAQ и разделы Privacy Policy — кнопка с `aria-expanded` (не `<details>`, чтобы анимировать высоту); ответы в HTML и в свёрнутом виде (закрытый — `inert`).
5. Состояния из вариантов (hover, focus, active, error, expanded, disabled) реализовать все. Focus виден с клавиатуры. Все анимации выключаются при `prefers-reduced-motion: reduce`.
6. **Картинки** (все проверены и одобрены 06.11 — брать из Figma как есть):
   - **выгрузка — скриптом, а не по одной** (решено 11.11): `npm run export:figma` (`scripts/export-figma.ts`) через Figma REST API (`GET /v1/images/:file_key`). Список картинок — в `scripts/figma-assets.ts`: `{ nodeId, name, format: 'jpg' | 'png' | 'svg', scale, dir }`. Узлы рендерятся как в макете — с обрезкой и фильтрами (ч/б и затемнение у фото Our Values и т. п.), CSS-фильтрами не повторять. Фото — **JPG 2×** (кадр 1440 → 2880 px по ширине; PNG — только там, где нужна прозрачность); логотип и иконки — SVG, затем SVGO. Оригиналы — в `design-assets/` (вне `public`, в git), файлы для сайта — копии с осмысленными именами в `public/images/`. Повторный запуск перезаписывает файлы: заменили картинку в Figma — одна команда. Список пополняется постранично (начать с Home). Токен — `FIGMA_TOKEN` (личный токен Юлии, только чтение `file_content:read`) в `.env.local`; `.env.local` — в `.gitignore`, в Vercel токен не нужен. Запросы к API — пачками по нескольку узлов, при ответе 429 подождать и повторить. Для разовой картинки можно и `download_assets` из Figma MCP, но затем добавить её в список скрипта;
   - оригиналы хранить вне `public`, в `public/images` — только то, что идёт на сайт, имена в kebab-case;
   - сжимать один раз — через `next/image` (WebP/AVIF);
   - у каждой `next/image` задавать `sizes`; у hero — `priority`, остальное лениво;
   - полноширинные фоны — до ~2560–3000 px по ширине, карточки — 2× от размера в макете;
   - у каждой содержательной картинки — alt;
   - логотип и иконки — SVG через SVGO, цвет через `currentColor`;
   - круглые фото (mentor-profile, card-mentor, card-speaker, аватары) — квадратные файлы, в CSS `aspect-ratio: 1; border-radius: 50%; object-fit: cover`;
   - фото hero на десктопе отражено по горизонтали — так и задумано, отражение уже в файле;
   - обложка #IAmRemarkable — картинка 1402×1122 из узла `1602:27169`.
7. **Тексты:** источник истины — таблица EN/RU (вычитана полностью 10–11.11). Если текст в таблице отличается от макета — верна таблица. Ничего не придумывать; если в таблице нет нужной строки — не сочинять, а записать в «Открытые вопросы». Строки со статусом «Вычитано» не переписывать. Русские тексты: кавычки «ёлочки», неразрывный пробел перед тире, даты «Среда, 18 ноября 2026», время 24 часа (стиль — ru-version.md).
8. **Длинный текст в выпадающих списках** (решено 11.11, оба языка, все ширины, проблема заметна на 350): в закрытом поле и вопрос (он стоит вместо плейсхолдера), и выбранное значение **переносятся по словам на две строки**, поле растёт по высоте, стрелка остаётся по центру по вертикали. Многоточие (`text-overflow: ellipsis`) не использовать; вопрос не переносить в подпись над полем. Если текст не помещается и в две строки — пусть занимает больше строк, ничего не обрезать. Варианты в открытом списке тоже переносятся по словам. У списков с чекбоксами в закрытом поле — выбранные через запятую, а если не помещаются в две строки — «N selected» (forms-to-notion.md).

## Переменные окружения (Vercel)
`NEXT_PUBLIC_SITE_URL` (= https://workchatseattle.org), `NOTION_TOKEN`, `NOTION_DS_EVENT_LISTINGS`, `NOTION_DS_SPEAKERS`, `NOTION_DS_MENTOR_CARDS`, `NOTION_DS_VOLUNTEERS`, `NOTION_DS_EVENT_SUGGESTIONS`, `RESEND_API_KEY`, `FORMS_TO_EMAIL` (= workchatseattle@gmail.com), `FORMS_FROM_EMAIL` (адрес на подтверждённом домене, например forms@workchatseattle.org), `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (ограничить по домену), `NEXT_PUBLIC_GA_ID`.
Только локально (`.env.local`, не в Vercel и не в git): `FIGMA_TOKEN` — для скрипта выгрузки картинок.
С 16.11 в `.env.local` настоящие ключи Turnstile, GA4 и Resend (`FORMS_FROM_EMAIL=onboarding@resend.dev` — тестовый адрес Resend); задать их же в Vercel.

## Статус на 16.11 (шаг 11, часть 2: ключи, письма, CSP; ниже — сессия 13.11 «SEO и превью»)
Работа идёт по «Порядку работы» (раздел «Правила вёрстки», п. 2). Всё ниже закоммичено и отправлено в `origin/main`; сборка и lint проходят. Новая сессия: прочитать этот раздел, затем «Открытые вопросы».

### Что готово
- **Шаги 1–4.** Проект, токены, шрифт, типографика; словари EN/RU из CSV и маршрутизация (`/`, `/ru`); базовые компоненты (`components/ui/`); header с мобильным меню, footer, Subscribe (Zeffy), Get Involved (`components/layout/`, `components/sections/`).
- **Шаг 5 (страницы, статика, без анимаций):** Home (hero, what-we-do, numbers, community, find mentor, subscribe, testimonials со слайдером, get-involved; Featured добавлен в шаге 6, Resource Hub скрыт флагом), 404, Privacy Policy, About, Mentorship, Volunteer. Формы — шаг 8 (ниже).
- **Шаг 8 (формы, 13.11):** Become a mentor, Volunteer, Suggest an event — клиент и сервер (Notion, Turnstile, honeypot; Resend — код готов, отключён флагом). См. «Формы — как устроено».
- **Шаг 6 (события и менторы готовы):** данные из Notion (5 событий, спикеры с Consent received, все обложки и фото на месте), `/events` (Upcoming, пустое состояние, Past с фильтром по тегам и «Show more»), Featured на Home, `/events/[slug]` (спикеры, Register с клиентским переключением, Share, Recording link, RU с запасным EN). Компоненты — `components/events/`. **Менторы (13.11):** `npm run sync:mentors` → `data/mentors.ts` и фото в `public/images/mentors/`; блок «Meet our mentors» на Mentorship (`components/mentorship/mentors-section.tsx`, `mentor-card.tsx`, клиентский `mentor-list.tsx` с «View all mentors» — только если менторов больше `MENTORS_VISIBLE` = 2 из `lib/mentors.ts`); страница `/mentors/[slug]` (EN и RU, `mentor-profile.tsx`, «Get connected» — только при email).

### Команды
- `npm run texts` — скачать тексты из опубликованной Google-таблицы в `content/texts/*.csv` и пересобрать словари (`npm run texts -- home` — одна вкладка; Google обновляет публикацию с задержкой). `npm run texts:build` — только словари.
- `npm run export:figma` — картинки из Figma по `scripts/figma-assets.ts` (`-- имя1 имя2` — выборочно; передавать имена списком, не через `$names` в zsh). Поле `fill: true` — исходная заливка узла (для скрытых и обрезанных узлов, с запеканием exposure / saturation и STRETCH-обрезки).
- `npm run favicon:build` — favicon из `design-assets/favicon/` (выгрузка `npm run export:figma -- favicon-16 favicon-32 favicon-48 apple-icon-180 icon-192 icon-512`, секция Figma «Favicon» `1474:27269`, favicon — кадр `1969:16474`, замена от 16.11) → `app/favicon.ico` (16/32/48), `app/icon.svg` (тёмный квадрат — виден в светлой и тёмной теме), `app/apple-icon.png` (180). icon-192 / icon-512 выгружены на будущее (manifest не подключён).
- `npm run privacy:build` — `content/texts/privacy-policy.md` → `data/privacy-policy.ts`.
- `npm run sync:events` — Notion → `data/events.ts` и фото в `public/images/events/`.
- `npm run sync:mentors` — Notion (Mentor cards: Ready/Published + Consent received, порядок Order) → `data/mentors.ts` и фото в `public/images/mentors/`; в конце сводка, чего не хватает (размер фото, Bio RU, LinkedIn…).
- `scripts/export-notion-upload.ts` — разовая выгрузка оригиналов для загрузки в Notion (`design-assets/notion-upload/`, в git не идёт).
- Токены и id баз — `.env.local` (`FIGMA_TOKEN`, `NOTION_TOKEN`, пять `NOTION_DS_*`); файл не открывать и не выводить.

### Остановились здесь — начинать отсюда
**Ручная проверка desktop, порция 1 (13.11) — что устроено теперь:**
- **Шрифт:** в `app/fonts.ts` у переменных шрифта `fallback: []`; запасные только в `--font-sans`. Иначе первая переменная заканчивалась на `system-ui`, и кириллица брала системный шрифт.
- **Карточки-ссылки:** `components/ui/card-link-overlay.tsx` — невидимая ссылка на всю карточку (`aria-hidden`, `tabIndex=-1`); настоящая ссылка внутри остаётся для фокуса и скринридера. Растягивать ссылку через `::after` нельзя: на hover она масштабируется (`transform`), и область сужается до текста.
- **Круглые фото:** `components/ui/ring-photo.tsx` — фото фоном элемента под полупрозрачным кольцом (`background-origin/clip: border-box`), как в v2 и Figma. Используют `Avatar`, профиль ментора, слайдер отзывов. Аватары Find your mentor — PNG из Figma с кольцом внутри файла.
- **Текстовая ссылка в абзаце:** `@utility text-link` (Medium, полоска на hover бежит слева направо, уходит вправо); на desktop — Privacy Policy в формах и под Subscribe (`xl:text-link`), ниже xl пока подчёркивание.
- **Subscribe / Zeffy:** скрипт Zeffy красит наш блок inline (белый фон, радиус 16, max-width 600) — в `globals.css` перекрыто `!important`; на desktop блок шире на `--zeffy-inset` (24px, внутренний отступ формы Zeffy) с каждой стороны, чтобы «Stay connected» стоял по линии текста. Внутри iframe ничего не меняется. Mobile и tablet не подгонялись.
- **Слайдер отзывов:** листание по кругу в обе стороны (перестановка карточки через CSS `order` на время перехода), размыты только уходящая и приходящая карточки, после свайпа резкость возвращается за 250 ms; стрелки — `scale(1.2)` 350 ms, цвет круга не меняется (v2); ← / → с клавиатуры. Свайп пальцем на краях по-прежнему упирается (нативная прокрутка).
- **Share:** системное окно только на устройствах с касанием; на компьютере копирует адрес и пишет «Link copied».
- **Our Team:** плашка био выезжает снизу (`translateY`, `--duration-team-bio` 400 ms). **FAQ:** hover на всю строку, включая раскрытый ответ.

**Заголовки безопасности (13.11):** `next.config.ts` — X-Content-Type-Options, Referrer-Policy, X-Frame-Options (SAMEORIGIN), Permissions-Policy и **Content-Security-Policy** (боевой с 16.11; с 13.11 до этого — Report-Only) (Zeffy, GA4, Google Maps, Turnstile; картинки Notion на сайте не грузятся — копируются в `public/images`). Проход Home / событие / форма / окно cookies пройден 16.11 без нарушений; карту перепроверить при подключении ключа Google Maps, а всё сразу — ещё раз на боевом домене. Префетч `/privacy-policy?_rsc=` давал 404 из-за `dynamicParams = false` на странице — убрано (`/ru/privacy-policy` по-прежнему 404 через `notFound()`).
**Шаг 11, часть 2 (16.11, локально на `npm run build && npm start`, Vercel недоступен) сделана:**
- **Индексация по адресу:** `isIndexableHost` (`lib/seo.ts`) — открыто только на `workchatseattle.org`. `app/robots.ts` динамический (Host / X-Forwarded-Host), `proxy.ts` ставит `X-Robots-Tag: noindex, nofollow` на всё остальное (localhost, www, *.vercel.app). `VERCEL_ENV` больше не используется. Проверено подменой Host.
- **Формы с настоящим Turnstile** (в `.env.local` настоящие ключи): Mentor, Volunteer, Suggest — ответ 200, записи в Notion созданы (в имени «TEST»; у Suggest 4 записи «TEST … suggestion», удалить вручную). `SEND_FORM_EMAILS = true`, `FORMS_FROM_EMAIL = onboarding@resend.dev` (Resend шлёт только на workchatseattle@gmail.com); ошибок Resend в логе нет, приход писем подтверждает Юлия.
- **Боевой CSP включён** (`Content-Security-Policy` вместо Report-Only, `next.config.ts`): проход Home, событие, Mentorship с формой, окно cookies, отправка формы — нарушений нет (перехват проверен «канарейкой»). Карту не проверяли.
- **Окно настроек cookies:** ловушка фокуса (28 Tab / Shift+Tab — фокус не выходит), Esc закрывает, фокус возвращается на кнопку футера. **GPC:** баннера нет, GA не грузится, `_ga*` нет. **GA4 (код):** на тестовой сборке с подставным ID скрипт грузится, `_ga*` ставятся, выключение Analytics + Save удаляет `_ga*` и сбор прекращается.
- **GA4 не работает с ключом из `.env.local`:** в сборку `NEXT_PUBLIC_GA_ID` не попал (в бандле нет ID вида `G-…`). Проверить имя переменной и значение в `.env.local`, пересобрать.
**Шаг 11, часть 1 (13.11, без ключей и публичного адреса) сделана.** Проверено на `next start` с `VERCEL_ENV=production`: 25 адресов sitemap — 200, у каждого title, description, canonical, hreflang (кроме Privacy — только EN), один h1, JSON-LD (Event с `offers`: `price: 0`, USD, url регистрации); 404 на `/nope`, `/ru/nope`, `/ru/privacy-policy`; нет битых внутренних ссылок и картинок без alt; текст FAQ в HTML без JS; нет горизонтальной прокрутки на 360–1920 (EN и RU, 10 страниц); клиентские переходы и переключатель языка работают; формы API (404 / 422 / honeypot). **Найдено и исправлено:** при сборке `usePathname()` отдавал `/en/...`, из-за чего переключатель на английских страницах вёл на `/ru/en/...` (404); на Privacy Policy RU-кнопка теперь ведёт на `/ru`. Осталось: ручная проверка в Safari / на iPhone (чек-лист у Юлии), ключи Turnstile / GA4 / Maps / Resend, превью-деплой, Rich Results Test, редиректы.

Шаг 10 (SEO, превью, JSON-LD) закончен — см. «SEO и превью — как устроено» ниже; дальше **шаг 11 (проверка)** по «Правилам вёрстки», п. 3 и seo-ai-visibility.md, п. 8 (+ ключи и письма из «Открытых вопросов»). Шаг 9 (cookies и карта) закончен — см. «Cookies и карта — как устроено». Шаг 8 (формы) закончен: Mentorship, Volunteer, Suggest an event работают от клиента до Notion; письма Resend — код готов, отправка выключена флагом (см. «Открытые вопросы»). Дальше шаги 10 и 11 (проверка; вживую посмотреть движение и включить reduced motion в системе; формы — проверить на реальных ключах Turnstile и с письмами).

### Формы — как устроено (сессия 13.11, шаг 8)
- **Данные и проверка** — `data/forms.ts`: списки вариантов (темы, время, формат, «чем помочь» с короткими значениями Notion), лимиты, `parseForm(kind, raw)` — один и тот же код на клиенте (подсветка полей) и на сервере. Обязательны: имя, email, выпадающие списки, согласие; необязательны: LinkedIn (ментор, волонтёр), Event link (Suggest), Notes (Volunteer). Тексты ошибок: `form.required`, `form.invalidEmail|invalidUrl|tooLong` (в таблице, вкладка «Общее»).
- **Клиент** — `components/forms/`: `checkbox.tsx` (нативный input + SVG галочки из Figma), `text-field.tsx` (TextField / TextArea / FieldError; плейсхолдер = вопрос + `sr-only` label), `select-field.tsx` (single = `role="listbox"`, multi = чекбоксы в `role="group"`; перенос по словам, «N selected» при > 2 строк, Esc на document, клик вне, лимит `max` через `aria-disabled`), `dialog.tsx` (`Dialog` в портале на `body` — иначе transform анимации появления ломает `fixed`; `MessageDialog` success / error), `turnstile.tsx` (невидимый виджет, грузится при первом фокусе в форме; ручка `prepare/getToken/reset`), `form-parts.tsx` (Honeypot, SubmitButton, consentText, `postForm`), `labels.ts` (`formLabels(t)` — подмножество словаря для клиента; вызывать на сервере). Формы: `mentor-form.tsx`, `volunteer-form.tsx`, `suggest-event.tsx` (кнопка + окно). Подключены на страницах через `children` секций; Suggest — вместо кнопки в `UpcomingEvents` (флаг `SHOW_SUGGEST_EVENT` теперь `true`).
- **Поведение:** «Sending…» = `disabled` + `aria-busy`; после успеха форма очищается, фокус на `<form>` (у Suggest — на кнопку); после ошибки данные остаются, фокус на кнопку отправки (у Suggest ошибка возвращает окно с формой). Ссылка «please also fill out the mentor form» в варианте Mentor — новая вкладка, `/mentorship#mentor-form` (с `/ru` для RU).
- **Сервер** — `app/api/forms/[form]/route.ts` (`mentor | volunteer | suggest-event`): honeypot (поле `website`, молча «успех») → `parseForm` (422) → Turnstile (`lib/forms/turnstile.ts`, 403) → Notion (`lib/forms/notion.ts`) → письмо (`lib/forms/email.ts`). Запись в Notion = успех; ошибка письма только в лог. Mentor: Mentor card (Draft, Source = Website form) + Volunteers (запись по Email: есть — добавляются Skills «Mentor» и связь, остальное не трогаем; нет — создаётся) + двусторонняя связь. Volunteer: поиск по Email, Skills объединяются, Notes дописываются, Status и Time не трогаем. Suggest: заголовок записи — домен из Event link, иначе первые 8 слов описания.
- **`next.config.ts`:** rewrite на `/en/…` исключает `/api` (динамический `app/api/forms/[form]` проверяется после `afterFiles`, иначе отдавал 404).
- **Проверено** (headless Chrome по DevTools, 1440 и 390, EN и RU-ссылка): пустая отправка и фокус на первом поле, лимит 5 тем, «Other» с текстовым полем, listbox с клавиатуры, Esc, «Sending…», окна success / error (fetch подменён), Tab не выходит из окна, фокус после закрытия, данные сохраняются после ошибки; API: 404 на неизвестную форму, 422, honeypot, 403 без токена, запись в три базы Notion. Не проверено: реальные Turnstile-ключи, отправка писем, Safari / мобильные устройства вживую.
- **Тестовые записи в Notion** — в имени «TEST» (у Suggest заголовок по домену, «TEST» в Submitted by); удаляет Юлия вручную.

### SEO и превью — как устроено (сессия 13.11, шаг 10)
- **Метаданные** — `lib/seo.ts`: `SITE_URL` (из `NEXT_PUBLIC_SITE_URL`), `pageMetadata()` / `staticPageMetadata()` (title, description, canonical, hreflang en / ru / x-default, Open Graph, Twitter `summary_large_image`), `fillTemplate`, `clip`. Title берётся из вкладки SEO **как есть** (в нём уже есть «— WorkChat Seattle»), поэтому шаблон `%s | WorkChat Seattle` из seo-ai-visibility.md, п. 4 не используется — иначе имя повторилось бы. Корневой layout задаёт `metadataBase`. Событие: title по `seo.event.title`, description = Short description (RU — RU); ментор: `seo.mentor.title`, description = начало Bio (155 знаков по границе слова). Privacy Policy — только EN, без hreflang; 404 — `noindex`, title по языку из пути.
- **robots и sitemap** — `app/robots.ts` (динамический; с 16.11 по адресу: на `workchatseattle.org` всё разрешено, кроме `/api/`, на остальных `Disallow: /`; страницам там же `X-Robots-Tag: noindex` из `proxy.ts`), `app/sitemap.ts` (EN и RU с hreflang, Privacy только EN, события и менторы из данных; `lastModified` только у статичных страниц — у записей Notion времени изменения в данных нет).
- **JSON-LD** — `components/seo/json-ld.tsx`, `lib/json-ld.ts`: NGO + WebSite в корневом layout, Event на страницах событий (EN и RU; очное — Place с PostalAddress и geo, онлайн — VirtualLocation, гибрид — оба; performer, offers только у предстоящих с Registration link, без price), ProfilePage + Person у менторов. Логотип для Organization — `app/logo.png/route.tsx` (квадрат 512, генерируется при сборке). FAQPage и BreadcrumbList не размечаем.
- **Превью** — общие: `public/images/og/og-default.png` и `og-default-ru.png` (кадры Figma `1481:11920`, `1789:17200`, выгрузка `npm run export:figma`), подключены в `pageMetadata` явно (вместо `app/opengraph-image.png` из social-previews.md — один механизм на оба языка). События: `app/og/event/[lang]/[slug]/image.png/route.tsx` (`ImageResponse`, статика на сборке, раскладка og-event, правило «не помещается → название 44 → описание 20» по оценке числа строк); шрифт — подмножество Google Sans Regular (TTF, latin + cyrillic, без GSUB — satori не читает его extension-таблицы) в `app/fonts/GoogleSans-Regular-og.ttf`. Маршрут вынесен из `[lang]`, а `/og` исключён из rewrite в `next.config.ts` (иначе уходит в `/en/og/…`). Время на картинке — как на сайте («6:30 PM - 8:30 PM PT»), место — Place name, иначе город / «Online».
- **Проверено** (`next start`, индексация закрыта подменой Host (с 16.11 по адресу)): robots, sitemap (25 адресов), метаданные и JSON-LD на Home EN / RU, событии, менторе RU, Privacy, 404; OG событий EN и RU визуально. Не проверено: Rich Results Test / validator.schema.org (нужен публичный адрес), превью в соцсетях, `VERCEL_ENV` на Vercel, редиректы www / vercel.app.

### Cookies и карта — как устроено (сессия 13.11, шаг 9)
- **Выбор** — `lib/consent.ts` (клиентский): cookie `wc_consent` (`{v, t, analytics, embedded}`, 12 месяцев, `CONSENT_VERSION` = 1 — при смене списка сервисов поднять), хранилище на `useSyncExternalStore` (`useConsent()`, `saveConsent()`, `openCookieSettings()`). Без выбора Analytics и Embedded включены; GPC — выключены и баннера нет; явный выбор сильнее GPC (так работает «Show map»).
- **Баннер и окно** — `components/consent/`: `consent-manager.tsx` (в `SiteChrome`: баннер notice до первого выбора, открытие окна по событию `wc:cookie-settings`, возврат фокуса на кнопку-открывашку), `cookie-settings.tsx` (тот же `Dialog`, что у форм; переключатели — `role="switch"`, строка целиком — область нажатия), `toggle.tsx`, `cookie-settings-button.tsx` (футер), `labels.ts` (подмножество словаря `cookie.*`). Hotjar не подключён: категории session replay и баннера with-replay в коде нет — добавить вместе с подключением (+ тексты в таблицу, переписать текст баннера).
- **GA4** — `analytics.tsx` (Consent Mode v2): скрипт грузится только при включённой Analytics, `ad_*` denied; выключение ставит `ga-disable-<ID>` и удаляет `_ga*`. Без `NEXT_PUBLIC_GA_ID` ничего не делает.
- **Карта** — `components/events/event-map.tsx` в блоке Location страницы события: из HTML — статичная картинка (`lib/event-maps.ts`, ключ — Place name; `map-inkspire-print-studio.png`, `map-19015-n-creek-pkwy.png` из Figma, список скрипта картинок), после загрузки при включённом Embedded content и наличии ключа — интерактивная Google Maps (JS API, только Maps JavaScript API — координаты `lat` / `lng` лежат в данных события и считаются при `npm run sync:events`: прежние при том же адресе → Google Geocoding (`GOOGLE_MAPS_SERVER_KEY` в `.env.local`) → Nominatim без ключа, свой User-Agent, не чаще 1 запроса/с; ищем только по Address (строки → запятые, при неудаче без suite / Ste / скобок), Place name в поиск не уходит; не нашлись — null и заметное предупреждение, как и для In person / Hybrid с пустым Address; в сводке для новых координат — источник и ссылка Google Maps для проверки; ручных полей координат нет), маркер. При выключенном Embedded content — заглушка «The map is provided by Google…» + «Show map» (только если карту вообще можно показать). Нет ключа или координат: есть картинка — только она, нет картинки — блока карты нет (адрес и «Open in Google Maps» рядом). Для нового места: кадр `map / …` в Figma, строка в `figma-assets.ts` и `lib/event-maps.ts`.
- **Проверено** (headless Chrome, 1440 и 390, EN и RU): баннер, «Sure!»/окно/Save пишут cookie и скрывают баннер, заглушка карты и «Show map», окно на mobile. Не проверено: настоящий GA4 и Google Maps (нет ключей), GPC, Esc и ловушка фокуса в окне настроек вживую.

### Анимации — как устроено (сессия 13.11)
- **Общее:** класс `js` на `<html>` ставит inline-скрипт, который стоит **первым в `<body>`** `app/[lang]/layout.tsx` и добавлен через `dangerouslySetInnerHTML` скрытого `<div>` (только без reduced motion; через 3 с без гидрации класс снимается). В серверном HTML это обычный `<script>`: браузер выполняет его при разборе до отрисовки, без мигания. При переключении EN / RU корневой layout рисуется на клиенте заново, `<html>` новый и без `js`, скрипт повторно не выполняется — класс возвращает `useLayoutEffect` в `components/layout/reveal-controller.tsx` (до отрисовки, без reduced motion). **`<script>` в `<head>` корневого layout (и `next/script`) ставить нельзя** — React 19 на клиенте выдаёт ошибку «Encountered a script tag while rendering React component». Без `js` ничего не скрывается и не закрепляется. Один общий обработчик прокрутки на rAF — `lib/scroll-loop.ts` (`subscribeScroll`, `cssNumber`); числа берутся из токенов `@theme` в `globals.css`.
- **Появление (п. 1):** атрибуты в серверной разметке — `data-reveal` (один раз при 15%), `data-reveal="now"` (сразу: hero и верх страницы), `data-reveal-grid` / `="one-row"` (контейнер: дети строками, шаг 150 ms). Логика — `components/layout/reveal-controller.tsx` (в `SiteChrome`). После перехода атрибуты снимаются (`data-revealed="done"`), дальше работают hover-переходы элемента. **Не ставить `data-reveal` / `data-reveal-grid` на то, что JS добавляет позже** (Show more в Past events, подгружаемые карточки): новые элементы остались бы скрытыми. Размечены все страницы (Home, About, Mentorship, Volunteer, Events, событие, ментор, Privacy). `data-in-view` — секция со своей анимацией (Find your mentor): `data-in` при 20%.
- **Кнопки (п. 2):** классы `btn btn-dark|white|outlined` в `components/ui/button.tsx`, заливка `::before` — CSS в `globals.css`.
- **Ссылки меню (п. 3):** ровная линия 1px (решение 12.11), `scaleX` 300 ms, слева внутрь / вправо наружу.
- **Карточки (п. 4):** `group/card` в `card-square` / `card-rectangle`; подчёркивание `MenuButton` реагирует на `group-hover/card`. Карточки событий и теги hover-анимации не получили (в списке нет).
- **Логотип (п. 5):** `@keyframes logo-typing` в `globals.css` (`a:hover` / `a:focus-visible`).
- **Шапка (п. 6):** `data-scrolled` после 16 px, стекло — на отдельном слое `.header-glass` (не на `<header>`, иначе fixed-меню «приклеится»).
- **Параллакс и Numbers (пп. 7–8):** `components/ui/parallax.tsx` — `ParallaxDrift` (hero — по странице, Featured на Home и Get involved — по экрану; слой выше рамки на 60 px: `absolute inset-0 xl:-top-15`), `ParallaxSpeed` (фото Community, скорости из v2), `ParallaxColumns` (Numbers: чётные карточки — левая колонка; путь 200 / 350 px — токены `--numbers-travel-*`; статика = выровненное положение). Только ≥1280 и без reduced motion, `will-change` только пока секция на экране.
- **Find your mentor (п. 9):** классы `fm-*` в `globals.css`; фон — inline-SVG (кольца анимируются по отдельности), значения плавания аватаров — массив `motion` в `find-mentor.tsx` (из v2, по порядку списка; для tablet / mobile тот же набор по кругу).
- **Слайдер (п. 10):** нативный scroll-snap со свайпом (решение Юлии 13.11); при движении `opacity 0.4` + `blur(3px)` (`data-moving`), высота плавно. Длительность и кривая самой прокрутки — браузерные.
- **Our Values (п. 11):** `components/about/values.tsx` + `values.module.css`. Сцена `position: sticky`, под ней распорка `count × --values-step` (padding не годится: sticky ограничен content-box родителя). Ценность = floor(прокрутка / шаг); текст по словам (разбивка на сервере), фон — перекрёстное проявление, параллакс слоя фонов 100 px, клик по вкладке — smooth scroll. Фоны грузятся только для активной ценности и соседних (`loaded`). Закрепление с 768.
- **FAQ (п. 12):** `components/ui/faq-item.tsx` — `grid-template-rows 0fr → 1fr` + opacity 350 ms, у открытого вопрос ниже на 5 px (desktop / tablet); то же у разделов Privacy Policy.
- **Решения 13.11:** (1) hover на аватаре Find your mentor — `scale(1.07)` + цветная версия поверх ч/б (400 ms, только `@media (hover: hover)`): PNG `avatar-*-color.png` для Avatar02, 04, 05, 07, 08 на desktop и tablet, выгружаются `npm run export:figma` (поле `avatarColor`: фото без saturation + маска-эллипс + кольцо из stroke); у Avatar03 и на mobile цветной версии нет; (2) Our Values закрепляется **с 768**, на телефоне — переключение нажатием с той же анимацией, без параллакса (`pin` в `values.tsx`, медиазапрос в `values.module.css`); (3) `opacity: 0.95` сцены Values из v2 не переносим — в Figma его нет (проверено по вариантам `values` и кадрам About).
- Проверялось: сборка, lint; headless Chrome через DevTools-протокол — прокрутка About (смена ценностей, клик), скриншоты desktop 1440 и mobile 390; hover на аватаре (цвет проявляется); DOM-проверка появления на всех страницах. Движение глазами и reduced motion в системе не смотрели.

### Менторы — решения сессии (13.11)
- **Публикация:** Ready / Published + Consent received; Elena Perfilyeva — Draft без согласия, не публикуется. Сейчас на сайте Liudmila Gishman и Tatyana Yakushev; цвет карточки чередуется neutral / muted.
- **Данные** — только из Mentor cards. Если ментор ещё и спикер (Liudmila), данные спикера не подмешиваются и не дублируются: био ментора и био спикера — разные тексты.
- **Тексты:** должность — «Position @ Company»; Expertise / Industry — переводятся ключами `expertise.*` / `industry.*`, новых значений нет в таблице → показываются как в Notion; Bio RU, если пусто — английское Bio. Подпись соцкнопок: `a11y.speakerLinkedin` и `a11y.personFacebook` (оба уже в таблице; `i18n/pending-texts.ts` удалён 13.11).
- **Фото:** Liudmila 551×551, Tatyana 721×721 — для профиля (375 при 2× = 750) мало; в карточках (90) хватает. Просить квадрат от 800×800.
- **Mentor info:** профиль — одна разметка (grid) на три размера; страницы только для опубликованных менторов, остальное — 404. Отступ «Back to all mentors»: 80 / 40 / 40 (по кадрам). Заголовок страницы — `h1` с именем.
- **Кнопка «View all mentors»** — `outlined` (в Figma узел скрыт, вид выбран по кнопкам рядом); при раскрытии подпись «Show fewer». Не проверялось вживую при > 2 менторов.

### События — решения этой сессии (12.11)
- **Featured:** по decisions п. 5 (предстоящее, иначе последнее прошедшее). ISR 3600 на `/`, `/events`, `/events/[slug]`.
- **Место на карточках:** очное — «Город, ШТ» из последней строки Address; онлайн — Place name из Notion, иначе «Online» (`format.Online`). Площадка и адрес целиком — в блоке Location страницы.
- **Время и язык:** «6:30 PM - 8:30 PM PT» / «18:30–20:30 PT» (PT добавляет код); язык — «In Russian» / «На русском» (в Figma было «Russian»).
- **Фильтр Past:** только теги, которые есть у прошедших событий (не все 10 из Figma); порядок — `TAG_ORDER` в `lib/events.ts`. Повторное нажатие снимает фильтр.
- **Suggest an event:** кнопка под Upcoming и в пустом состоянии открывает окно с формой (с 13.11, `SHOW_SUGGEST_EVENT = true`).
- **Event page:** кнопка «Video recording» (если есть ссылка) — в верхней группе кнопок; у предстоящего события без Registration link кнопки Register нет; у прошедшего — всегда неактивная. Спикер: LinkedIn-кнопка, сайт — текстовая ссылка под именем; должность и компания в макете не показаны.
- **Новые тексты:** ключи `eventPage.location`, `eventPage.openMap`, `eventPage.shareCopied`, `a11y.speakerLinkedin` уже в таблице (`npm run texts` 12.11), `i18n/pending-texts.ts` удалён.
- **Обложки:** Career longevity — 1024×559 (мало для 2×), у Natalia Vasileva фото 379×379; #IAmRemarkable — JPG 1402×1122 из Notion (с 12.11; старый PNG 3200×2560 удалён).

### Договорённости этой сессии (которых не было выше)
- **Подчёркивание текстовых ссылок в карточках (решено 16.11):** включается по `@media (hover: none)` (`touchUnderline` в `components/ui/menu-button.tsx`), а не по ширине < 1280, как в Figma (там линия на mobile/tablet). Сознательное отличие: наведения на тач-экранах нет, а у мыши на узком окне работает обычный hover. Не «исправлять» под Figma. В футере и mobile-menu линии нет.
- **Шапка:** sticky оставляем; сверить с animations.md, п. 6, на проходе анимаций. Активный пункт меню (`aria-current="page"`) — подчёркивание видно всегда, у выбранного языка EN/RU линии нет; зазор в EN | RU — 8 px; «Resource Hub» в шапке не учитывать (шапка из трёх пунктов).
- **Отступ перед футером:** см. раздел «Брейкпоинты и сетка»; на Mentorship 1440 в макете 400 — не повторять, разобрать в шаге Mentorship / при сверке.
- **Фото:** JPG 2× (PNG — только с прозрачностью: портреты команды, аватары менторов); фон Subscribe — тоже 2×; фоны Our Values остаются в 2×, а загрузка только активного и соседнего фона — на проходе анимаций (animations.md, п. 11). Узла `1602:27169` в Figma нет; обложка #IAmRemarkable — заливка `1552:18467` (1402×1122).
- **Resource Hub** скрыт флагом `SHOW_RESOURCE_HUB` (`lib/constants.ts`) до готовности контента; при возврате — решить, куда ведут кнопки карточек (`data/resources.ts`). Код, картинки и тексты сохранены.
- **Privacy Policy:** h1 — «Privacy Policy» (постоянное значение в скрипте сборки), блок контактов — «Organization Information and Contact Details»; `/ru/privacy-policy` отдаёт 404, русские страницы ссылаются на английский адрес; текст — `content/texts/privacy-policy.md`. Дата «Effective date: November 6, 2026» берётся из документа, перед запуском обновится (вопрос в «Открытых вопросах»).
- **404:** `app/global-not-found.tsx` + `proxy.ts` (язык по пути) + общая рамка `components/layout/site-chrome.tsx`; флаг `experimental.globalNotFound` — после обновления Next перепроверить статусы 404 на `/nope`, `/ru/nope` и `notFound()` внутри страниц.
- **Тексты:** в RU обычный пробел перед «—» заменяется неразрывным автоматически, пробелы в конце строк обрезаются (`scripts/build-texts.ts`); подписи для скринридера — ключи `a11y.*` (nav, соцкнопки, слайдер: `a11y.slideN` = «Story {n} of {total}»), `a11y.newTab` добавлен ко всем внешним ссылкам; ячейка `date.format` в таблице должна быть текстовой.
- **Отзывы:** три отзыва (Кристина, Наталья, Яна), слайдер на scroll-snap, стрелки на desktop, точки на tablet и mobile; анимация (blur, подстройка высоты) — на проходе анимаций (п. 10).
- **About:** точки под лентой команды — только индикатор (не кликаются); FAQ — 11 вопросов, первый открыт; Our Values: ARIA tabs, закрепление и смена прокруткой — на проходе анимаций (п. 11).
- **Mentorship:** кнопки «Explore program» ведут на https://upwardlyglobal.org/ и https://adplist.org/ (подтверждено); секция формы `id="mentor-form"`; на Volunteer — `id="volunteer-form"`; формы стоят на месте `children` секций `MentorFormSection` и `VolunteerFormSection` (шаг 8 сделан).
- **Volunteer (mobile):** видны фото и 3 роли, остальное — кнопка «More ways to contribute» (`volunteer.roles.more`).
- **Logo:** слои wordmark / bubble / dot-1…3, у точек классы `logo-dot logo-dot-1…3` для анимации «печатает…» (animations.md, п. 5, — на проходе анимаций).
- **Значки time и language** в Figma — заготовки («будут перерисованы»); после перерисовки перевыгрузить и обновить `components/ui/glyphs.ts`.
- **CSS-модули** (`*.module.css`) — только для раскладки-«рисунка» с координатами из Figma (коллажи Community, аватары Find mentor, сетка ролей Volunteer); правило Turbopack для Tailwind ограничено `globals.css`.
- **Окружение:** не использовать широкий `pkill`; dev-сервер убивать по порту (`lsof -ti tcp:<порт>`); Chrome headless для скриншотов; `gh` и `brew` не установлены, push идёт по https. Коммитить и пушить законченный блок самостоятельно, если сборка и lint проходят (решено 12.11).

## После запуска
Применять с момента подключения домена на Vercel. До этого действует прежняя договорённость (коммитить и пушить законченный блок в `main` самостоятельно). Подробности и схема — `docs/after-launch-updates.md`.
- **Не пушить в `main` напрямую.** Каждая правка идёт в отдельной ветке: pull request → Vercel Preview → Юлия проверяет → merge.
- **Перед PR** должны проходить сборка и lint.
- **Источники правок:**
  - события, спикеры, менторы — Notion (`npm run sync:events`, `npm run sync:mentors`);
  - тексты — Google-таблица (`npm run texts`);
  - Privacy Policy — Google Doc (`npm run privacy:build`);
  - дизайн — Figma.
- **Если что-то сломалось:** Vercel → Deployments → Instant Rollback, затем исправление отдельным PR.
- **Защита ветки `main` (решено 16.11).** Репозиторий приватный (запрос к GitHub API без авторизации отдаёт 404; `gh` не установлен); план GitHub Юлии не подтверждён. На GitHub Free у приватного репозитория защита веток недоступна — тогда правило «только через PR» держится на этой договорённости, и Claude Code её соблюдает. Если план Pro/Team (или репозиторий станет публичным): Settings → Branches (или Rules) → правило для `main`, требовать pull request и **применять к администраторам** (Юлия — владелец, Claude Code пушит от её имени, по умолчанию правила на админов не действуют).
- **GitHub Action для синхронизации — пока не делаем.** Синхронизацию Notion и таблицы текстов запускает Claude Code по просьбе Юлии. Вернуться, когда события начнёт заводить кто-то из команды без Юлии: тогда Action с запуском по кнопке (`workflow_dispatch`), коммит сразу в `main` (скрипты меняют только файлы данных), секреты — в GitHub Secrets.

## Открытые вопросы
Решить по ходу вёрстки; без решения — не верстать соответствующую часть.
- **После запуска (шаги Юлии, seo-ai-visibility.md, п. 9):** Search Console и Bing, одинаковое описание в Facebook / LinkedIn / Zeffy, каталоги, редиректы `www` и `*.vercel.app` → основной домен (Vercel → Domains), проверка Firewall (боты ИИ не блокируются), Rich Results Test для Event и Organization.
- **GA4 и Google Maps (шаг 9):** **GA4** — `NEXT_PUBLIC_GA_ID` из `.env.local` в сборку 16.11 не попал (в бандле нет `G-…`): проверить имя и значение переменной (формат `G-XXXXXXXXXX`), пересобрать, затем Юлия смотрит визит в Realtime; код Consent Mode проверен на подставном ID. **Google Maps:** ключа пока нет; задать `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (только **Maps JavaScript API**, ограничить по referrer: workchatseattle.org). Необязательно, локально и не в Vercel: `GOOGLE_MAPS_SERVER_KEY` (Geocoding API) для `sync:events`; без него координаты берёт Nominatim. Пока ключа нет — карта статичная картинка без заглушки. После ключа проверить вживую интерактивную карту на всех трёх адресах (и CSP).
- **Токен Figma** для скрипта картинок — Юлия создаёт в Figma (Settings → Security → Personal access tokens, только чтение) и кладёт в `.env.local` перед выгрузкой картинок Home.
- **Аккаунты и ключи** (нужны к этапу форм и запуска): проект Vercel и домен; интеграция Notion (internal) с доступом к Mentor cards, Volunteers, Event suggestions, Event listings, Speakers; Resend и подтверждение домена в DNS; Cloudflare Turnstile; ключ Google Maps JS API; GA4 — заведён ли и какой ID.
- **Дата в Privacy Policy** («Effective date: November 6, 2026») — обновить в Google Doc и Figma, если запуск сдвинется.
- **Письма с заявками (Resend)** включены (`SEND_FORM_EMAILS = true`, 16.11) с тестовым `FORMS_FROM_EMAIL = onboarding@resend.dev` — Resend доставляет только на workchatseattle@gmail.com; приход писем со всех трёх форм подтверждает Юлия. **К запуску:** подтвердить домен в Resend (DNS), заменить `FORMS_FROM_EMAIL` на адрес домена (локально и в Vercel), задать `RESEND_API_KEY` в Vercel. Пока запись в Notion = успех, отсутствие письма ошибкой не считается.
- **Письмо-благодарность отправителю формы (16.11):** `sendConfirmationEmail` в `lib/forms/email.ts`, флаг `SEND_CONFIRMATION_EMAILS` (`lib/constants.ts`) — `false` до подтверждения домена в Resend (с `onboarding@resend.dev` письмо уйдёт только на workchatseattle@gmail.com). Язык — `lang`, который клиент передаёт с формой (сервер проверяет); тексты — `email.thanks.*` (вкладка «Общее»); в письме только имя из формы; Reply-To — `FORMS_TO_EMAIL`; ошибка — `console.warn`. Подробности — forms-to-notion.md. **К запуску:** подтвердить домен, включить флаг.
- **Turnstile:** локально настоящие ключи (проверено 16.11 на трёх формах); в Vercel задать `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` и убедиться, что в виджете Cloudflare указан домен workchatseattle.org (при открытии по другому адресу, например *.vercel.app, токен может не пройти).
- **LinkedIn в формах ментора и волонтёра** — необязательное поле (решено 13.11); если заполнено, проверяется как ссылка (адрес без `https://` дополняется).
- **Тексты форм** (`form.invalidEmail|invalidUrl|tooLong`, `modal.error.suggestEvent`) перенесены в таблицу, вкладка «Общее» (13.11); `i18n/pending-texts.ts` удалён. Подсказка «Select all that apply.» у «How would you like to help?» берётся из `mentorship.form.meet.hint` (отдельной строки на Volunteer нет).
