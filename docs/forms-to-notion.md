# WorkChat Seattle — формы сайта → Notion + почта (дополнение к CLAUDE.md)

Решено 05.11.2026. Заменяет в CLAUDE.md «Формы пока без бэкенда … куда отправлять, решим позже».

## Почта для заявок (решено 06.11.2026)
- **Один адрес для всех форм: workchatseattle@gmail.com** (Become a mentor, Volunteer, Suggest an event). Отдельных адресов по формам нет; форму видно по теме письма.
- Этот же адрес — контакт в текстах ошибок отправки: «…If the problem continues, email us at workchatseattle@gmail.com.» **Заменяет заглушку [email]** в CLAUDE.md («Состояния отправки форм», «Открытые вопросы») и в figma-adaptive-handoff.md («Тексты»).
- В Figma 06.11 подставлен везде: свойство `error text` у `modal-message` (`1442:18126`, все 3 размера) и все экземпляры в секции Form states — Mentorship, Volunteer, Suggest an event, [Deprecated] Subscribe (скрипт `code.form-email.js`). Тот же адрес уже указан в Privacy Policy (§14, Email).
- В коде: `FORMS_TO_EMAIL=workchatseattle@gmail.com`; адрес в текстах ошибок брать из той же константы/файла данных, не вписывать в разметку. В тексте ошибки адрес — ссылка `mailto:`.
- `FORMS_FROM_EMAIL` — адрес на своём домене, подтверждённом в Resend (например `forms@workchatseattle.org`); с Gmail-адреса отправлять через Resend нельзя.

## Тексты окон успеха (проверено 06.11.2026)
- **Mentorship и Volunteer** (одинаковый текст): заголовок «Thank You!», текст «We’ve received your information and will get back to you within 3 business days with the next steps.» **Заменяет черновики с [N] дней** в CLAUDE.md («Состояния отправки форм») и figma-adaptive-handoff.md. В Figma стоит во всех 6 экземплярах `modal-message` type=success в Form states (Mentorship и Volunteer × 1440/768/390).
- Suggest an event: «We’ve received your suggestion. Our team will review it and may reach out to you by email.» (Form states и окна Thank you на Events во всех размерах).
- Значение по умолчанию у свойства `text` компонента `modal-message` — общее «We’ve received your form. Our team will review it and get back to you by email.»; в коде тексты брать по форме из файла данных.

## Тексты согласия и ссылка на Privacy Policy (06.11.2026)
- Согласие в форме ментора (все размеры Mentorship и Form states): «I understand that WorkChat Seattle will use my responses to review my mentorship form, as described in its Privacy Policy.» (убрано «…and coordinate mentor-mentee matching»).
- Во всех текстах, где «Privacy Policy» стоит внутри фразы (согласия Mentorship / Volunteer / Suggest an event, подпись под Subscribe, cookie-баннер with-replay и окно Cookie Settings — компоненты и экземпляры), слово подчёркнуто и в Figma задана ссылка https://workchatseattle.org/privacy-policy. Ссылка «Privacy Policy» в футере и текст самой страницы Privacy Policy не менялись. Скрипт `code.consent-privacy-link.js`.
- В коде: «Privacy Policy» в этих текстах — `<a href="/privacy-policy">` с подчёркиванием (`text-decoration: underline`), в согласии — внутри `<label>` чекбокса.

## Модель менторства
- Форма на Mentorship (`mentor-form`, «Become a mentor at WorkChat Seattle») — заявка **для менторов**, не для менти.
- Менти пишут менторам **напрямую** по контактам на сайте (LinkedIn и email). Подбора пар командой нет.
- Оплата/условия и формат (индивидуально или в группе — у некоторых менторов есть и групповой) — на усмотрение ментора, менти уточняет у него напрямую (решено 06.11).
- **Контакт ментора по email (решено 06.11):** отдельной кнопки email нет. Кнопка **«Get connected»** в `mentor-profile` (`1145:12181`, страница Mentor info `/mentors/[slug]`) — это и есть связь по email: `<a href="mailto:{email ментора}">Get connected</a>`. LinkedIn — иконка `button-social` рядом. В карточке `card-mentor` на Mentorship email-кнопки нет: там LinkedIn и «View profile» (ведёт на `/mentors/[slug]`). Email берётся из поля Email в Mentor cards и показывается только при отмеченном Consent received; без согласия или без email кнопку «Get connected» не показывать. Макет менять не нужно.

