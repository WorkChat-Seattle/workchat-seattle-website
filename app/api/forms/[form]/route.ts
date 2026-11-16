import { FORM_KINDS, type FormKind, parseForm } from "@/data/forms";
import { hasLocale } from "@/i18n/config";
import { sendConfirmationEmail, sendFormEmail } from "@/lib/forms/email";
import { saveMentor, saveSuggestion, saveVolunteer } from "@/lib/forms/notion";
import { verifyTurnstile } from "@/lib/forms/turnstile";

export const runtime = "nodejs";

const json = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * POST /api/forms/{mentor | volunteer | suggest-event} (docs/forms-to-notion.md, «Поток отправки»):
 * honeypot → проверка полей → Turnstile → запись в Notion → письмо (если включено). Ответ клиенту: { ok: true } или { ok: false, error }.
 * Запись в Notion = успех; письмо не удалось — только в лог. Notion недоступен, но письмо ушло — тоже успех (с пометкой в письме).
 */
export async function POST(request: Request, ctx: RouteContext<"/api/forms/[form]">) {
  const { form } = await ctx.params;
  if (!(FORM_KINDS as readonly string[]).includes(form)) return json({ ok: false, error: "not_found" }, 404);
  const kind = form as FormKind;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot: скрытое поле заполняют только боты — отвечаем «успехом», ничего не записывая.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });

  const parsed = parseForm(kind, body);
  if (!parsed.ok) return json({ ok: false, error: "invalid", fields: parsed.errors }, 422);

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (!(await verifyTurnstile(body.turnstileToken, ip))) return json({ ok: false, error: "turnstile" }, 403);
  } catch (e) {
    console.error("[forms] Turnstile", e);
    return json({ ok: false, error: "server" }, 502);
  }

  let notionUrl: string | null = null;
  try {
    const saved =
      kind === "mentor"
        ? await saveMentor(parsed.value as never)
        : kind === "volunteer"
          ? await saveVolunteer(parsed.value as never)
          : await saveSuggestion(parsed.value as never);
    notionUrl = saved.url;
    console.info(`[forms] ${kind}: Notion ${notionUrl}`);
  } catch (e) {
    console.error(`[forms] ${kind}: Notion не принял запись`, e);
  }

  try {
    const sent = await sendFormEmail(kind, parsed.value, notionUrl);
    if (!notionUrl && !sent) return json({ ok: false, error: "server" }, 502);
  } catch (e) {
    console.error(`[forms] ${kind}: письмо не отправлено`, e);
    if (!notionUrl) return json({ ok: false, error: "server" }, 502);
  }

  // Благодарность отправителю: язык — со страницы формы (проверяем), ошибка не ломает форму.
  const lang = typeof body.lang === "string" && hasLocale(body.lang) ? body.lang : "en";
  try {
    await sendConfirmationEmail(kind, parsed.value, lang);
  } catch (e) {
    console.warn(`[forms] ${kind}: письмо-благодарность не отправлено`, e);
  }
  return json({ ok: true });
}
