import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";

// Словари собирает `npm run texts:build` из content/texts/*.csv. Руками не править.
export type TextKey = keyof typeof en;
export type Dictionary = Record<TextKey, string>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
