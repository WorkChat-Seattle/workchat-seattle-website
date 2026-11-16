import "server-only";
import type { Metadata } from "next";
import { type Locale, locales, localePath } from "@/i18n/config";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";

/** Основной адрес сайта без «/» в конце (docs/seo-ai-visibility.md, п. 1). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://workchatseattle.org").replace(/\/$/, "");
export const SITE_NAME = "WorkChat Seattle";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Единственный адрес, на котором индексация разрешена (robots.ts, proxy.ts); *.vercel.app, www, localhost — закрыты. */
export const INDEXABLE_HOST = "workchatseattle.org";

/** Значение заголовка Host / X-Forwarded-Host → можно ли индексировать сайт, открытый по этому адресу. */
export const isIndexableHost = (host: string | null | undefined): boolean =>
  (host ?? "").split(",")[0].trim().toLowerCase().replace(/:\d+$/, "") === INDEXABLE_HOST;

/** Абсолютный адрес страницы: path — без языкового префикса. */
export const absoluteUrl = (lang: Locale, path = "/"): string => `${SITE_URL}${localePath(lang, path)}`.replace(/\/$/, "") || SITE_URL;
/** Абсолютный адрес файла из public (или любой путь сайта). */
export const assetUrl = (path: string): string => `${SITE_URL}${path}`;

const OG_IMAGES: Record<Locale, string> = {
  en: "/images/og/og-default.png",
  ru: "/images/og/og-default-ru.png",
};
const OG_LOCALE: Record<Locale, string> = { en: "en_US", ru: "ru_RU" };

/** hreflang: en, ru, x-default (= en). Privacy Policy — только английская (`onlyEn`). */
export function alternates(lang: Locale, path: string, onlyEn = false): NonNullable<Metadata["alternates"]> {
  if (onlyEn) return { canonical: absoluteUrl("en", path) };
  return {
    canonical: absoluteUrl(lang, path),
    languages: { en: absoluteUrl("en", path), ru: absoluteUrl("ru", path), "x-default": absoluteUrl("en", path) },
  };
}

type PageMeta = {
  lang: Locale;
  t: Dictionary;
  /** Адрес без языкового префикса. */
  path: string;
  title: string;
  description?: string;
  /** Своя картинка-превью (события); иначе общая EN / RU. */
  image?: string;
  /** alt картинки-превью; по умолчанию seo.ogImage.alt. */
  imageAlt?: string;
  onlyEn?: boolean;
};

/**
 * Метаданные страницы: title (из вкладки SEO уже с названием сайта — шаблон не нужен, иначе имя повторится),
 * description, canonical + hreflang, Open Graph и Twitter (docs/social-previews.md).
 */
export function pageMetadata({ lang, t, path, title, description, image, imageAlt, onlyEn }: PageMeta): Metadata {
  const url = absoluteUrl(lang, path);
  const img = [{ url: assetUrl(image ?? OG_IMAGES[lang]), width: 1200, height: 630, alt: imageAlt ?? t["seo.ogImage.alt"] }];
  return {
    title: { absolute: title },
    description,
    alternates: alternates(lang, path, onlyEn),
    openGraph: { type: "website", siteName: SITE_NAME, locale: OG_LOCALE[lang], url, title, description, images: img },
    twitter: { card: "summary_large_image", title, description, images: img.map((i) => i.url) },
  };
}

/** Метаданные статической страницы по ключам вкладки SEO: `seo.<key>.title` / `.description`. */
export function staticPageMetadata(lang: Locale, t: Dictionary, key: "home" | "about" | "events" | "mentorship" | "volunteer", path: string): Metadata {
  return pageMetadata({ lang, t, path, title: t[`seo.${key}.title` as TextKey], description: t[`seo.${key}.description` as TextKey] });
}

/** Подставляет значения в шаблон «{title} — WorkChat Seattle». */
export const fillTemplate = (tpl: string, values: Record<string, string>): string =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");

/** Обрезка описания по границе слова. */
export function clip(text: string, max = 155): string {
  const s = text.replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export { locales };
