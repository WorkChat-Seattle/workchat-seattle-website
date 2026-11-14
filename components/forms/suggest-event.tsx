"use client";

import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { parseForm, LIMITS } from "@/data/forms";
import type { Locale } from "@/i18n/config";
import { PRIVACY_LINK_CONSENT } from "@/lib/constants";
import { Checkbox } from "./checkbox";
import { Dialog, MessageDialog } from "./dialog";
import { type Labels, Honeypot, SubmitButton, consentText, errorTexts, postForm } from "./form-parts";
import { FieldError, TextArea, TextField, RequiredNote } from "./text-field";
import { Turnstile, type TurnstileHandle } from "./turnstile";

const EMPTY = { link: "", about: "", name: "", email: "" };

/**
 * «Suggest an event» (Events): кнопка + окно с формой (Figma: modal-suggest-event `1381:13869`; Events / Suggest event: 390 `1381:13870`,
 * 768 `1381:13914`, 1440 `1381:14032`). Поля: ссылка (необязательно), о чём событие, имя, email, согласие. Результат (`modal-message`)
 * заменяет окно формы. Успех — всё закрыто, фокус на кнопку; ошибка — после «Close» снова форма с введёнными данными.
 * Отправка → /api/forms/suggest-event → Notion (Event suggestions).
 */
export function SuggestEvent({ lang, labels: l, buttonClassName }: { lang: Locale; labels: Labels; buttonClassName?: string }) {
  const [view, setView] = useState<"closed" | "form" | "success" | "error">("closed");
  const [v, setV] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const turnstile = useRef<TurnstileHandle>(null);

  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const parsed = parseForm("suggest-event", v);
    const found = parsed.ok ? {} : errorTexts(parsed.errors, l);
    if (!consent) found.consent = l["form.required"];
    if (Object.keys(found).length) {
      setErrors(found);
      const first = ["link", "about", "name", "email", "consent"].find((k) => found[k]);
      document.getElementById(`suggest-${first}`)?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    const token = (await turnstile.current?.getToken()) ?? null;
    const res = await postForm("suggest-event", v, token, trap);
    turnstile.current?.reset();
    setSending(false);
    if (res.ok) {
      setV(EMPTY);
      setConsent(false);
    }
    setView(res.ok ? "success" : "error");
  };

  const focusLater = (el: () => HTMLElement | null) => requestAnimationFrame(() => el()?.focus());

  return (
    <>
      <Button ref={triggerRef} option="dark" className={buttonClassName} aria-haspopup="dialog" onClick={() => setView("form")}>
        {l["btn.suggestEvent"]}
      </Button>

      {view === "form" ? (
        <Dialog
          labelledBy="suggest-title"
          closeLabel={l["btn.close"]}
          onClose={() => {
            if (sending) return;
            setView("closed");
            focusLater(() => triggerRef.current);
          }}
        >
          <form
            noValidate
            onSubmit={onSubmit}
            onFocusCapture={() => void turnstile.current?.prepare()}
            className="relative flex flex-col gap-10 px-5 pb-10 md:px-10 md:pb-12"
          >
            <Honeypot value={trap} onChange={setTrap} />
            <div className="flex flex-col gap-5">
              <h2 id="suggest-title" className="text-h2 text-text-heading">
                {l["events.suggest.title"]}
              </h2>
              <p className="text-body text-text-body">{l["events.suggest.text"]}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <RequiredNote>{l["form.requiredNote"]}</RequiredNote>
              <TextField id="suggest-link" name="link" type="url" autoComplete="off" label={l["events.suggest.link"]} value={v.link} onChange={(x) => set("link", x)} error={errors.link} />
              <TextArea id="suggest-about" label={l["events.suggest.about"]} value={v.about} onChange={(x) => set("about", x)} maxLength={LIMITS.long} error={errors.about} />
              <TextField id="suggest-name" name="name" autoComplete="name" label={l["events.suggest.name"]} value={v.name} onChange={(x) => set("name", x)} error={errors.name} />
              <TextField id="suggest-email" name="email" type="email" autoComplete="email" label={l["form.email"]} value={v.email} onChange={(x) => set("email", x)} error={errors.email} />
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox
                id="suggest-consent"
                name="consent"
                checked={consent}
                onChange={(x) => {
                  setConsent(x);
                  if (x) setErrors((e) => ({ ...e, consent: "" }));
                }}
                invalid={!!errors.consent}
                required
                describedBy={errors.consent ? "suggest-consent-error" : undefined}
              >
                {consentText(l["events.suggest.consent"], PRIVACY_LINK_CONSENT[lang])}
              </Checkbox>
              <FieldError id="suggest-consent-error">{errors.consent}</FieldError>
            </div>
            <div>
              <Turnstile lang={lang} handle={turnstile} />
              <SubmitButton ref={submitRef} sending={sending} label={l["btn.submit"]} sendingLabel={l["btn.sending"]} className="w-full md:w-60" />
            </div>
          </form>
        </Dialog>
      ) : null}

      {view === "success" || view === "error" ? (
        <MessageDialog
          type={view}
          title={view === "success" ? l["modal.success.title"] : l["modal.error.title"]}
          text={view === "success" ? l["modal.success.suggestEvent"] : l["modal.error.suggestEvent"]}
          closeLabel={l["btn.close"]}
          onClose={() => {
            if (view === "success") {
              setView("closed");
              focusLater(() => triggerRef.current);
            } else {
              setView("form");
              focusLater(() => submitRef.current);
            }
          }}
        />
      ) : null}
    </>
  );
}
