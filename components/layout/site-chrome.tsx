import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Analytics } from "@/components/consent/analytics";
import { ConsentManager } from "@/components/consent/consent-manager";
import { consentLabels } from "@/components/consent/labels";
import { RevealController } from "./reveal-controller";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * Общая рамка страницы: skip-ссылка, шапка, <main id="main">, футер. Её используют корневой layout
 * `app/[lang]/layout.tsx` и страница 404 (`app/global-not-found.tsx`), у которой своего layout нет.
 * `switchPath` — куда ведёт переключатель EN / RU (на 404 — главная, а не несуществующий адрес).
 */
export function SiteChrome({
  lang,
  t,
  children,
  switchPath,
}: {
  lang: Locale;
  t: Dictionary;
  children: ReactNode;
  switchPath?: string;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-button-dark focus:px-4 focus:py-2 focus:text-button focus:text-button-text-light"
      >
        {t["a11y.skipToContent"]}
      </a>
      <SiteHeader
        lang={lang}
        switchPath={switchPath}
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
      <RevealController />
      <ConsentManager lang={lang} labels={consentLabels(t)} />
      <Analytics />
    </>
  );
}
