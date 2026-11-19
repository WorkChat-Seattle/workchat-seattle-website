import type { Locale } from "./config";

/**
 * Тексты, которых ещё нет в таблице «WorkChat — тексты сайта EN/RU» (CLAUDE.md, «Тексты»).
 * Временно: добавить строку в таблицу (вкладка «Общее»), затем `npm run texts` — строка из таблицы сама перекрывает эту
 * (`pendingText` берёт словарь, если ключ там есть); после этого ключ отсюда убрать, пустой файл удалить.
 * 19.11: кнопка Join на странице онлайн-события с Join link (Zoom).
 */
export const pendingTexts = {
  en: { "btn.join": "Join" },
  ru: { "btn.join": "Присоединиться" },
} as const satisfies Record<Locale, Record<string, string>>;

export type PendingKey = keyof (typeof pendingTexts)["en"];

/** Текст из словаря, а если ключа в таблице ещё нет — временный из `pendingTexts`. */
export function pendingText(dict: Record<string, string>, lang: Locale, key: PendingKey): string {
  return dict[key] ?? pendingTexts[lang][key];
}
