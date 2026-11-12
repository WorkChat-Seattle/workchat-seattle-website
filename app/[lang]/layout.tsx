import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-button-dark focus:px-4 focus:py-2 focus:text-button focus:text-button-text-light"
        >
          {t["a11y.skipToContent"]}
        </a>
        <SiteHeader
          lang={lang}
          labels={{
            about: t["nav.about"],
            events: t["nav.events"],
            mentorship: t["nav.mentorship"],
            volunteer: t["nav.volunteer"],
            donate: t["nav.donate"],
            openMenu: t["a11y.openMenu"],
            closeMenu: t["a11y.closeMenu"],
            language: t["a11y.lang"],
            navMain: t["a11y.navMain"],
            newTab: t["a11y.newTab"],
          }}
        />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} t={t} />
      </body>
    </html>
  );
}
