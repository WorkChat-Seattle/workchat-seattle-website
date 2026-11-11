# WorkChat Seattle — cookies и согласие (дополнение к CLAUDE.md)

Обновлено 02.11.2026 (компромиссный вариант). Основание — Privacy Policy, разделы 4, 6, 7 (тексты обновлены в Figma на странице Privacy Policy, см. ниже).

**Заменяет в CLAUDE.md:** «карта на Event page — статичная картинка со ссылкой на карту, не iframe» → теперь интерактивная карта Google Maps (JS API), по умолчанию включена; при отключённом Embedded content — заглушка (map-embed state=consent).

## Категории и значения по умолчанию
| Категория | По умолчанию | Сервисы |
|---|---|---|
| Necessary | всегда вкл. («Always active») | хранение выбора cookies, антиспам форм (рекомендуем Cloudflare Turnstile) |
| Analytics | **вкл.**, можно выключить | Google Analytics 4 |
| Session recordings & heatmaps | **выкл.** до согласия (opt-in) | Hotjar — категория показывается только когда Hotjar подключён |
| Embedded content | **вкл.**, можно выключить | Google Maps (JS API) на Event page |

Почему так: session replay в Вашингтоне и других штатах с согласием всех сторон — предмет исков о прослушке, поэтому только после явного согласия. GA и карта — модель «включено, можно отключить».
Global Privacy Control (`navigator.globalPrivacyControl === true`): все опциональные категории выключены, баннер не показываем.
Не требуют согласия: Vercel Analytics (без cookies), шрифт Google Sans — подключать с нашего сервера (next/font/local), не с Google Fonts.

## Figma (страница Claude)
Компоненты внизу секции Components:
- **toggle** — `state = off | on | locked` (44×24, квадратный). В коде `<button role="switch" aria-checked>`, область нажатия — вся строка категории.
- **cookie-banner** — `type = notice | with-replay` × `size = desktop | tablet | mobile`.
  - notice (пока Hotjar не подключён): «Cookies, anyone?» + короткий текст + «Sure!» (dark) и «Cookie settings» (outlined). Sure! сохраняет значения по умолчанию.
  - with-replay (когда подключим Hotjar): просит разрешение на записи — «Allow recordings» и «No recordings» одинакового веса (dark) + «Cookie settings». Остальные значения по умолчанию сохраняются в обоих случаях. Текст этого варианта пока прежний, длинный — переписать в том же тоне, когда будем подключать Hotjar.
  - desktop: карточка 480 в 40 px от левого нижнего угла окна; tablet/mobile: плашка во всю ширину внизу. Без затемнения. Пока выбора нет, GA и карта работают, Hotjar — нет. `role="region" aria-label="Cookie consent"`, без ловушки фокуса.
- **cookie-settings** — `size = desktop (680) | tablet (640) | mobile (390, во весь экран, прокрутка)`; булево свойство **session replay** (по умолчанию false) показывает категорию Hotjar. Кнопки: Reject all, Accept all (outlined), Save preferences (dark). При повторном открытии — сохранённый выбор. `role="dialog" aria-modal="true"`, ловушка фокуса, Esc/крестик закрывают без сохранения.
- **map-embed** — `state = loaded | consent`. loaded — по умолчанию (интерактивная карта). consent — если Embedded content выключен или есть GPC: статичная картинка (с нашего сервера, без запроса к Google) + «The map is provided by Google. Loading it shares data with Google.» + «Show map» (включает Embedded content). На Event page (все 4 размера) стоят экземпляры state=loaded.
  - **С 03.11 в обоих вариантах и во всех 4 экземплярах на Event page — настоящая карта Inkspire Print Studio** (8275 166th Ave NE, Redmond; 47.6764855, −122.1194204 — угол 166th Ave NE и NE 83rd St). Квадрат 704×704 (2× для 350), стиль OpenFreeMap Positron (данные OpenStreetMap) с тёплым тоном (multiply #f6f3ef), zoom 15.1, тёмный пин #323232 с белой точкой по центру, внизу справа подпись «© OpenStreetMap contributors · OpenFreeMap» (обязательна по лицензии ODbL). Отдельный кадр для экспорта — «map / Inkspire Print Studio» справа от набора map-embed (экспорт PNG 1×). На сайте — статичная картинка для состояния consent этого события (`public/images/events/<slug>-map.png`); подпись об источнике оставить.
  - Как пересобрать для другого адреса: плагин «Claude helper», `code.event-map.js` + `ui.event-map.html` (MapLibre 4.7.1 с unpkg, тайлы tiles.openfreemap.org; в manifest.json разрешены эти два домена). Координаты, zoom и сдвиг пина — константы в начале ui.event-map.html. CARTO (basemaps.cartocdn.com) теперь требует API-ключ — не использовать.
- **footer** — ссылка «Cookie Settings» после Privacy Policy (`<button>`, открывает cookie-settings).

Витрина — секция **Cookie consent** (x=200, y=22782): баннер notice, баннер with-replay и окно настроек (без Hotjar) × 390 / 768 / 1440 / 1920.
Скрипты: `code.cookies-build.js` (первая версия, не запускать — перезапишет v2), `code.cookies-v2.js` (текущая, тексты актуальные), `code.cookies-fix1.js`, `code.cookies-banner-text.js`.

## Тексты (EN)
- Баннер notice: «Cookies, anyone?» / «We use cookies to keep the site working, see what’s helpful, and show event maps. You can change this anytime in Cookie Settings.» / кнопки «Sure!», «Cookie settings».
- Баннер with-replay: «We use cookies» / «We use necessary cookies, Google Analytics and Google Maps to run and improve this site; you can turn analytics and maps off in Cookie Settings. With your permission, we’d also like to record how visitors scroll and click (Hotjar) to find where the site is hard to use. Learn more in our Privacy Policy.»
- Окно: «Cookie Settings» / «Choose which cookies and services we may use. You can change your choice anytime using the Cookie Settings link at the bottom of every page. Learn more in our Privacy Policy.»
- Necessary: «Keep the site secure and working: remember your cookie choice and protect our forms from spam.»
- Analytics: «Help us see which pages are useful and how visitors find us, so we can improve the site. Provided by Google Analytics.»
- Session recordings & heatmaps: «With your permission, we record scrolling and clicks to find where the site is hard to use. Form entries are never recorded. Provided by Hotjar.»
- Embedded content: «Show interactive maps on event pages. When a map loads, Google receives your IP address and may set its own cookies. Provided by Google Maps.»

## Поведение в коде
- Выбор хранить в first-party cookie (например, `wc_consent`: версия, дата, категории; срок 12 месяцев). При изменении списка сервисов (например, подключили Hotjar) — показать баннер with-replay снова.
- GA — Consent Mode v2: `analytics_storage: granted` по умолчанию (denied при GPC или выключенной Analytics); `ad_storage`, `ad_user_data`, `ad_personalization` — всегда denied.
- Hotjar не загружать до явного «Allow recordings» / включения переключателя; в Hotjar включить маскировку всех полей форм и персональных данных на страницах.
- Выключение категории останавливает будущий сбор; по возможности удалить `_ga*`, `_hj*`.
- Формы работают при любом выборе.

## Открытые вопросы
- Русская версия баннера и окна, если RU будет на старте.
- Срок хранения выбора (предложено 12 месяцев) и имя cookie.
- Посетители из ЕС: для них по GDPR нужна модель opt-in для всего опционального — решить, нужно ли (например, по геолокации).
