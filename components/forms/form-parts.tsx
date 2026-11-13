"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FieldErrors, FormKind } from "@/data/forms";
import { PRIVACY_PATH } from "@/lib/constants";
import { linkPhrase } from "@/lib/rich";

import type { Labels } from "./labels";
export type { Labels };

const MESSAGE_KEY = { required: "form.required", email: "form.invalidEmail", url: "form.invalidUrl", max: "form.tooLong" } as const;

/** Подписи ошибок полей по результату проверки. */
export function errorTexts(errors: FieldErrors, l: Labels): Record<string, string> {
  return Object.fromEntries(Object.entries(errors).map(([k, code]) => [k, l[MESSAGE_KEY[code]]]));
}

/** Скрытая ловушка для ботов: люди её не видят и не заполняют (сервер молча принимает «успех» и ничего не пишет). */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-2500 h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

/** Текст согласия: «Privacy Policy» внутри фразы — подчёркнутая ссылка на английскую страницу (внутри `<label>` чекбокса). */
export function consentText(text: string, phrase: string) {
  return linkPhrase(text, phrase, (p) => (
    <Link href={PRIVACY_PATH} className="underline" target="_blank" rel="noopener">
      {p}
    </Link>
  ));
}

/** Кнопка отправки: sending — disabled + aria-busy, подпись «Sending…» (Figma: button option=dark state=disabled). */
export function SubmitButton({ sending, label, sendingLabel, className, ref }: { sending: boolean; label: string; sendingLabel: string; className?: string; ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <Button ref={ref} type="submit" option="dark" disabled={sending} aria-busy={sending || undefined} className={className}>
      {sending ? sendingLabel : label}
    </Button>
  );
}

export type SendResult = { ok: true } | { ok: false; reason: "network" | "turnstile" | "server" | "invalid" };

/** Отправка на /api/forms/{kind}. Любая ошибка сети или сервера — `ok: false` (в окне покажем «Something went wrong»). */
export async function postForm(kind: FormKind, payload: object, token: string | null, honeypot: string): Promise<SendResult> {
  try {
    const res = await fetch(`/api/forms/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, turnstileToken: token, website: honeypot }),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, reason: body.error === "turnstile" ? "turnstile" : body.error === "invalid" ? "invalid" : "server" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
