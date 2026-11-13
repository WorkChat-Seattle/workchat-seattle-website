"use client";

import Script from "next/script";
import { useEffect } from "react";
import { deleteAnalyticsCookies, useConsent } from "@/lib/consent";

type GtagWindow = Record<string, unknown> & { gtag?: (...a: unknown[]) => void };

/**
 * Google Analytics 4 с Consent Mode v2 (docs/cookie-consent.md). Скрипт грузится только при включённой категории Analytics;
 * `ad_storage`, `ad_user_data`, `ad_personalization` — всегда denied. Выключение останавливает сбор и удаляет `_ga*`.
 * Без NEXT_PUBLIC_GA_ID (заглушка до запуска) компонент ничего не делает.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const { ready, choice } = useConsent();
  const on = ready && choice.analytics;

  useEffect(() => {
    if (!GA_ID || !ready) return;
    const w = window as unknown as GtagWindow;
    w[`ga-disable-${GA_ID}`] = !on;
    if (!on) {
      w.gtag?.("consent", "update", { analytics_storage: "denied" });
      deleteAnalyticsCookies();
    }
  }, [on, ready]);

  if (!GA_ID || !on) return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script id="ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
