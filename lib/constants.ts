/** Внешние ссылки и константы сайта (CLAUDE.md, «Стек»; docs/seo-ai-visibility.md). */
export const DONATE_URL = "https://www.zeffy.com/en-US/donation-form/support-workchat-seattle";
export const LINKEDIN_URL = "https://www.linkedin.com/company/workchat-seattle/";
export const FACEBOOK_URL = "https://www.facebook.com/groups/workchatseattle";
/** Privacy Policy только на английском: из RU ведёт сюда же (CLAUDE.md, «Языки»). */
export const PRIVACY_PATH = "/privacy-policy";
/** Название — имя собственное, не переводится (логотип, подпись ссылки на главную). */
export const SITE_NAME = "WorkChat Seattle";

/** Текст ссылки на Privacy Policy внутри фраз (подпись Subscribe, согласия): так он записан в таблице текстов. */
export const PRIVACY_LINK_TEXT = { en: "Privacy Policy", ru: "Политики конфиденциальности" } as const;

/**
 * Resource Hub на Home временно скрыт (12.11): контент не готов. Код, картинки и тексты на месте;
 * при false секция не рендерится вообще (в HTML от неё ничего нет, ни в EN, ни в RU).
 * При возврате решить, куда ведут кнопки карточек (data/resources.ts).
 */
export const SHOW_RESOURCE_HUB = false;

/** Кнопка «Suggest an event» (Events: под Upcoming и в пустом состоянии) открывает окно с формой (включена 13.11, шаг 8). */
export const SHOW_SUGGEST_EVENT = true;

/**
 * Письма с заявками через Resend (docs/forms-to-notion.md, «Поток отправки»). Код готов, отправка выключена, пока нет домена
 * в Resend (FORMS_FROM_EMAIL) и ключа RESEND_API_KEY. Пока false: заявка записана в Notion = успех, письмо не пытаемся слать
 * и ошибкой это не считаем. К запуску: подтвердить домен в DNS, задать RESEND_API_KEY и FORMS_FROM_EMAIL в Vercel, поставить true.
 */
export const SEND_FORM_EMAILS = false;

/** Почта команды для заявок и в текстах ошибок (docs/forms-to-notion.md). Берётся из env, запасное значение — тот же адрес. */
export const FORMS_TO_EMAIL = process.env.FORMS_TO_EMAIL ?? "workchatseattle@gmail.com";

/** Все события бесплатные (решено 13.11): цена для offers в Event JSON-LD, одна константа на все события, без поля в Notion. */
export const EVENT_PRICE = 0;
export const EVENT_PRICE_CURRENCY = "USD";
