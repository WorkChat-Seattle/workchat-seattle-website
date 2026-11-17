import { events, type Block, type EventItem, type Speaker } from "@/data/events";

/** Часовой пояс сайта: прошло ли событие, считается в нём, а не в UTC сервера (docs/dynamic-content.md). */
export const SITE_TZ = "America/Los_Angeles";

/** Только дата, без времени («2019-08-09»): так Notion отдаёт события, у которых в Date не включено время. */
export const isDateOnly = (iso: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(iso);

/** Смещение пояса сайта в этот день, вида «-08:00» / «-07:00» (зимнее и летнее время). */
function siteOffset(day: string): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: SITE_TZ, timeZoneName: "longOffset" })
    .formatToParts(new Date(`${day}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  const m = name?.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : "Z";
}

/** День (YYYY-MM-DD) в поясе сайта: для даты без времени — она сама, для момента со временем — день в Сиэтле. */
function siteDay(iso: string): string {
  if (isDateOnly(iso)) return iso;
  return new Intl.DateTimeFormat("en-CA", { timeZone: SITE_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

/** 23:59:59 этого дня в поясе сайта. */
const siteEndOfDay = (day: string): Date => new Date(`${day}T23:59:59${siteOffset(day)}`);

/**
 * Момент окончания события. Окончание со временем — как есть; окончание без времени — конец этого дня в Сиэтле;
 * окончания нет — конец дня начала в Сиэтле (и для начала со временем, и для начала без времени).
 */
export function eventEnd(e: EventItem): Date {
  if (e.end) return isDateOnly(e.end) ? siteEndOfDay(e.end) : new Date(e.end);
  return siteEndOfDay(siteDay(e.start));
}

export const isPast = (e: EventItem, now: Date = new Date()): boolean => eventEnd(e).getTime() <= now.getTime();

/** Предстоящие: ближайшие сверху. */
export const upcomingEvents = (now: Date = new Date()): EventItem[] =>
  events.filter((e) => !isPast(e, now)).sort((a, b) => a.start.localeCompare(b.start));

/** Прошедшие: последние сверху. */
export const pastEvents = (now: Date = new Date()): EventItem[] =>
  events.filter((e) => isPast(e, now)).sort((a, b) => b.start.localeCompare(a.start));

/** Featured на Home: ближайшее предстоящее; если предстоящих нет — последнее прошедшее (docs/decisions-2026-11-05.md, п. 5). */
export const featuredEvent = (now: Date = new Date()): EventItem | null =>
  upcomingEvents(now)[0] ?? pastEvents(now)[0] ?? null;

export const getEvent = (slug: string): EventItem | undefined => events.find((e) => e.slug === slug);

type Loc = "en" | "ru";

/** Дата: EN «Wednesday, 11/18/2026», RU «Среда, 18 ноября 2026» — в поясе сайта (вкладка «Общее», date.format). */
export function formatDate(iso: string, lang: Loc): string {
  // дата без времени — календарный день как есть (полдень UTC, без пересчёта в пояс: иначе «2019-08-09» стала бы 8 августа)
  const dateOnly = isDateOnly(iso);
  const d = dateOnly ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  const timeZone = dateOnly ? "UTC" : SITE_TZ;
  if (lang === "en") {
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(d);
    const rest = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone }).format(d);
    return `${wd}, ${rest}`;
  }
  const wd = new Intl.DateTimeFormat("ru-RU", { weekday: "long", timeZone }).format(d);
  const rest = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone }).format(d);
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)}, ${rest.replace(/\s*г\.$/, "")}`;
}

/**
 * Время: EN «6:30 PM - 8:30 PM PT», RU «18:30–20:30 PT» (24 часа, короткое тире без пробелов) — вкладка «Event page», eventPage.time.
 * Начало без времени — null (строку времени не показываем); окончание без времени или в другой день — показываем только начало.
 */
export function formatTime(startIso: string, endIso: string | null, lang: Loc): string | null {
  if (isDateOnly(startIso)) return null;
  if (endIso && (isDateOnly(endIso) || siteDay(endIso) !== siteDay(startIso))) endIso = null;
  const f = (iso: string) =>
    new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ru-RU", {
      hour: lang === "en" ? "numeric" : "2-digit",
      minute: "2-digit",
      hour12: lang === "en",
      timeZone: SITE_TZ,
    }).format(new Date(iso));
  const range = endIso ? (lang === "en" ? `${f(startIso)} - ${f(endIso)}` : `${f(startIso)}–${f(endIso)}`) : f(startIso);
  return `${range} PT`;
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
