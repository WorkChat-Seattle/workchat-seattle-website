# WorkChat Seattle — динамический контент: события и менторы (дополнение к CLAUDE.md)

Решено 03.11.2026. Регистрация на мероприятия — **Zeffy** (заменяет решение правления от 24.10 про Luma). Карта на Event page — **встроенная интерактивная** (как в cookie-consent.md; заменяет решение правления 24.10 про ссылку на Google Maps).

## Где что лежит
- **Zeffy** (подключён к Claude как коннектор `https://api.zeffy.com/mcp`, только чтение): кампания мероприятия — название, дата и время, описание, обложка, билеты и цены, вместимость, ссылка на регистрацию, список гостей.
- **Notion** — источник истины для сайта и соцсетей (у всех таблиц закреплён первый столбец):
  - **Event listings** (встроена в страницу Events) — https://app.notion.com/p/cc2e414c5c5e8364a3b7818cd7ff9b14
  - **Speakers** (встроена в страницу Events) — https://app.notion.com/p/2dce414c5c5e83349bf4010f3b330efa
  - **Mentor cards** (встроена в страницу Mentors) — https://app.notion.com/p/2af6e6057eb3458a9f7afdb055513a3c
  - **Volunteers** (Volunteer Activity Log) — контакты, LinkedIn и навыки людей; поля-связи **Mentor card** и **Speaker profile** ведут на карточки для сайта. Контакты (email, телефон) — только в Volunteers, на сайт не идут.
- **Сайт**: файлы данных `data/events.ts`, `data/mentors.ts`, картинки в `public/images/...`.

## Публикация события (одно мероприятие → 4 канала)
1. **Zeffy** — вы создаёте кампанию (тип Event/ticketing): название, дата и время начала/окончания, описание, обложка, билеты. Ссылка на регистрацию появляется здесь.
2. **Claude: «подготовь событие X»** — находит кампанию в Zeffy (`list_campaigns` / `get_campaign`, ссылка — `url` или `get_share_kit`) и создаёт запись в **Event listings** (статус Draft): Title, Slug, Date (Сиэтл), Registration link, Short description, галочка Registration created. Описание из Zeffy приходит в HTML — очищать. Если описание на русском — оригинал в **Short description RU / Full description RU**, перевод на английский — в **Short description** и в тело страницы. Источником может быть и событие в Facebook: его Claude читает во встроенном браузере (только чтение, вход в Facebook там выполнен; доступ к fb.me — разовый, по просьбе).
3. **Вы дополняете в Notion** то, чего нет: Place name, Address, Google Maps link, Language, Format, Tags, Speakers (записи в Speakers с фото, био, сайтом; спикер связывается с записью в Volunteers, навык Speaker), полное описание (тело страницы), оригинал обложки (Cover photo, от 1600 px — обложка Zeffy может быть сжата). Статус → **Ready**.
4. **Figma (по просьбе)** — Claude собирает кадр `Event page / <название>` (только 1440, как у остальных событий; столбец x=6805 под Events, шаг 150) и добавляет карточку в Upcoming / Past Events на Events 390 / 768 / 1440 / 1920. **С 04.11 десктопные Event page (1440 и 1920, все кадры) на auto-layout** (скрипт `code.eventpages-autolayout.js`): `event` → `card` (padding 80/40/80/40, gap 60) → `top` (фото | `intro` 560 мин. 220 space-between: title + buttons | details) и `body` (padding-left 260, gap 60: details-section, speakers-section → `speakers` gap 10, location-section → `location` (venue 300 + map), bottom-buttons); под card через 80 — «Back to all events»; сам кадр страницы — VERTICAL, padding-top 148, gap 160, header absolute. Тексты и блоки теперь можно менять/удалять руками — страница подтягивается сама. Старые скрипты, двигавшие элементы по y (`code.iamremarkable.js`, `code.qa-*.js`, `code.meetup-eventpage.js`), для новых кадров не годятся — менять тексты и состав секций. Онлайн-событие — без location-section, без спикеров — без speakers-section. Обложку из Notion плагин загружает сам через UI (`ui.event-image.tpl.html`; подписанная ссылка Notion живёт 5 минут — подставлять перед самым запуском, запасной источник — обложка Zeffy на Cloudinary; в manifest.json нужны домены prod-files-secure.s3.us-west-2.amazonaws.com и res.cloudinary.com и `"ui": "ui.event-image.html"`). Карта по новому адресу — `ui.event-map-geo.html` (геокодинг через nominatim.openstreetmap.org, нужен этот домен и `"ui": "ui.event-map-geo.html"`). После запуска manifest вернуть из manifest.event-map.json.bak.
5. **Сайт** — Claude обновляет файлы данных и картинки → pull request → проверка на Vercel preview → merge → в Notion статус **Published** (это и есть отметка «на сайте»; отдельной галочки нет).
6. **Facebook Event в группе** — только вручную (Groups API закрыт с апреля 2024; браузерную автоматизацию Facebook для публикации не используем — риск блокировки аккаунта). Claude готовит в Notion поле **Facebook text** в порядке формы Facebook (название, дата/время, место, описание со ссылкой на регистрацию в первой строке). Обложка — картинка `og-event` 1200×630 (проверить обрезку при первом использовании). Отдельный пост-анонс в ленте не нужен: событие и так появится; посты — ближе к дате или после. Галочка Facebook event.
7. **LinkedIn (страница компании)** — Claude пишет **LinkedIn text** и **LinkedIn date**; после вашего одобрения пост ставится в отложенные (Buffer или встроенное планирование LinkedIn) и выходит сам. Галочка LinkedIn post.