## Выпадающие списки в формах (решено 06.11.2026)
Общее для выпадающих списков: закрытое поле — `form-field` type=select из макета (в нём плейсхолдер = вопрос, после выбора — выбранное значение). **Подсказка показывается только в открытом списке — первой строкой над вариантами** (body, `text/muted`, не кликабельная; `id`, на который ссылается `aria-describedby`); под закрытым полем подсказки нет. Закрытие по Esc и клику вне, фокус возвращается на поле. Ошибка, если ничего не выбрано: «This field is required». Варианты — ровно в таком написании и порядке. Для списков с чекбоксами: кнопка с `aria-haspopup` / `aria-expanded`, внутри `role="group"` с нативными `<input type="checkbox">` и `<label>`; в закрытом поле — выбранные через запятую, а если не помещаются — «N selected».
- **Пример открытого списка в Figma** (06.11, секция Form states, внизу): `Volunteer / help dropdown open / 1440` (`1648:28105`) и `… / 390` (`1648:28140`), скрипт `code.volunteer-help-open.js`. Поле `form-field` в фокусе + панель: фон `bg/input` (white), обводка `border/divider`, тень как у модальных окон (0 8 24, 12%), отступы 16; сверху подсказка, ниже варианты на `checkbox-consent` (`1442:22081`), между вариантами 8 (desktop) / 12 (mobile). В закрытом поле на desktop — выбранные через запятую, на mobile — «2 selected». На mobile строка варианта целиком кликабельна, высота области нажатия ≥ 44. По этому образцу верстать и остальные списки (темы ментора, время, формат встреч).

### Форма ментора: «Which topics would you feel comfortable mentoring someone on?» * — чекбоксы, от 1 до 5
- Подсказка: «Select up to five areas where you can offer the most relevant guidance.»
- При 5 выбранных остальные варианты неактивны (`aria-disabled`).
- Варианты: 1. Understanding the U.S. job market and workplace culture · 2. Translating international experience into a U.S. career · 3. Choosing a career direction · 4. Changing careers or industries · 5. Returning to work after a career break · 6. Job-search strategy · 7. Resume / LinkedIn / Portfolio feedback · 8. Networking and professional relationships · 9. Interview preparation · 10. Communication and self-advocacy at work · 11. Career advancement and promotion · 12. Leadership and people management · 13. Developing skills in my professional field · 14. Starting or growing a business · 15. Other: ___ (при выборе — текстовое поле, обязательное; «Other» считается в лимит 5).
- Notion: Mentor cards → **Mentoring topics** (multi-select, названия = варианты формы) + **Other topic** (текст). Старое поле **Expertise** (Software Engineering, AI Engineering, Career switch…) — теги специализации для карточки на сайте, ставит команда; форма его не заполняет.

### Формы ментора и Volunteer: «How much time would you like to commit per month?» * — один вариант (одинаково в обеих формах)
- Подсказка: «Include time for meetings and any preparation.»
- Варианты (radio / `role="listbox"`): Up to 1 hour · About 2 hours · About 3–4 hours · More than 4 hours · I’d like to discuss this first.
- Notion: **Time per month** в Mentor cards и в Volunteers — только эти 5 (старые 1–2 / 3–5 / 6+ удалены 06.11, значений не было).
- Figma: подпись поля — «…per month?» на Mentorship и Volunteer. В Form states пример «2–4 hours» заменён на «About 3–4 hours» в Mentorship form (`code.mentor-time-example.js`) и в Volunteer form (`code.volunteer-examples.js`).

### Форма ментора: «How would you prefer to meet?» * — чекбоксы, можно оба
- Подсказка: «Select all that apply.»
- Варианты: Online · In person in the Seattle area (минимум один).
- Notion: Mentor cards → **Meeting format** — multi-select с этими 2 вариантами.

### Форма Volunteer: «How would you like to help?» * — чекбоксы, можно несколько (решено 06.11)
- Подсказка: «Select all that apply.»
- Варианты формы (текст на сайте) → короткий вариант в Notion (Volunteers → **Skills**):

| # | В форме | В Notion (Skills) |
|---|---|---|
| 1 | Speaking or leading workshops | Speaker |
| 2 | Mentorship – please also fill out the mentor form | Mentor |
| 3 | Running and hosting events | Events |
| 4 | Event photography | Photography |
| 5 | Digital communications: website, social media, newsletters | Digital communications |
| 6 | Partnerships and outreach (speakers, sponsors, organizations) | Partnerships |
| 7 | Operations and project management | Operations |

