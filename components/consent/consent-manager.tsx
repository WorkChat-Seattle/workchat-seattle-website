"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { type Choice, OPEN_SETTINGS_EVENT, saveConsent, useConsent } from "@/lib/consent";
import { CookieSettings } from "./cookie-settings";
import type { ConsentLabels } from "./labels";

/**
 * Cookie-баннер (Figma: cookie-banner type=notice) и окно настроек (docs/cookie-consent.md).
 * Баннер — до первого выбора; не показывается при GPC. Desktop: карточка 480 в 40 px от левого нижнего угла,
 * tablet / mobile: плашка во всю ширину внизу. Без затемнения, без ловушки фокуса: `role="region"`.
 * Окно открывается из баннера и из футера (событие `wc:cookie-settings`); после закрытия фокус возвращается на открывшую кнопку.
 */
export function ConsentManager({ lang, labels }: { lang: Locale; labels: ConsentLabels }) {
  const consent = useConsent();
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  const openSettings = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => document.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, [openSettings]);

  const close = () => {
    setOpen(false);
    const el = opener.current;
    if (el?.isConnected) requestAnimationFrame(() => el.focus());
  };

  const save = (c: Choice) => {
    saveConsent(c);
    close();
  };

  const showBanner = consent.ready && !consent.gpc && !consent.saved;

  return (
    <>
      {showBanner ? (
        <section
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-10 bg-bg-card-neutral p-5 shadow-banner md:p-10 xl:inset-x-auto xl:bottom-10 xl:left-10 xl:w-120"
        >
          <div className="flex flex-col gap-5">
            <p id="cookie-banner-title" className="text-feature text-text-heading">
              {labels["cookie.banner.title"]}
            </p>
            <p className="text-body text-text-body">{labels["cookie.banner.text"]}</p>
          </div>
          <div className="flex flex-col gap-2.5 md:flex-row">
            <Button option="dark" onClick={() => saveConsent(consent.choice)} className="md:flex-1">
              {labels["cookie.banner.accept"]}
            </Button>
            <Button option="outlined" onClick={openSettings} className="md:flex-1">
              {labels["cookie.banner.settings"]}
            </Button>
          </div>
        </section>
      ) : null}
      {open ? <CookieSettings lang={lang} labels={labels} initial={consent.choice} onSave={save} onClose={close} /> : null}
    </>
  );
}
