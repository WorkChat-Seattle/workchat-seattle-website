import "server-only";
import type { FormKind } from "@/data/forms";
import { FORMS_TO_EMAIL, SEND_FORM_EMAILS } from "@/lib/constants";

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
