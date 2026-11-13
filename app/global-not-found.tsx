import type { Metadata } from "next";
import { headers } from "next/headers";
import { fontVariables } from "./fonts";
import { NotFoundBlock } from "@/components/layout/not-found-block";
import { SiteChrome } from "@/components/layout/site-chrome";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "./globals.css";

// Страница 404 для всего сайта (experimental.globalNotFound): работает и для несуществующих адресов,
// и для notFound() внутри страниц. У неё нет параметров маршрута — язык берётся из пути (proxy.ts).
export async function generateMetadata(): Promise<Metadata> {
  const path = (await headers()).get("x-pathname") ?? "/";
  const t = await getDictionary(/^\/ru(\/|$)/.test(path) ? "ru" : "en");
  return { title: { absolute: t["seo.notFound.title"] }, robots: { index: false } };
}

export default async function GlobalNotFound() {
  const path = (await headers()).get("x-pathname") ?? "/";
  const lang: Locale = /^\/ru(\/|$)/.test(path) ? "ru" : "en";
  const t = await getDictionary(lang);
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SiteChrome lang={lang} t={t} switchPath="/">
          <NotFoundBlock lang={lang} t={t} />
        </SiteChrome>
      </body>
    </html>
  );
}