В постах ссылку лучше давать на страницу события на сайте (`/events/<slug>`) — тогда при смене ссылки на Zeffy править нужно только сайт.

**Повторяющиеся события (с 19.11).** Каждая встреча серии — отдельная карточка в Event listings (у прошедших свои Recording link и Presentation). Поле **Repeats** (Every week / Every 2 weeks / Every 4 weeks) стоит только у последней карточки серии. Запланированная задача Claude «Repeating events: next card in Notion» (каждый день в 13:43 по Сиэтлу) после окончания такой карточки дублирует её: та же карточка, новая дата (тот же час по Сиэтлу), slug `<серия>-YYYY-MM-DD`, статус как у старой (Published → Ready), очищены Recording link, Presentation, LinkedIn date, галочки Facebook event и LinkedIn post; Repeats переходит на новую карточку. Registration link и Facebook text копируются как есть — проверить. На сайт новая встреча попадает обычным путём (`npm run sync:events` → PR). Остановить серию — снять Repeats у последней карточки. Первая серия — Practicing AI Together (Tatyana Yakushev, пятница 12:00, раз в две недели с 20.11.2026).

**Правило изменений:** после переноса главная — запись в Notion. Перенесли время, заменили спикера → правим в Notion (и в Zeffy, если касается даты/билетов); Claude подсказывает, что обновить на сайте, в Facebook и LinkedIn.

**Имена людей** — как в их LinkedIn (например, Tatyana Yakushev, Natalia Vasileva, Oxana Willeke, Natalya Masyago), одинаково в Notion, Figma и на сайте. Профили LinkedIn Claude читает во встроенном браузере приложения Claude (там выполнен вход в LinkedIn), только чтение; при поиске выбирает профиль с общими контактами из WorkChat.

## Карта на Event page
- Встроенная интерактивная карта Google Maps (JS API) по адресу из Address — поведение и согласие на cookies см. cookie-consent.md (map-embed state=loaded / consent).
- Поле **Google Maps link** — ссылка «открыть в Google Maps» (в т.ч. для заглушки consent и для Facebook text).
- У онлайн-событий (Format = Online) места, адреса и карты нет — на Event page блок Location не показывается (в Figma — кадры Career longevity и IAmRemarkable, только 1440).
- Статичные карты для состояния consent (Figma, секция Components, экспорт PNG 1×): `map / Inkspire Print Studio`, `map / 19015 N Creek Pkwy` (Bothell; 47.7654, −122.1857).

