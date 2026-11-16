# WorkChat Seattle — SEO и видимость в ИИ-поиске (дополнение к CLAUDE.md)

Подготовлено 11.11.2026, решения Юлии — 11.11. Цель: чтобы Google (вместе с AI Overviews и AI Mode), ChatGPT, Claude, Perplexity и Copilot находили сайт и рекомендовали WorkChat Seattle на запросы вроде «community for Russian-speaking women in Seattle» и «менторство для иммигранток Seattle».

## Решения (11.11, Юлия)
- **Домен:** https://workchatseattle.org (основной адрес без `www`).
- **Ботов для обучения моделей пускаем** (GPTBot, ClaudeBot, Google-Extended и др.) — robots.txt разрешает всё, кроме `/api/`.
- **Организация:** 501(c)(3); сообщество создано в 2018 году, некоммерческий статус — с 2026 года.
- **Профили:** группа Facebook https://www.facebook.com/groups/workchatseattle, LinkedIn https://www.linkedin.com/company/workchat-seattle/. Instagram нет.
- **Ключевые факты** (для кого сообщество, где встречи, язык, условия, как присоединиться) есть в FAQ на About.

## Принцип
- Отдельного «AI-SEO» не делаем. ИИ-ассистенты ищут через обычные поисковые индексы и ботов, поэтому работает обычное SEO: доступный для ботов сайт, текст в HTML, понятные факты, структурированные данные, упоминания на других сайтах.
- **Не делаем** (Google прямо называет это бесполезным): `llms.txt`, нарезку текста на куски для ИИ, отдельные тексты для ИИ, накрутку упоминаний, избыточную разметку schema.org.
- Тексты на сайте не придумываем (CLAUDE.md, «Правила вёрстки», п. 7). Title и description берём из вкладки **SEO** таблицы текстов EN/RU (ru-version.md).

## Порядок работы в Claude Code
1. Базовый URL и домен (п. 1).
2. `app/robots.ts` (п. 2).
3. `app/sitemap.ts` (п. 3).
4. Метаданные страниц (п. 4).
5. Проверка, что содержимое есть в HTML (п. 5).
6. JSON-LD: Organization и WebSite в layout, Event на страницах событий, ProfilePage у менторов (п. 6).
7. Проверка (п. 8). После запуска Юлия выполняет шаги из п. 9.

## 1. Базовый URL
- Переменная окружения `NEXT_PUBLIC_SITE_URL=https://workchatseattle.org` (без `/` в конце). В корневом layout `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)`.
- Основной адрес — `https://workchatseattle.org`. `www.workchatseattle.org` и адрес `*.vercel.app` боевого проекта — постоянный редирект 308 на основной (Vercel → Settings → Domains).
- **Индексация (решено 16.11) — по адресу, а не по `VERCEL_ENV`:** разрешена только когда сайт открыт на `workchatseattle.org` (`isIndexableHost` в `lib/seo.ts`). На `*.vercel.app`, `www`, localhost: `robots.ts` (динамический, смотрит `X-Forwarded-Host` / `Host`) отдаёт `Disallow: /`, а `proxy.ts` добавляет к страницам `X-Robots-Tag: noindex, nofollow`.

## 2. robots.txt — `app/robots.ts`
Пускаем всех ботов, включая ботов для обучения моделей (решение 11.11).

```ts
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  if (!isIndexableHost(h.get('x-forwarded-host') ?? h.get('host'))) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
```

- **Никогда не блокировать** ботов поиска и ботов, которые заходят по запросу пользователя: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User. От них зависит, появится ли сайт в ответах ИИ.
- Устаревшие имена `anthropic-ai` и `Claude-Web` не используем.

## 3. Карта сайта — `app/sitemap.ts`
- **Статичные страницы:** `/`, `/about`, `/mentorship`, `/volunteer`, `/events`, `/privacy-policy`.
- **Динамические страницы:** все `/events/[slug]` (и предстоящие, и прошедшие) из `data/events.ts`; все `/mentors/[slug]` из `data/mentors.ts`. Только опубликованные записи с согласием (Consent received).
- **Языки:** каждая страница идёт в двух версиях, EN и `/ru/...`, с `alternates.languages`: `{ en, ru, 'x-default': en }`. Исключение — Privacy Policy: она только на английском, у неё без `ru`.
- **Дата изменения (`lastModified`):** у событий и менторов — время изменения записи в Notion (если оно приходит в данных), у статичных страниц — дата сборки.
- 404 и `/api/*` в карту не включаем.

