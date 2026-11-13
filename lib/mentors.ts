import { mentors, type Mentor } from "@/data/mentors";
import type { Locale } from "@/i18n/config";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";

/** Сколько карточек менторов видно по умолчанию; «View all mentors» нужна, только если их больше (docs/decisions-2026-11-05.md, п. 1). */
export const MENTORS_VISIBLE = 2;

/** Менторы в порядке Order (публикуются только с Consent received — это уже отфильтровал sync). */
export const allMentors = (): Mentor[] => mentors;

export const getMentor = (slug: string): Mentor | undefined => mentors.find((m) => m.slug === slug);

/** Био: RU — Bio RU, если пусто — английское (docs: mentor-info.csv). */
export const mentorBio = (m: Mentor, lang: Locale): string => (lang === "ru" && m.bioRu ? m.bioRu : m.bio);

/** «Должность @ Компания» — как в макете; одно из полей может быть пустым. */
export const mentorRole = (m: Mentor): string => [m.position, m.company].filter(Boolean).join(" @ ");

/** Значения Industry / Expertise: перевод из словаря (`expertise.<значение>`, `industry.<значение>`), иначе — как в Notion. */
export const mentorTags = (t: Dictionary, kind: "expertise" | "industry", values: string[]): string =>
  values.map((v) => t[`${kind}.${v}` as TextKey] ?? v).join(", ");