- **Пункт 2 — ссылка прямо в тексте варианта:** слова **«please also fill out the mentor form»** — подчёркнутая ссылка на раздел с формой ментора на странице Mentorship: `<a href="/mentorship#mentor-form" target="_blank" rel="noopener">` (решено 06.11: **открывать в новой вкладке**, чтобы не потерять уже введённое в форме Volunteer). В Figma — подчёркивание + hyperlink https://workchatseattle.org/mentorship#mentor-form в примере открытого списка. «Mentorship – » — обычный текст подписи чекбокса. Ссылка внутри `<label>`: клик по ней открывает новую вкладку и не переключает чекбокс. Для скринридеров добавить пометку о новой вкладке (визуально скрытый текст «(opens in a new tab)»). Секция формы на Mentorship должна иметь `id="mentor-form"`; при переходе по якорю учесть высоту фиксированной шапки (`scroll-margin-top`). Сама форма Volunteer ментора не создаёт — только ставит Skills «Mentor».
- Соответствие «текст формы → значение Notion» хранить в файле данных вместе со списком; на сервер отправлять ключ, в Notion писать короткое значение.
- В Notion (06.11) в Skills: Speaker, Mentor, Events, Photography, Digital communications, Partnerships, Operations — для формы. **Finance, Marketing, Technology** оставлены как ручные отметки профессиональных навыков (уже стоят у Masha, Julia, Tatyana, Natalya, Elena); форма их не ставит. Event Planning и Fundraising удалены (не использовались).
- Figma, Form states / Volunteer form: пример значения «Event organization» заменён на «Running and hosting events» (`code.volunteer-examples.js`).

## FAQ Mentorship (переписан 06.11.2026 под модель «менти пишет ментору сам»)
Источник текста (источник истины) — Google Doc «FAQ Mentorship»: https://docs.google.com/document/d/1NMx9P-K5Xn7ARV4h2XlkwBpsBUoK1jD5crbn6emsDW4/edit
- «How are mentors and mentees matched?» → **«How do I find a mentor?»**: подбора нет, менти выбирает профиль на странице и пишет ментору (LinkedIn или email); что написать в первом сообщении.
- Новый вопрос **«What if the mentor I contact isn't available?»**: ментор может быть занят — писать другому; если никто не подходит — писать на почту.
- Is mentoring free? → зависит от ментора; программы других организаций на странице — свои условия. One-on-one or group → оба формата. Online/in person → зависит от ментора. Длительность → фиксированной программы нет.
- Become a mentor → форма «Become a mentor at WorkChat Seattle»; с согласия публикуем профиль. Still have a question → workchatseattle@gmail.com (mailto).
- **В Figma перенесено 06.11** (скрипт `code.faq-mentorship-all.js`): на Mentorship во всех 4 размерах (390 / 768 / 1440 / 1920) теперь **12 вопросов** в порядке документа, у всех ответы из документа; абзацы в ответе разделены пустой строкой. В «Still have a question?» адрес подчёркнут и задан как ссылка `mailto:`. На 1440 и 1920 блок `faq` удлинён на 105, содержимое ниже сдвинуто; 390 и 768 на auto-layout.
- В коде: FAQ — в файле данных (`{ question, answer: string[] }`), ответы абзацами; email в последнем ответе — `<a href="mailto:…">`.

## Поток отправки
1. Форма → свой обработчик на Vercel (Next.js Route Handler `app/api/forms/[form]/route.ts`). Токены только на сервере (env).
2. Сервер: валидация (как на клиенте, включая лимит 5 тем и допустимые значения списков), антиспам Cloudflare Turnstile, honeypot-поле.
3. Запись в Notion через официальный API (internal integration, доступ выдан к трём таблицам).
4. Письмо на workchatseattle@gmail.com (сервис отправки, например Resend; домен подтверждается в DNS): все ответы + ссылка на созданную запись в Notion. Reply-To — email отправителя. Тема — с названием формы (например «[Website] Become a mentor — Anna Petrova»).
5. Ответ клиенту → окно `modal-message` success. Если Notion недоступен — письмо всё равно отправляется (с пометкой «not saved to Notion»), пользователю success. Если не удалось ни то, ни другое — error.
- Заполняются **только известные поля**; остальное команда дописывает вручную.
- Значения select из форм должны совпадать с вариантами в Notion (иначе API создаст новый вариант). Списки вариантов — в одном файле данных, общем для формы и сервера.

## Сопоставление полей

