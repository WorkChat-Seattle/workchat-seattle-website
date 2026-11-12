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
    <html lang={lang} className={fontVariables}>
      <body>
        <SiteChrome lang={lang} t={t}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
