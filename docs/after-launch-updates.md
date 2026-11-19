# WorkChat Seattle — правки сайта после запуска (Vercel + домен)

Записано 16.11.2026 (из чата проекта WorkChat Seattle). Относится к шагу 11 и ко всей работе после запуска. Ключевые правила перенести в `CLAUDE.md`.

## Общая схема
Изменение в `main` на GitHub → Vercel сам собирает сайт → через 1–2 минуты он обновлён на домене. Каждая сборка `main` сразу выходит на живой сайт.

## Источники правок
| Что меняем | Где правим | Как попадает на сайт |
|---|---|---|
| События, спикеры | Notion: Event listings, Speakers; статус **Ready** | `npm run sync:events` → PR → merge → в Notion статус **Published** |
| Менторы | Notion: Mentor cards; статус **Ready**, Consent received | синхронизация менторов → PR → merge → **Published** |
| Тексты сайта | Google-таблица текстов, статус «Вычитано» | `npm run texts` → PR → merge |
| Privacy Policy | Google Doc | выгрузка в `content/texts/privacy-policy.md`, `npm run privacy:build` → PR → merge |
| Дизайн, новые блоки и страницы | Figma | перенос в код → PR → merge |

Без пересборки: переезд события Upcoming → Past (ISR, до часа), неактивная Register в момент окончания (клиентский компонент), счётчик «N people going», если берётся из Zeffy при ISR.

## Правило после запуска: превью перед сайтом
- Не пушить в `main` напрямую.
- Каждая правка — отдельная ветка → pull request → Vercel Preview (`*.vercel.app`, живой сайт не меняется).
- Юлия проверяет превью на телефоне и компьютере → merge → production.
- Перед PR должны пройти сборка и lint.
- Защита ветки `main` (решено 16.11): репозиторий приватный, план не подтверждён. На GitHub Free защита веток для приватного репозитория недоступна — правило «только через PR» держится на договорённости в `CLAUDE.md`. Если защита доступна (Pro/Team или публичный репозиторий): Settings → Branches (или Rules) → правило для `main`, требовать pull request и **применять к администраторам** (по умолчанию правила на админов не действуют, а Claude Code пушит от имени владельца).

## Если что-то сломалось
Vercel → Deployments → предыдущая рабочая сборка → **Instant Rollback**. Исправление — отдельным PR.

## Автосинхронизация (события — с 19.11)
**События — GitHub Action (с 19.11).** `.github/workflows/sync-events.yml` («Sync events from Notion»): каждый день в 22:17 UTC (14:17 по Сиэтлу зимой, 15:17 летом — после задачи повторяющихся событий в 13:43) и по кнопке Actions → Run workflow запускает `scripts/sync-events.ts`. Если `data/events.ts` или картинки в `public/images/events/` изменились, открывает или обновляет PR из ветки `sync/events` (в `main` напрямую не пишет: PR проверяет Vercel Preview, мержит Юлия). Секреты в GitHub (Settings → Secrets and variables → Actions): `NOTION_TOKEN`, `NOTION_DS_EVENT_LISTINGS`, `NOTION_DS_SPEAKERS`, необязательный `GOOGLE_MAPS_SERVER_KEY` (без него координаты — Nominatim). В настройках репозитория (Settings → Actions → General) включено «Allow GitHub Actions to create and approve pull requests». Менторов (`sync:mentors`) и тексты (`texts`) по-прежнему запускает Claude Code по просьбе Юлии.

## Связь с чатом проекта
Чат проекта WorkChat Seattle (claude.ai) видит эту папку и может класть задания в `docs/handoff.md`. Claude Code: по просьбе «прочитай handoff» выполнить задание из `docs/handoff.md`, а итог (что сделано, что решить) кратко дописать туда же в раздел «Ответ».
