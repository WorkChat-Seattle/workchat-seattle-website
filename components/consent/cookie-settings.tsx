"use client";

import { useState } from "react";
import { Dialog } from "@/components/forms/dialog";
import { Button } from "@/components/ui/button";
import { type Choice, ALL_OFF, ALL_ON } from "@/lib/consent";
import { PRIVACY_LINK_TEXT, PRIVACY_PATH } from "@/lib/constants";
import { linkPhrase } from "@/lib/rich";
import type { Locale } from "@/i18n/config";
import type { ConsentLabels } from "./labels";
import { ToggleVisual } from "./toggle";

/** В русском тексте окна ссылка стоит в предложном падеже («в Политике конфиденциальности»), а не как в PRIVACY_LINK_TEXT. */
const RU_PHRASE = "Политике конфиденциальности";

/**
 * Окно настроек cookies (Figma: cookie-settings `1457:25583`; desktop 680, tablet 640, mobile — весь экран).
 * Окно — тот же `Dialog`, что у форм: `role="dialog"` `aria-modal`, ловушка фокуса, Esc / крестик закрывают без сохранения.
 * Категория Hotjar (session replay) не показывается, пока сервис не подключён.
 */
export function CookieSettings({
  lang,
  labels,
  initial,
  onSave,
  onClose,
}: {
  lang: Locale;
  labels: ConsentLabels;
  initial: Choice;
  onSave: (c: Choice) => void;
  onClose: () => void;
}) {
  const [choice, setChoice] = useState<Choice>(initial);
  const l = labels;
  const row = "flex flex-col gap-2.5 border-t border-border-divider py-5";

  const category = (key: "analytics" | "embedded") => (
    <div className={row}>
      <button
        type="button"
        role="switch"
        aria-checked={choice[key]}
        aria-describedby={`cookie-${key}-text`}
        onClick={() => setChoice((c) => ({ ...c, [key]: !c[key] }))}
        className="-my-2.5 flex w-full cursor-pointer items-center gap-5 py-2.5 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-decor-accent"
      >
        <span className="text-feature flex-1 text-text-heading">{l[`cookie.${key}.title`]}</span>
        <ToggleVisual on={choice[key]} />
      </button>
      <p id={`cookie-${key}-text`} className="text-body text-text-body">
        {l[`cookie.${key}.text`]}
      </p>
    </div>
  );

  return (
    <Dialog labelledBy="cookie-settings-title" closeLabel={l["btn.close"]} onClose={onClose}>
      <div className="flex flex-col gap-10 px-5 pb-10 md:px-10 md:pb-12">
        <div className="flex flex-col gap-5">
          <h2 id="cookie-settings-title" className="text-h2 text-text-heading">
            {l["cookie.settings.title"]}
          </h2>
          <p className="text-body text-text-body">
            {linkPhrase(l["cookie.settings.text"], lang === "ru" ? RU_PHRASE : PRIVACY_LINK_TEXT.en, (phrase) => (
              <a href={PRIVACY_PATH} target="_blank" rel="noopener noreferrer" className="underline">
                {phrase}
                <span className="sr-only"> {l["a11y.newTab"]}</span>
              </a>
            ))}
          </p>
        </div>

        <div className="border-b border-border-divider">
          <div className={row}>
            <div className="flex items-center gap-5">
              <p className="text-feature flex-1 text-text-heading">{l["cookie.necessary.title"]}</p>
              <div className="flex items-center gap-2.5">
                <span className="text-caption text-text-muted">{l["cookie.necessary.always"]}</span>
                <ToggleVisual on locked />
              </div>
            </div>
            <p className="text-body text-text-body">{l["cookie.necessary.text"]}</p>
          </div>
          {category("analytics")}
          {category("embedded")}
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          <Button option="outlined" onClick={() => onSave(ALL_OFF)}>
            {l["cookie.rejectAll"]}
          </Button>
          <Button option="outlined" onClick={() => onSave(ALL_ON)}>
            {l["cookie.acceptAll"]}
          </Button>
          <Button option="dark" onClick={() => onSave(choice)} className="col-span-2 md:col-span-1">
            {l["cookie.save"]}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
