import "server-only";
import type { FormKind } from "@/data/forms";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { FORMS_TO_EMAIL, SEND_CONFIRMATION_EMAILS, SEND_FORM_EMAILS } from "@/lib/constants";

const SUBJECT: Record<FormKind, string> = {
  mentor: "Become a mentor",
  volunteer: "Volunteer",
  "suggest-event": "Suggest an event",
};

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/**
 * Письмо команде через Resend: все ответы + ссылка на запись в Notion (или пометка «not saved to Notion»), Reply-To — email отправителя.
 * Тема — «[Website] Become a mentor — Anna Petrova». Возвращает false, если отправка выключена флагом SEND_FORM_EMAILS
 * или не настроена (нет RESEND_API_KEY / FORMS_FROM_EMAIL) — это не ошибка. Бросает исключение, если Resend ответил отказом.
 */
export async function sendFormEmail(kind: FormKind, value: object, notionUrl: string | null): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;
  if (!SEND_FORM_EMAILS) return false;
  if (!key || !from) {
    // отправка включена, но не настроена — пропуск не должен быть молчаливым
    const missing = [!key && "RESEND_API_KEY", !from && "FORMS_FROM_EMAIL"].filter(Boolean).join(", ");
    console.warn(`[forms] email skipped: SEND_FORM_EMAILS is true but ${missing} is not set`);
    return false;
  }

  const v = value as Record<string, unknown>;
  const name = typeof v.name === "string" ? v.name : "";
  const lines = Object.entries(v).map(([k, val]) => `${k}: ${Array.isArray(val) ? val.join("; ") : String(val || "—")}`);
  const text = [...lines, "", notionUrl ? `Notion: ${notionUrl}` : "NOT SAVED TO NOTION — please add this submission manually."].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [FORMS_TO_EMAIL],
      reply_to: typeof v.email === "string" ? v.email : undefined,
      subject: oneLine(`[Website] ${SUBJECT[kind]}${name ? ` — ${name}` : ""}`),
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return true;
}

const THANKS_KEY = { mentor: "email.thanks.mentor", volunteer: "email.thanks.volunteer", "suggest-event": "email.thanks.suggestEvent" } as const;

/**
 * Письмо-благодарность отправителю: простой текст из ключей email.thanks.* (greeting с {name} → текст формы → reply → signature).
 * Ответы пользователя в письмо не попадают, кроме имени (иначе форму можно использовать для рассылки своего текста на чужие адреса).
 * Выключено флагом SEND_CONFIRMATION_EMAILS. Reply-To — почта команды. Бросает исключение при отказе Resend (вызывающий только логирует).
 */
export async function sendConfirmationEmail(kind: FormKind, value: object, lang: Locale): Promise<boolean> {
  if (!SEND_CONFIRMATION_EMAILS) return false;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;
  const v = value as Record<string, unknown>;
  const to = typeof v.email === "string" ? oneLine(v.email) : "";
  if (!key || !from || !to) {
    console.warn("[forms] confirmation email skipped: RESEND_API_KEY / FORMS_FROM_EMAIL / recipient email is missing");
    return false;
  }
  const t = await getDictionary(lang);
  // имя — единственное, что берём у пользователя; переносы строк убираем
  const name = typeof v.name === "string" ? oneLine(v.name).slice(0, 100) : "";
  const text = [t["email.thanks.greeting"].replace("{name}", name), t[THANKS_KEY[kind]], t["email.thanks.reply"], t["email.thanks.signature"]].join("\n\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `WorkChat Seattle <${from.replace(/^.*<(.+)>$/, "$1")}>`,
      to: [to],
      reply_to: FORMS_TO_EMAIL,
      subject: t["email.thanks.subject"],
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return true;
}
