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