## 4. Метаданные страниц
- **Title:** шаблон в layout `{ template: '%s | WorkChat Seattle', default: 'WorkChat Seattle' }`. Сами title и description — из вкладки SEO (EN и RU), для событий и менторов — по шаблонам оттуда же. У каждой страницы они свои, повторов нет.
- **Адреса:** `alternates.canonical` указывает на саму страницу. `alternates.languages` — en, ru и x-default (как hreflang в ru-version.md).
- **Превью для соцсетей:** Open Graph и Twitter — по social-previews.md.
- **`<html lang>`:** `en` или `ru` по версии страницы.
- **404:** у `not-found.tsx` статус 404 и `robots: { index: false }`.

## 5. Содержимое должно быть в HTML
Боты ИИ, которые заходят по запросу пользователя, обычно не выполняют JavaScript. Всё содержательное должно быть в HTML, который отдаёт сервер (SSG/ISR — как в dynamic-content.md).
- **FAQ на About и на Mentorship** (`<details>` или кнопка с `aria-expanded`): ответы в разметке и тогда, когда пункт свёрнут. FAQ на About — главный источник фактов о сообществе для ИИ.
- **Our Values:** все 5 панелей в DOM (grid-наложение уже так задумано). Неактивные панели не должны появляться только после клика.
- **Био команды:** доступно в HTML, визуально скрыто (уже в decisions-2026-11-05.md, п. 8).
- **Скрытые менторы («View all mentors»):** карточки есть в HTML, атрибут `hidden` допустим.
- **Past Events («Show more»):** можно подгружать на клиенте. Все страницы событий и так есть в sitemap и связаны ссылками.
- **Ссылки:** навигация — обычные `<a href>`, без переходов через `onClick`.
- **Cookie-баннер:** не перекрывает и не заменяет основной контент в HTML.
- **Формы:** форма подписки Zeffy (iframe) и формы не индексируются, и это нормально.

## 6. Структурированные данные (JSON-LD)
- **Компонент:** `components/JsonLd.tsx` отдаёт `<script type="application/ld+json">`. Внутри `JSON.stringify(data).replace(/</g, '\\u003c')`.
- **Данные:** из файлов данных и словарей `en` / `ru`, не вписывать в разметку. На `/ru/...` — русские description и `inLanguage: 'ru'`.

### 6.1 Organization и WebSite (корневой layout, на всех страницах)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": "https://workchatseattle.org/#organization",
      "name": "WorkChat Seattle",
      "url": "https://workchatseattle.org/",
      "logo": "https://workchatseattle.org/logo.png",
      "description": "<description Home из вкладки SEO>",
      "email": "workchatseattle@gmail.com",
      "foundingDate": "2018",
      "nonprofitStatus": "https://schema.org/Nonprofit501c3",
      "areaServed": { "@type": "Place", "name": "Seattle metropolitan area, Washington, USA" },
      "sameAs": [
        "https://www.facebook.com/groups/workchatseattle",
        "https://www.linkedin.com/company/workchat-seattle/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://workchatseattle.org/#website",
      "url": "https://workchatseattle.org/",
      "name": "WorkChat Seattle",
      "inLanguage": ["en", "ru"],
      "publisher": { "@id": "https://workchatseattle.org/#organization" }
    }
  ]
}
```
- В коде адреса собирать из `NEXT_PUBLIC_SITE_URL`, не вписывать вручную.
- `logo` — квадратный PNG от 112×112 (экспорт логотипа).
- `foundingDate` — год появления сообщества (2018). Статус 501(c)(3) получен в 2026 году. Если на сайте или в соцсетях упоминается год основания, он должен совпадать с 2018.
- `sameAs` — сюда же добавить новые профили, если появятся (например, Instagram).

### 6.2 Event (`/events/[slug]` и `/ru/events/[slug]`)
- `name`, `description` (Short description, на RU — Short description RU), `image` — обложка.
- `startDate` / `endDate` — ISO со смещением Сиэтла, например `2026-11-18T18:30:00-08:00`. Смещение считать по `America/Los_Angeles` на дату события (летом −07:00).
- `eventStatus: EventScheduled`.
- `eventAttendanceMode`: OfflineEventAttendanceMode или OnlineEventAttendanceMode (по Format).
- `location`: офлайн — `Place` (`name` = Place name, `address` = `PostalAddress` из Address); онлайн — `VirtualLocation` с `url` страницы события (ссылку на Zoom не публикуем).
- `organizer: { "@id": "https://workchatseattle.org/#organization" }`.
- `performer` — спикеры, `Person` с `name`; `sameAs` — LinkedIn, только при Consent received.
- `offers`: `url` = Registration link, `price` (0 для бесплатных), `priceCurrency: USD`, `availability: InStock`. У прошедших событий — `SoldOut` или без `offers`.
- `inLanguage` — по полю Language события, а не по версии страницы.
- Прошедшие события размечаем так же.

### 6.3 Менторы (`/mentors/[slug]`)
`ProfilePage` с `mainEntity: Person` — `name`, `jobTitle` (Position), `worksFor` (`Organization`, Company), `image`, `sameAs` (LinkedIn). Только для опубликованных карточек с согласием.

### 6.4 Что не размечаем
- FAQPage (и на About, и на Mentorship): расширенные результаты для FAQ Google показывает только государственным и медицинским сайтам. ИИ и так читают FAQ из HTML (п. 5).
- BreadcrumbList и прочее — не нужно.

## 7. Хостинг и боты
- **Vercel Firewall:** не включать правила, которые блокируют ИИ-ботов (managed ruleset «AI Bots» и похожие). Включённая защита Bot Protection не должна отдавать проверку (challenge) Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot и PerplexityBot.
- **После запуска:** в логах Vercel (Observability → Logs) искать по user-agent `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `bingbot`. Если какой-то бот за месяц ни разу не появился, проверить robots и Firewall.