## Люди: волонтёры, менторы, спикеры
- **Порядок:** сначала человек в **Volunteers** (имя как в LinkedIn, контакты, LinkedIn, навыки Mentor / Speaker), потом карточки ролей — **Mentor cards** и/или **Speakers**, каждая связана с записью в Volunteers. Если человек и ментор, и спикер — в карточке спикера ещё заполнить **Mentor card**.
- Карточки ролей раздельные, потому что био разные: у ментора — с чем помогает, у спикера — о чём выступление.
- **Синхронизация (Notion на бесплатном тарифе, автоматизаций нет):** вы ставите в Volunteers навык Mentor или Speaker → говорите Claude «синхронизируй менторов и спикеров» → Claude находит людей с этими навыками без карточки и создаёт черновики (Draft), связанные с Volunteers, без дублей; заодно сообщает, у кого в карточках не хватает фото, био или согласия. В обратную сторону: у кого есть карточка, но нет навыка — добавляет навык.
- При переходе на платный тариф Notion можно заменить это автоматизацией базы (навык Mentor/Speaker → новая страница в Mentor cards/Speakers).

## Менторы
- Карточки заводятся в **Mentor cards** (без поиска и фильтров на сайте — решение правления 24.10). Порядок — поле Order (карточка Tatyana не первой).
- Публикация как у событий: статус Ready → Claude → pull request → Published.
- Публикуем только записи с галочкой **Consent received** (у Speakers так же).

## Поля баз
- **Event listings:** Title, Status (Draft / Ready / Published), Slug, Date (начало–окончание с временем), Upcoming / Past (формула — только для команды, сайт считает сам), Language, Format, Place name, Address, Google Maps link, Registration link, **Join link** (с 19.11: ссылка на подключение, Zoom и т. п.; заполнена — на сайте кнопка Join / Присоединиться вместо Register, после окончания — Registration closed), Short description, **Short description RU**, **Full description RU** (с 04.11), Cover photo, Speakers (↔ Speakers), Tags, Repeats (повторяющаяся серия), Recording link, LinkedIn text, LinkedIn date, Facebook text, галочки Registration created / Facebook event / LinkedIn post (публикация на сайте — статус Published). Полное описание на английском — в теле страницы, на русском — в поле Full description RU. В карточке поля сгруппированы: обложка → полное описание (EN) → «Описание» (Full description RU, Short description, Short description RU, Speakers, Tags) → «Когда и где» → «Сайт и регистрация» → «Соцсети»; в таблице столбцы в том же порядке.
- **Tags** — как в Figma (компонент `tag`, фильтр на Events), 10 штук: Career Growth, Family&Career, Goal setting, Hands-on AI, Industry Insights, Job Search, Networking, Personal Brand, Personal Finance, Well-Being. (Work-life Balance удалён 03.11 из Notion и Figma.) Новый тег добавлять и в Figma, и в Notion.
- В Figma у `card-event-past` в рамке `tags` два слота тега через разделитель; второй слот и разделитель по умолчанию скрыты и включаются у карточек с двумя тегами.
- **Speakers:** Name, Position, Company, Bio, Photo (квадрат от 800×800), Website (по решению правления — в карточке спикера), LinkedIn, Mentor card (→ Mentor cards), Events (↔ Event listings), Volunteer (↔ Volunteers), Consent received.
- **Mentor cards:** Name, Status, Slug, Position, Company, Industry, Expertise, Bio, Photo, LinkedIn, Facebook, Website, Order, Volunteer (↔ Volunteers), Consent received.
- Если будет RU-версия — описания событий уже есть (Short/Full description RU); добавить Title RU и RU-поля у Speakers / Mentor cards.

