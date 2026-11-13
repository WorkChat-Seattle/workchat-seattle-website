/**
 * Данные форм (docs/forms-to-notion.md): списки вариантов, соответствие «ключ формы → значение Notion» и проверка полей.
 * Файл общий для клиента и сервера: форма отправляет ключи, сервер проверяет их тем же кодом и пишет в Notion короткие значения.
 * Значения select / multi-select в Notion должны совпадать с этими строками (иначе API создаст новый вариант).
 */

export type FormKind = "mentor" | "volunteer" | "suggest-event";
export const FORM_KINDS: readonly FormKind[] = ["mentor", "volunteer", "suggest-event"];

/** Темы ментора (Mentor cards → Mentoring topics). Ключ = название в Notion = ключ словаря `topic.<ключ>`. 1–5, «Other» тоже считается. */
export const MENTOR_TOPICS = [
  "Understanding the U.S. job market and workplace culture",
  "Translating international experience into a U.S. career",
  "Choosing a career direction",
  "Changing careers or industries",
  "Returning to work after a career break",
  "Job-search strategy",
  "Resume / LinkedIn / Portfolio feedback",
  "Networking and professional relationships",
  "Interview preparation",
  "Communication and self-advocacy at work",
  "Career advancement and promotion",
  "Leadership and people management",
  "Developing skills in my professional field",
  "Starting or growing a business",
  "Other",
] as const;
export const MAX_TOPICS = 5;
export const OTHER_TOPIC = "Other";

/** Время в месяц (Mentor cards и Volunteers → Time per month). Ключ словаря `time.<ключ>`. */
export const TIME_OPTIONS = [
  "Up to 1 hour",
  "About 2 hours",
  "About 3–4 hours",
  "More than 4 hours",
  "I’d like to discuss this first",
] as const;

/** Формат встреч (Mentor cards → Meeting format). Ключ словаря `meet.<ключ>`. */
export const MEET_OPTIONS = ["Online", "In person in the Seattle area"] as const;

/**
 * Чем помочь (Volunteers → Skills). Ключ = короткое значение в Notion = ключ словаря `help.<ключ>`.
 * Finance / Marketing / Technology форма не ставит — их отмечает команда вручную.
 */
export const HELP_OPTIONS = ["Speaker", "Mentor", "Events", "Photography", "Digital communications", "Partnerships", "Operations"] as const;

/** Слова внутри текста варианта «Mentor», которые становятся ссылкой на форму ментора (открывается в новой вкладке). */
export const MENTOR_LINK_PHRASE = { en: "please also fill out the mentor form", ru: "пожалуйста, заполните также форму ментора" } as const;

/** Ограничения длины: Notion принимает до 2000 знаков в одном фрагменте текста, остальное режем здесь. */
export const LIMITS = { short: 200, url: 500, long: 2000 } as const;

export type FieldErrors = Record<string, "required" | "email" | "url" | "max">;

export type MentorInput = {
  name: string;
  email: string;
  linkedin: string;
  topics: string[];
  otherTopic: string;
  time: string;
  meet: string[];
};
export type VolunteerInput = {
  name: string;
  email: string;
  linkedin: string;
  help: string[];
  time: string;
  notes: string;
};
export type SuggestEventInput = {
  link: string;
  about: string;
  name: string;
  email: string;
};
export type FormInput = { mentor: MentorInput; volunteer: VolunteerInput; "suggest-event": SuggestEventInput };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const only = <T extends string>(values: string[], allowed: readonly T[]): T[] => allowed.filter((a) => values.includes(a));

/** Адрес без схемы («linkedin.com/in/…») дополняем https://; возвращает пустую строку, если это не ссылка. */
export function normalizeUrl(raw: string): string {
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".") || /\s/.test(raw)) return "";
    return u.toString();
  } catch {
    return "";
  }
}

type Result<K extends FormKind> = { ok: true; value: FormInput[K] } | { ok: false; errors: FieldErrors };

/**
 * Проверка и нормализация данных формы. Клиент вызывает её перед отправкой (подсветка полей),
 * сервер — ещё раз (допустимые значения списков, лимит тем, длина).
 */
export function parseForm<K extends FormKind>(kind: K, raw: unknown): Result<K> {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};
  const need = (key: string, v: string, max: number) => {
    if (!v) errors[key] = "required";
    else if (v.length > max) errors[key] = "max";
  };
  const email = (key: string, v: string) => {
    if (!v) errors[key] = "required";
    else if (!EMAIL.test(v) || v.length > LIMITS.short) errors[key] = "email";
  };
  const link = (key: string, v: string, required: boolean): string => {
    if (!v) {
      if (required) errors[key] = "required";
      return "";
    }
    const n = normalizeUrl(v);
    if (!n || n.length > LIMITS.url) errors[key] = "url";
    return n;
  };

  if (kind === "mentor") {
    const topics = only(list(o.topics), MENTOR_TOPICS);
    const meet = only(list(o.meet), MEET_OPTIONS);
    const v: MentorInput = {
      name: str(o.name),
      email: str(o.email).toLowerCase(),
      linkedin: str(o.linkedin),
      topics,
      otherTopic: topics.includes(OTHER_TOPIC) ? str(o.otherTopic) : "",
      time: str(o.time),
      meet,
    };
    need("name", v.name, LIMITS.short);
    email("email", v.email);
    v.linkedin = link("linkedin", v.linkedin, false);
    if (topics.length < 1) errors.topics = "required";
    else if (topics.length > MAX_TOPICS) errors.topics = "max";
    if (topics.includes(OTHER_TOPIC)) need("otherTopic", v.otherTopic, LIMITS.short);
    if (!(TIME_OPTIONS as readonly string[]).includes(v.time)) errors.time = "required";
    if (meet.length < 1) errors.meet = "required";
    return Object.keys(errors).length ? { ok: false, errors } : ({ ok: true, value: v } as Result<K>);
  }

  if (kind === "volunteer") {
    const v: VolunteerInput = {
      name: str(o.name),
      email: str(o.email).toLowerCase(),
      linkedin: str(o.linkedin),
      help: only(list(o.help), HELP_OPTIONS),
      time: str(o.time),
      notes: str(o.notes),
    };
    need("name", v.name, LIMITS.short);
    email("email", v.email);
    v.linkedin = link("linkedin", v.linkedin, false);
    if (v.help.length < 1) errors.help = "required";
    if (!(TIME_OPTIONS as readonly string[]).includes(v.time)) errors.time = "required";
    if (v.notes.length > LIMITS.long) errors.notes = "max";
    return Object.keys(errors).length ? { ok: false, errors } : ({ ok: true, value: v } as Result<K>);
  }

  const v: SuggestEventInput = { link: str(o.link), about: str(o.about), name: str(o.name), email: str(o.email).toLowerCase() };
  v.link = link("link", v.link, false);
  need("about", v.about, LIMITS.long);
  need("name", v.name, LIMITS.short);
  email("email", v.email);
  return Object.keys(errors).length ? { ok: false, errors } : ({ ok: true, value: v } as Result<K>);
}