## 8. Проверка перед запуском
- `https://workchatseattle.org/robots.txt` и `/sitemap.xml` открываются. В sitemap обе языковые версии и все события и менторы.
- На превью-деплое `/robots.txt` = `Disallow: /`.
- Проверить редиректы: `www.workchatseattle.org` и `*.vercel.app` → `https://workchatseattle.org` (308).
- `curl -A "Claude-User" <страница> | grep "<фраза из текста>"` — текст страницы есть в HTML без JavaScript. Проверить Home, About (ответ из свёрнутого FAQ), Mentorship (ответ из FAQ) и одно событие.
- **Google Rich Results Test:** страница события без ошибок Event, Home — без ошибок Organization. Плюс https://validator.schema.org.
- У каждой страницы свой title и description, есть canonical и hreflang (en, ru, x-default).
- 404 отдаёт статус 404.

## 9. После запуска — шаги для Юлии (вручную)
1. **Google Search Console:** добавить ресурс «Домен» `workchatseattle.org`, подтвердить через DNS-запись у регистратора домена. Скрипты Google на сайт не ставим (cookie-consent.md). Отправить `sitemap.xml`.
2. **Bing Webmaster Tools:** импорт из Google Search Console, отправить sitemap. На индексе Bing отчасти работают поиск ChatGPT и Copilot.
3. **Одинаковое описание везде:** название «WorkChat Seattle» и одна и та же короткая формулировка (из description Home) со ссылкой на https://workchatseattle.org:
   - группа в Facebook (описание и закреплённый пост);
   - страница компании в LinkedIn (поле Website; там же год основания 2018 и тип организации Nonprofit);
   - профиль организации и кампании в Zeffy.
4. **Каталоги:**
   - Candid / GuideStar: статус 501(c)(3) есть, профиль организации бесплатный;
   - Google Business Profile — сначала проверить, подходит ли организация без своего офиса (вариант с зоной обслуживания);
   - события по возможности дублировать на Meetup или Eventbrite со ссылкой на `/events/<slug>`.
5. **Упоминания:**
   - попросить партнёров (площадки событий, внешние программы менторства со страницы Mentorship, организации спикеров) поставить ссылку на сайт;
   - местные издания и блоги для иммигрантов;
   - ответы в профильных обсуждениях (r/Seattle, r/Bellevue, r/eastside) — по делу, без рекламы.
6. **Раз в месяц** спрашивать ChatGPT, Claude, Perplexity, Gemini и Google AI Mode (EN и RU) и записывать, называют ли WorkChat и что о нём говорят:
   - «professional community for immigrant women in Seattle»;
   - «Russian-speaking women networking Seattle / Bellevue»;
   - «free mentorship for women career change Seattle»;
   - «сообщество русскоязычных женщин Сиэтл»;
   - «менторство для иммигранток в Сиэтле».

## Открытые вопросы
Нет — все закрыты решениями 11.11.
