"use client";

import { type FormEvent, useRef, useState } from "react";
import {
  MAX_TOPICS,
  MEET_OPTIONS,
  MENTOR_TOPICS,
  OTHER_TOPIC,
  TIME_OPTIONS,
  parseForm,
} from "@/data/forms";
import type { Locale } from "@/i18n/config";
import { PRIVACY_LINK_CONSENT } from "@/lib/constants";
import { Checkbox } from "./checkbox";
import { MessageDialog } from "./dialog";
import { type Labels, Honeypot, SubmitButton, consentText, errorTexts, postForm } from "./form-parts";
import { SelectField } from "./select-field";
import { FieldError, TextField, RequiredNote } from "./text-field";
import { Turnstile, type TurnstileHandle } from "./turnstile";

/**
 * Форма «Become a mentor» (Mentorship, id="mentor-form"; Figma: mentor-form `1088:1738`): имя, email, LinkedIn, темы (1–5, «Other» —
 * с текстовым полем), время в месяц, формат встреч, согласие. Поля на всю ширину; на tablet согласие и кнопка — со 2-й колонки.
 * Отправка → /api/forms/mentor → Notion (Mentor cards + Volunteers). После успеха форма очищается, фокус — на начало формы.
 */
export function MentorForm({ lang, labels: l }: { lang: Locale; labels: Labels }) {
  const [v, setV] = useState({ name: "", email: "", linkedin: "", topics: [] as string[], otherTopic: "", time: [] as string[], meet: [] as string[] });
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
    const parsed = parseForm("mentor", payload);
    const found = parsed.ok ? {} : errorTexts(parsed.errors, l);
    if (!consent) found.consent = l["form.required"];
    if (Object.keys(found).length) {
      setErrors(found);
      const first = ["name", "email", "linkedin", "topics", "otherTopic", "time", "meet", "consent"].find((k) => found[k]);
      document.getElementById(`mentor-${first}`)?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    const token = (await turnstile.current?.getToken()) ?? null;
    const res = await postForm("mentor", payload, token, trap);
    turnstile.current?.reset();
    setSending(false);
    if (res.ok) {
      setV({ name: "", email: "", linkedin: "", topics: [], otherTopic: "", time: [], meet: [] });
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

  const hasOther = v.topics.includes(OTHER_TOPIC);
  const count = (n: number) => l["form.selectedCount"].replace("{n}", String(n));

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
          <RequiredNote>{l["form.requiredNote"]}</RequiredNote>
          <TextField id="mentor-name" name="name" autoComplete="name" label={l["form.name"]} value={v.name} onChange={(x) => set("name", x)} error={errors.name} />
          <TextField id="mentor-email" name="email" type="email" autoComplete="email" label={l["form.email"]} value={v.email} onChange={(x) => set("email", x)} error={errors.email} />
          <TextField id="mentor-linkedin" name="linkedin" type="url" autoComplete="url" label={l["form.linkedin"]} value={v.linkedin} onChange={(x) => set("linkedin", x)} error={errors.linkedin} />
          <SelectField
            requiredText={l["a11y.required"]}
            id="mentor-topics"
            mode="multi"
            label={l["mentorship.form.topics.label"]}
            hint={l["mentorship.form.topics.hint"]}
            options={MENTOR_TOPICS.map((t) => ({ value: t, text: l[`topic.${t}`] }))}
            value={v.topics}
            onChange={(x) => set("topics", x)}
            max={MAX_TOPICS}
            error={errors.topics}
            countText={count}
          />
          {hasOther ? (
            <TextField id="mentor-otherTopic" name="otherTopic" label={`${l["topic.Other"]} ${l["form.otherTopic"]}`} value={v.otherTopic} onChange={(x) => set("otherTopic", x)} error={errors.otherTopic} />
          ) : null}
          <SelectField
            requiredText={l["a11y.required"]}
            id="mentor-time"
            mode="single"
            label={l["mentorship.form.time.label"]}
            hint={l["mentorship.form.time.hint"]}
            options={TIME_OPTIONS.map((t) => ({ value: t, text: l[`time.${t}`] }))}
            value={v.time}
            onChange={(x) => set("time", x)}
            error={errors.time}
            countText={count}
          />
          <SelectField
            requiredText={l["a11y.required"]}
            id="mentor-meet"
            mode="multi"
            label={l["mentorship.form.meet.label"]}
            hint={l["mentorship.form.meet.hint"]}
            options={MEET_OPTIONS.map((t) => ({ value: t, text: l[`meet.${t}`] }))}
            value={v.meet}
            onChange={(x) => set("meet", x)}
            error={errors.meet}
            countText={count}
          />
        </div>

        <div className="flex flex-col gap-2 md:pl-43 xl:pl-0">
          <Checkbox
            id="mentor-consent"
            name="consent"
            checked={consent}
            onChange={(x) => {
              setConsent(x);
              if (x) setErrors((e) => ({ ...e, consent: "" }));
            }}
            invalid={!!errors.consent}
            required
            describedBy={errors.consent ? "mentor-consent-error" : undefined}
          >
            {consentText(l["mentorship.form.consent"], PRIVACY_LINK_CONSENT[lang])}
          </Checkbox>
          <FieldError id="mentor-consent-error">{errors.consent}</FieldError>
        </div>

        <div className="md:pl-43 xl:pl-0">
          <Turnstile lang={lang} handle={turnstile} />
          <SubmitButton ref={submitRef} sending={sending} label={l["mentorship.form.submit"]} sendingLabel={l["btn.sending"]} className="w-full md:w-fit md:min-w-60" />
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
