import "server-only";

/** Проверка токена Cloudflare Turnstile на сервере. Секрет — TURNSTILE_SECRET_KEY (пока тестовый ключ Cloudflare, всегда пропускает). */
export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("Не задана переменная TURNSTILE_SECRET_KEY");
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Turnstile: ${res.status}`);
  return ((await res.json()) as { success?: boolean }).success === true;
}
