/** Языки сайта. EN — без префикса (`/`), RU — с префиксом `/ru` (docs/ru-version.md). */
export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * Адрес страницы на нужном языке: path — без языкового префикса, с ведущим «/».
 *   localePath("en", "/events") → "/events"
 *   localePath("ru", "/events") → "/ru/events"
 *   localePath("ru", "/")       → "/ru"
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
