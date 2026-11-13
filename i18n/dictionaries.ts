import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import { type PendingKey, pendingTexts } from "./pending-texts";

// Словари собирает `npm run texts:build` из content/texts/*.csv. Руками не править.
export type TextKey = keyof typeof en | PendingKey;
export type Dictionary = Record<TextKey, string>;

// Тексты из pending-texts.ts подмешиваются под строки таблицы: когда ключ появится в таблице, победит таблица.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => ({ ...pendingTexts.en, ...m.default }) as Dictionary),
  ru: () => import("./dictionaries/ru.json").then((m) => ({ ...pendingTexts.ru, ...m.default }) as Dictionary),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