### Become a mentor → Mentor cards + Volunteers
**Mentor cards** (`collection://84fe6e56-5aa7-4bf0-ae3b-c6479eed6c25`), новая страница:
- Name ← Your full name; Email ← Your email; LinkedIn ← Link to your LinkedIn profile
- **Mentoring topics** (multi-select) ← Which topics…? (1–5); **Other topic** ← текст «Other: ___»
- **Time per month** (select) ← How much time would you like to commit per month?
- **Meeting format** (multi-select) ← How would you prefer to meet?
- Source = Website form; Status = Draft; Consent received — пусто (ставит команда после согласия на публикацию, включая email)
- Volunteer ← связь с записью в Volunteers (ниже)

**Volunteers** (`collection://bc0e414c-5c5e-82fa-89ab-878ddf414f78`):
- Поиск по Email. Если запись есть — добавить Skills «Mentor», связать Mentor card, ничего не перезаписывать. Если нет — создать: Name, Email, LinkedIn, Skills = [Mentor], Time per month (то же значение, что в форме ментора), Status = New, Source = Website form, Mentor card ← новая карточка.

### Volunteer → Volunteers
- Поиск по Email; если запись есть — добавить новые Skills, дописать Notes, Status не трогать; иначе создать.
- Name, Email, LinkedIn; **Skills** ← How would you like to help? (короткие значения из таблицы выше); **Time per month** ← How much time…? (те же 5 вариантов); Notes ← Anything else you'd like us to know?; Status = New; Source = Website form.

### Suggest an event → Event suggestions (новая таблица на странице Events)
**Event suggestions** (`collection://779693f5-360c-4bd8-a72f-95b91664b5d6`, https://app.notion.com/p/748d904a3a0d41ee859c3f9536d6f46d):
- Suggestion (title) ← домен из Event link, иначе первые слова описания
- Event link ← Event link; About ← What is this event about…; Submitted by ← Your name; Email ← Your email
- Status = New (`New | Reviewing | Accepted | Declined`); Source = Website form; Submitted — автоматически
- Event listing — связь с Event listings, команда ставит, если предложение принято и событие заведено.

### Subscribe → Zeffy (гибридный embed, решено 05.11)
- Не в Notion и не через наш сервер. Публичный API Zeffy только для чтения, поэтому форму подписки отдаёт сам Zeffy: встроенный iframe, контакты попадают в Zeffy.
- Код: `<div data-zeffy-embed data-form-url="/en-US/embed/newsletter-form/stay-connected-36">` + `<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js">`. Это cross-origin iframe: шрифты, скругления и цвета внутри не настраиваются; убрать заголовок «Stay connected» нельзя.
- Наш дизайн вокруг (компонент `subscribe` 1084:10472, все размеры): заголовок и подзаголовок наши; iframe в контейнере `zeffy-embed` — фон #EDEAE6, без скругления, отступ сверху/снизу 40 px; поля выровнены по текстовой направляющей (desktop: плашка 900, поля 600 — padding 150 с учётом собственных отступов Zeffy; tablet/mobile — во всю ширину карточки, padding 40 / 20). Подпись под формой наша: «By clicking the "Submit" button, you agree to the terms of our Privacy Policy.», «Privacy Policy» — ссылка.
- Состояния success/error и `state=sending` компонента больше не используются — их показывает Zeffy внутри iframe. **С 05.11 помечены устаревшими** в Figma. Не верстать.
- Privacy Policy обновлена 05.11 (§7: форма подписки от Zeffy, см. privacy-policy.md).

## Поля, добавленные в Notion
- 05.11 — Mentor cards: Email, Time per month, Meeting format, Source. Volunteers: Status, Source, Time per month, Notes. Новая таблица Event suggestions.
- 06.11 — Mentor cards: Mentoring topics, Other topic; Meeting format → multi-select; описание Email обновлено. Volunteers: Skills приведены к форме Volunteer (см. таблицу). Time per month в обеих таблицах — 5 общих вариантов.

## Переменные окружения (Vercel)
`NOTION_TOKEN`, `NOTION_DS_MENTOR_CARDS`, `NOTION_DS_VOLUNTEERS`, `NOTION_DS_EVENT_SUGGESTIONS`, `RESEND_API_KEY` (или другой сервис), `FORMS_TO_EMAIL` (= workchatseattle@gmail.com), `FORMS_FROM_EMAIL`, `TURNSTILE_SECRET_KEY` (+ публичный site key).

## Открытые вопросы
- ~~Создать интеграцию Notion~~ — готово (13.11 проверено: запись в Mentor cards, Volunteers, Event suggestions работает).
- Письма Resend выключены флагом `SEND_FORM_EMAILS` (`lib/constants.ts`) до подтверждения домена; Turnstile — тестовые ключи. Подробности — CLAUDE.md, «Открытые вопросы».
