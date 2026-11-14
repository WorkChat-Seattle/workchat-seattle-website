"use client";

import { type FormEvent, useRef, useState } from "react";
import { HELP_OPTIONS, MENTOR_LINK_PHRASE, TIME_OPTIONS, LIMITS, parseForm } from "@/data/forms";
import { type Locale, localePath } from "@/i18n/config";
import { PRIVACY_LINK_CONSENT } from "@/lib/constants";
import { linkPhrase } from "@/lib/rich";
import { Checkbox } from "./checkbox";
import { MessageDialog } from "./dialog";
import { type Labels, Honeypot, SubmitButton, consentText, errorTexts, postForm } from "./form-parts";
import { SelectField } from "./select-field";
import { FieldError, TextArea, TextField } from "./text-field";
import { Turnstile, type TurnstileHandle } from "./turnstile";

const EMPTY = { name: "", email: "", linkedin: "", help: [] as string[], time: [] as string[], notes: "" };

/**
 * Форма «Volunteer» (id="volunteer-form"; Figma: volunteer-form `1088:1734`): имя, email, LinkedIn, чем помочь (несколько), время в месяц,
 * заметки (необязательно), согласие. Вариант «Mentor» содержит ссылку на форму ментора — в новой вкладке, чтобы не потерять введённое.
 * Отправка → /api/forms/volunteer → Notion (Volunteers: запись по email дополняется, не перезаписывается).
 */
export function VolunteerForm({ lang, labels: l }: { lang: Locale; labels: Labels }) {
  const [v, setV] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const turnstile = useRef<TurnstileHandle>(null);

  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const payload = { ...v, time: v.time[0] ?? "" };
    const parsed = parseForm("volunteer", payload);
    const found = parsed.ok ? {} : errorTexts(parsed.errors, l);
    if (!consent) found.consent = l["form.required"];
    if (Object.keys(found).length) {
      setErrors(found);
      const first = ["name", "email", "linkedin", "help", "time", "notes", "consent"].find((k) => found[k]);
      document.getElementById(`volunteer-${first}`)?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    const token = (await turnstile.current?.getToken()) ?? null;
    const res = await postForm("volunteer", payload, token, trap);
    turnstile.current?.reset();
    setSending(false);
    if (res.ok) {
      setV(EMPTY);
      setConsent(false);
    }
    setResult(res.ok ? "success" : "error");
  };

  const closeResult = () => {
    const ok = result === "success";
    setResult(null);
    requestAnimationFrame(() => {
      if (ok) {
        formRef.current?.focus();
        formRef.current?.scrollIntoView({ block: "start" });
      } else submitRef.current?.focus();
    });
  };

  const count = (n: number) => l["form.selectedCount"].replace("{n}", String(n));
  const mentorPhrase = MENTOR_LINK_PHRASE[lang];

  const helpOptions = HELP_OPTIONS.map((h) => {
    const text = l[`help.${h}`];
    return {
      value: h,
      text,
      label:
        h === "Mentor"
          ? linkPhrase(text, mentorPhrase, (p) => (
              <>
                <a href={`${localePath(lang, "/mentorship")}#mentor-form`} target="_blank" rel="noopener" className="underline">
                  {p}
                  <span className="sr-only"> {l["a11y.newTab"]}</span>
                </a>
              </>
            ))
          : text,
    };
  });

  return (
    <>
      <form
        ref={formRef}
        tabIndex={-1}
        noValidate
        onSubmit={onSubmit}
        onFocusCapture={() => void turnstile.current?.prepare()}
        className="relative mt-10 flex flex-col gap-10 outline-none xl:max-w-150"
      >
        <Honeypot value={trap} onChange={setTrap} />
        <div className="flex flex-col gap-2.5">
          <TextField id="volunteer-name" name="name" autoComplete="name" label={l["form.name"]} value={v.name} onChange={(x) => set("name", x)} error={errors.name} />
          <TextField id="volunteer-email" name="email" type="email" autoComplete="email" label={l["form.email"]} value={v.email} onChange={(x) => set("email", x)} error={errors.email} />
          <TextField id="volunteer-linkedin" name="linkedin" type="url" autoComplete="url" label={l["form.linkedin"]} value={v.linkedin} onChange={(x) => set("linkedin", x)} error={errors.linkedin} />
          <SelectField
            id="volunteer-help"
            mode="multi"
            label={l["volunteer.form.help.label"]}
            hint={l["mentorship.form.meet.hint"]}
            options={helpOptions}
            value={v.help}
            onChange={(x) => set("help", x)}
            error={errors.help}
            countText={count}
          />
          <SelectField
            id="volunteer-time"
            mode="single"
            label={l["mentorship.form.time.label"]}
            hint={l["mentorship.form.time.hint"]}
            options={TIME_OPTIONS.map((t) => ({ value: t, text: l[`time.${t}`] }))}
            value={v.time}
            onChange={(x) => set("time", x)}
            error={errors.time}
            countText={count}
          />
          <TextArea id="volunteer-notes" label={l["volunteer.form.notes"]} value={v.notes} onChange={(x) => set("notes", x)} maxLength={LIMITS.long} error={errors.notes} />
        </div>

        <div className="flex flex-col gap-2 md:pl-43 xl:pl-0">
          <Checkbox
            id="volunteer-consent"
            name="consent"
            checked={consent}
            onChange={(x) => {
              setConsent(x);
              if (x) setErrors((e) => ({ ...e, consent: "" }));
            }}
            invalid={!!errors.consent}
            describedBy={errors.consent ? "volunteer-consent-error" : undefined}
          >
            {consentText(l["volunteer.form.consent"], PRIVACY_LINK_CONSENT[lang])}
          </Checkbox>
          <FieldError id="volunteer-consent-error">{errors.consent}</FieldError>
        </div>

        <div className="md:pl-43 xl:pl-0">
          <Turnstile lang={lang} handle={turnstile} />
          <SubmitButton ref={submitRef} sending={sending} label={l["volunteer.form.submit"]} sendingLabel={l["btn.sending"]} className="w-full md:w-fit md:min-w-60" />
        </div>
      </form>

      {result ? (
        <MessageDialog
          type={result}
          title={result === "success" ? l["modal.success.title"] : l["modal.error.title"]}
          text={result === "success" ? l["modal.success.mentorVolunteer"] : l["modal.error.text"]}
          closeLabel={l["btn.close"]}
          onClose={closeResult}
        />
      ) : null}
    </>
  );
}
