import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import { pendingTexts } from "./pending-texts";

// Словари собирает `npm run texts:build` из content/texts/*.csv. Руками не править.
export type TextKey = keyof typeof en | keyof (typeof pendingTexts)["en"];
export type Dictionary = Record<TextKey, string>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  // значения из таблицы важнее временных (pending-texts.ts)
  en: () => import("./dictionaries/en.json").then((m) => ({ ...pendingTexts.en, ...m.default })),
  ru: () => import("./dictionaries/ru.json").then((m) => ({ ...pendingTexts.ru, ...m.default })),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
