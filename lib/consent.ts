/**
 * Выбор cookies посетителя (docs/cookie-consent.md, «Поведение в коде»). Только для клиентских компонентов.
 * Хранится в first-party cookie `wc_consent` 12 месяцев: версия, дата, категории. При смене списка сервисов
 * поднять CONSENT_VERSION — баннер покажется снова.
 * Модель: без сохранённого выбора Analytics и Embedded content включены (кроме сигнала GPC — тогда выключены, баннера нет).
 * Явный выбор (в том числе «Show map» при GPC) сильнее GPC.
 */
import { useSyncExternalStore } from "react";

export const CONSENT_COOKIE = "wc_consent";
export const CONSENT_VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 365;
/** Событие, по которому открывается окно настроек (футер, баннер): `document.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))`. */
export const OPEN_SETTINGS_EVENT = "wc:cookie-settings";

export type Choice = { analytics: boolean; embedded: boolean };
export const ALL_ON: Choice = { analytics: true, embedded: true };
export const ALL_OFF: Choice = { analytics: false, embedded: false };

export type ConsentSnapshot = {
  /** false на сервере и до первой отрисовки в браузере: ничего не показываем и не грузим. */
  ready: boolean;
  /** Global Privacy Control. */
  gpc: boolean;
  /** Сохранённый выбор; null — выбора не было (или версия устарела). */
  saved: Choice | null;
  /** Действующие значения: сохранённый выбор или значения по умолчанию. */
  choice: Choice;
};

const SERVER_SNAPSHOT: ConsentSnapshot = { ready: false, gpc: false, saved: null, choice: ALL_ON };
let snapshot: ConsentSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function readSaved(): Choice | null {
  try {
    const m = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
    if (!m) return null;
    const v = JSON.parse(decodeURIComponent(m.slice(CONSENT_COOKIE.length + 1)));
    if (v?.v !== CONSENT_VERSION || typeof v.analytics !== "boolean" || typeof v.embedded !== "boolean") return null;
    return { analytics: v.analytics, embedded: v.embedded };
  } catch {
    return null;
  }
}

function build(saved: Choice | null, gpc: boolean): ConsentSnapshot {
  return { ready: true, gpc, saved, choice: saved ?? (gpc ? ALL_OFF : ALL_ON) };
}

function getSnapshot(): ConsentSnapshot {
  if (!snapshot.ready) {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    snapshot = build(readSaved(), gpc);
  }
  return snapshot;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useConsent(): ConsentSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}

/** Сохраняет выбор в cookie и сообщает подписчикам. */
export function saveConsent(choice: Choice) {
  const value = encodeURIComponent(JSON.stringify({ v: CONSENT_VERSION, t: Date.now(), ...choice }));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  snapshot = build({ ...choice }, getSnapshot().gpc);
  listeners.forEach((l) => l());
}

export function openCookieSettings() {
  document.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Удаляет cookies Google Analytics (`_ga`, `_ga_*`, `_gid`, `_gat*`) на всех возможных доменах. */
export function deleteAnalyticsCookies() {
  const names = document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((n) => n === "_ga" || n === "_gid" || n.startsWith("_ga_") || n.startsWith("_gat"));
  const parts = location.hostname.split(".");
  const domains = [location.hostname, ...parts.slice(1, -1).map((_, i) => `.${parts.slice(i + 1).join(".")}`)];
  for (const n of names) {
    document.cookie = `${n}=; Max-Age=0; Path=/`;
    for (const d of domains) document.cookie = `${n}=; Max-Age=0; Path=/; Domain=${d}`;
  }
}
