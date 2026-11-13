import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

// Заглушка: настоящие title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = {
  title: "WorkChat Seattle",
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
        <SiteChrome lang={lang} t={t}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
