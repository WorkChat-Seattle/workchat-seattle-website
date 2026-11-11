# WorkChat Seattle — страница Privacy Policy (дополнение к CLAUDE.md и figma-adaptive-handoff.md)

Сделано 02.11.2026. Этот документ заменяет пункт «Privacy Policy — нет макета» в «Открытых вопросах» CLAUDE.md и в «Осталось сделать в Figma».

## Кадры (страница Claude, ряд на y=22782)
| Страница | Маршрут | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---|---|
| Privacy Policy | `/privacy-policy` | `1457:23154` (x=-5000) | `1457:23047` (x=-4566) | `1457:22619` (x=-3758) | `1457:22833` (x=-2278) |

Скрипт сборки: `code.privacy-build.js` в ~/Documents/figma-claude-plugin (пересобирает все 4 кадра, старые «Privacy Policy / …» удаляет; тексты в нём с правками разделов 4, 6, 7 от 02.11, **но без правок 05.11 и даты от 06.11** — после пересборки снова запустить `code.privacy-zeffy.js` и `code.privacy-date.js`). Header и footer клонированы с кадров 404.

## Источник текста
Google Doc «WorkChat Seattle Privacy Policy»: https://docs.google.com/document/d/1F0yUcXXI9VehZX1_xd6waTv6wE0hplG93_wcVvSFyZU/edit
Образец структуры — https://seattle-envelopes.org/privacy-policy (вводный текст → разворачивающийся список).

**Правки 02.11 (cookies, компромиссный вариант — см. cookie-consent.md)** внесены и в Figma, и в Google Doc; тексты совпадают:
- §4, 3-й абзац: аналитика включена по умолчанию, можно выключить; session replay и heatmaps — только после opt-in.
- §6, 2-й абзац: Necessary всегда активны; аналитика и встроенный контент (карты) включены по умолчанию; session replay выключен до согласия; «Your choices do not prevent you from submitting a form.»
- §6, 3-й абзац: «Turning off an optional category stops future collection through it…»
- §6, 4-й абзац: сигнал Global Privacy Control = выключить опциональную аналитику, session replay и встроенный контент.
- §7: новый 2-й абзац про интерактивную карту Google Maps.

**Правки 05.11 (Zeffy, менторы)** — в Google Doc и во всех 4 кадрах Figma (`code.privacy-zeffy.js`):
- §1, 2-й абзац: в списке сторонних платформ добавлена «newsletter subscription».
- §3, 3-й абзац: профили менторов публикуются только с согласия; профиль может включать имя, фото, профессиональный опыт, LinkedIn и email, чтобы менти писали напрямую.
- §7, 1-й абзац: Luma заменена на Zeffy — «Zeffy … for event registration and donations» (решение 03.11).
- §7: новый 3-й абзац — форма подписки от Zeffy встроена на страницы; при загрузке Zeffy получает технические данные (IP) и может ставить свои cookies; email уходит напрямую в Zeffy, который ведёт список подписчиков.

**06.11 — дата вступления в силу: «Effective date: November 6, 2026»** (решение Юлии; сайт планируется выложить в течение недели). Подставлена в Google Doc и во все 4 кадра Figma (`code.privacy-date.js`). Если публикация сильно сдвинется или текст политики изменится до запуска — обновить дату в обоих местах.

## Состав страницы
header → блок `privacy` → footer (без subscribe и get-involved, как на 404).
1. **intro** — заголовок «Privacy Policy» (`h1` в разметке, стиль h2 по размеру: 56 / 44 / 32), строка «Effective date: November 6, 2026» (caption), вводный абзац (body).
2. **policy-list** — 13 разделов (1–13 из документа) на компоненте `faq-item` (`1010:1354`): `question` — заголовок раздела с номером, `answer` — текст раздела, абзацы разделены пустой строкой. В коде — `<details>/<summary>` или кнопка с `aria-expanded`, как FAQ на Mentorship. **Решено 06.11: при загрузке страницы первый раздел открыт, остальные свёрнуты** (как в макете; `<details open>` у первого). Разделы открываются независимо — открытие одного не закрывает другие.
3. **contact** — раздел 14 «Organization Information and Contact Details» вне списка, всегда виден: заголовок (h3 по размеру) + body. Номер «14.» убран, т.к. блок вне нумерованного списка. Строки реквизитов (Legal name…UBI, адрес registered agent, Website/Email) — переносы строк внутри абзаца (`<br>`), email и сайт лучше сделать ссылками (`mailto:`).

Тексты хранить в файле данных (массив `{ id, title, body[] }` + intro + contact), не в разметке. Источник истины — Google Doc.

## Раскладка
- **Desktop (1440/1920):** заголовок, вводный текст и contact — колонка 600 от x=420 (на 1920 — от 660), как заголовок FAQ на Mentorship; список — 900 от x=270 (ответы от x=420, ширина 600 — из компонента). Отступы: от верха 148, intro→список 40, список→contact 80, заголовок→текст 40, contact→footer 160. (В Figma: у рамки `privacy` itemSpacing 40, у `contact` paddingTop 40.)
- **Tablet (768):** заголовок/тексты/contact — от x=212, ширина 516; список — 688 от x=40 (ответ от x=212). Отступ сверху 60, между блоками 40, заголовок→текст 20, до футера 120.
- **Mobile (390):** всё на ширину 350 (поля 20). Сверху 40, между блоками 40, заголовок→текст 20, до футера 80.

## Открытые вопросы
- Ссылки на Privacy Policy уже есть в согласии форм, под Subscribe и в футере — вести на `/privacy-policy`.
- Форма Zeffy загружается всегда и не входит в категории Cookie Settings (иначе при выключенном Embedded content или GPC подписка не работала бы). Если решим подчинить её Embedded content — нужна заглушка «Show form» и правка §6–7.
