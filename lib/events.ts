import { events, type Block, type EventItem, type Speaker } from "@/data/events";

/** Часовой пояс сайта: прошло ли событие, считается в нём, а не в UTC сервера (docs/dynamic-content.md). */
export const SITE_TZ = "America/Los_Angeles";

/** Момент окончания события; если окончания нет — конец дня начала (берём 23:59:59 даты начала в поясе из ISO). */
export function eventEnd(e: EventItem): Date {
  if (e.end) return new Date(e.end);
  // дата начала вида 2026-11-18T18:30:00.000-08:00 → конец того же дня с тем же смещением
  const m = e.start.match(/^(\d{4}-\d{2}-\d{2}).*?([+-]\d{2}:\d{2}|Z)$/);
  return m ? new Date(`${m[1]}T23:59:59${m[2] === "Z" ? "Z" : m[2]}`) : new Date(e.start);
}

export const isPast = (e: EventItem, now: Date = new Date()): boolean => eventEnd(e).getTime() <= now.getTime();

/** Предстоящие: ближайшие сверху. */
export const upcomingEvents = (now: Date = new Date()): EventItem[] =>
  events.filter((e) => !isPast(e, now)).sort((a, b) => a.start.localeCompare(b.start));

/** Прошедшие: последние сверху. */
export const pastEvents = (now: Date = new Date()): EventItem[] =>
  events.filter((e) => isPast(e, now)).sort((a, b) => b.start.localeCompare(a.start));

/** Featured на Home: ближайшее предстоящее. Если предстоящих нет — null, блок не показывается (решено 12.11, заменяет «последнее прошедшее»). */
export const featuredEvent = (now: Date = new Date()): EventItem | null => upcomingEvents(now)[0] ?? null;

export const getEvent = (slug: string): EventItem | undefined => events.find((e) => e.slug === slug);

type Loc = "en" | "ru";

/** Дата: EN «Wednesday, 11/18/2026», RU «Среда, 18 ноября 2026» — в поясе сайта (вкладка «Общее», date.format). */
export function formatDate(iso: string, lang: Loc): string {
  const d = new Date(iso);
  if (lang === "en") {
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: SITE_TZ }).format(d);
    const rest = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone: SITE_TZ }).format(d);
    return `${wd}, ${rest}`;
  }
  const wd = new Intl.DateTimeFormat("ru-RU", { weekday: "long", timeZone: SITE_TZ }).format(d);
  const rest = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: SITE_TZ }).format(d);
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)}, ${rest.replace(/\s*г\.$/, "")}`;
}

/** Время: EN «6:30 PM - 8:30 PM», RU «18:30–20:30» (24 часа, короткое тире без пробелов) — вкладка «Event page», eventPage.time. */
export function formatTime(startIso: string, endIso: string | null, lang: Loc): string {
  const f = (iso: string) =>
    new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ru-RU", {
      hour: lang === "en" ? "numeric" : "2-digit",
      minute: "2-digit",
      hour12: lang === "en",
      timeZone: SITE_TZ,
    }).format(new Date(iso));
  if (!endIso) return f(startIso);
  return lang === "en" ? `${f(startIso)} - ${f(endIso)}` : `${f(startIso)}–${f(endIso)}`;
}

/** Порядок тегов в фильтре — как в Figma (docs/dynamic-content.md, «Поля баз»); неизвестные теги идут в конце. */
export const TAG_ORDER = [
  "Career Growth",
  "Family&Career",
  "Goal setting",
  "Hands-on AI",
  "Industry Insights",
  "Job Search",
  "Networking",
  "Personal Brand",
  "Personal Finance",
  "Well-Being",
];

/** Поля с запасным английским: если RU-поле пустое — показываем EN (ru-version.md). */
export const eventTitle = (e: EventItem, lang: Loc): string => (lang === "ru" && e.titleRu) || e.title;
export const eventShort = (e: EventItem, lang: Loc): string => (lang === "ru" && e.shortRu) || e.short;
export const eventDescription = (e: EventItem, lang: Loc): Block[] =>
  lang === "ru" && e.descriptionRu.length ? e.descriptionRu : e.description;
export const speakerBio = (s: Speaker, lang: Loc): string => (lang === "ru" && s.bioRu) || s.bio;

/** Город и штат из последней строки адреса: «Redmond, WA 98052» → «Redmond, WA». */
export function cityOf(address: string | null): string | null {
  const last = address?.split("\n").map((l) => l.trim()).filter(Boolean).pop();
  const m = last?.match(/^(.+?,\s*[A-Z]{2})\b/);
  return m ? m[1] : (last ?? null);
}

/**
 * Подпись места на карточках и в деталях: очное — «Город, ШТ» из адреса; онлайн — Place name из Notion
 * («Online live webinar»), а если его нет — «Online» / «Онлайн» (format.Online).
 */
export function locationLabel(e: EventItem, onlineLabel: string): string {
  if (e.format === "Online" || !e.address) return e.placeName ?? onlineLabel;
  return cityOf(e.address) ?? e.placeName ?? onlineLabel;
}