## Upcoming → Past (автоматически)
- Поля Upcoming/Past в данных сайта нет: событие прошло, когда наступило **время окончания** (Date end). Если окончания нет — конец дня.
- Время — `America/Los_Angeles`, сравнивать с учётом пояса, а не UTC сервера.
- Сортировка: Upcoming — ближайшие сверху; Past — последние сверху. У прошедших — фильтр по тегам (решение правления), поиска нет.
- `/events`, Home и `/events/[slug]` — ISR `export const revalidate = 3600` (ленивое обновление, задержка переезда в Past до часа). Отдельный планировщик не используем.

### Event page прошедшего события
- Та же страница. **Обе** кнопки Register неактивны (`button` dark, state=disabled; в коде `<button disabled>`, не ссылка). Share активна. Если есть Recording link — ссылка на запись.
- Точное переключение в браузере: клиентский компонент в момент End time сам делает Register неактивной (проверка при монтировании, таймер до окончания — не больше ~24 дней, перепроверка при `visibilitychange`).

## Счётчик «N people going»
- Из Zeffy: `list_guests` по кампании (status valid) — реальное число билетов. На сайте — при сборке/ISR раз в час. Как сайт получает число (через Zeffy API-ключ в настройках Vercel или Claude записывает его в данные при публикации) — решить при вёрстке.

## Мероприятия в Event listings (на 04.11)
- **#IAmRemarkable Workshop** — заведено 04.11 (Draft): среда 18.11.2026, 18:30–20:30, онлайн, на русском, бесплатно, 20 мест; ведущая Liudmila Gishman (связана со Speakers). Описание из Zeffy (рус.) — в RU-полях, перевод — в Short description и теле страницы. Cover photo загружено (500×400 — мало для сайта, нужен оригинал от 1600 px). Нет ссылки на подключение (Zoom/Meet) — решить, где её давать участникам. Figma: `Event page / IAmRemarkable` (`1552:18447`); карточки в Upcoming Events первыми: 390 `1552:18685`, 768 `1552:18715`, 1440 `1552:18745`, 1920 `1552:18775`.
- **From QA Automation to AI Engineer** — прошедшее, 31.10.2026, 10:00–12:00, Inkspire Print Studio (Redmond), на русском, офлайн (Published). Спикеры Elena Perfilyeva и Natalya Masyago (с 04.11, из комментария к событию в Facebook; в Volunteers и Speakers). Полное описание (EN + RU) — из события в Facebook. Не хватает: обложка (в Facebook — стоковая), фото спикеров, согласия. Figma: `Event page / QA Automation` (1491:27718).
- **WorkChat community meet-up** — заведено 04.11 (Draft) по событию в Facebook «💼 Встреча группы»: суббота 05.09.2026, 11:00–13:00, 19015 N Creek Pkwy, Ste 105, Bothell, на русском, офлайн, potluck; спикеров нет, регистрации в Zeffy не было. Не хватает: название площадки, обложка. Figma: `Event page / Community meet-up` (1491:27965), без блока Speakers.
- **How AI Is Changing Professions and Recruiting** — суббота 26.09.2026 (в Figma 03.11 исправлено с 09/29 на 09/26 во всех кадрах), Inkspire Print Studio (Redmond), на русском; спикеры Margarita Kostikova и Natalia Vasileva. Кампании в Zeffy нет.

## Открытые вопросы
- Подпись неактивной Register: «Register» или «Registration closed» / «Event has ended».
- «N people going» у прошедшего события — «went» или скрыть.
- Пустое состояние Upcoming (нет ближайших событий) — в макете нет.
- «Show more» у Past Events.
- В Upcoming Events на Events кроме IAmRemarkable могут стоять прошедшие события (How AI…, QA Automation) — они же есть в Past Events; убрать из Upcoming?
- Решения 03.11 (Zeffy вместо Luma, встроенная карта) отличаются от протокола правления 24.10 — зафиксировать на следующем заседании.
