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
- На GitHub включить защиту ветки `main` (merge только через PR).

## Если что-то сломалось
Vercel → Deployments → предыдущая рабочая сборка → **Instant Rollback**. Исправление — отдельным PR.

## Возможное упрощение (решить на шаге 11)
GitHub Action по расписанию и по кнопке (`workflow_dispatch`) запускает `sync:events`, синхронизацию менторов и `texts`, коммитит изменения → Vercel пересобирает сайт. Секреты (`NOTION_TOKEN`, id баз) — в GitHub Secrets. Решить: коммитить сразу в `main` или через автоматический PR.

## Связь с чатом проекта
Чат проекта WorkChat Seattle (claude.ai) видит эту папку и может класть задания в `docs/handoff.md`. Claude Code: по просьбе «прочитай handoff» выполнить задание из `docs/handoff.md`, а итог (что сделано, что решить) кратко дописать туда же в раздел «Ответ».
