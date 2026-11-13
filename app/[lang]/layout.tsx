import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { organizationGraph } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

// metadataBase — адрес сайта для всех абсолютных ссылок в метаданных; title / description / превью — у каждой страницы (lib/seo.ts)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    // suppressHydrationWarning: скрипт в <head> до отрисовки ставит класс `js` (animations.md, общие правила)
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Скрытие до появления включается только с JS и без prefers-reduced-motion */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <JsonLd data={organizationGraph(t)} />
        <SiteChrome lang={lang} t={t}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
