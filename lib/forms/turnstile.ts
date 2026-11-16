import "server-only";

/** Проверка токена Cloudflare Turnstile на сервере. Секрет — TURNSTILE_SECRET_KEY . */
export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("Не задана переменная TURNSTILE_SECRET_KEY");
  if (typeof token !== "string" || !token || token.length > 2048) {
    console.warn("[forms] turnstile: no token from the browser (widget failed to load or errored — check allowed domains of the widget)");
    return false;
  }
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Turnstile: ${res.status}`);
  const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  if (data.success !== true) console.warn(`[forms] turnstile: rejected (${(data["error-codes"] ?? []).join(", ") || "no codes"})`);
  return data.success === true;
}
