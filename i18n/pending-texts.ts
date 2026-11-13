import type { Locale } from "./config";

/**
 * Тексты, которых ещё нет в таблице «WorkChat — тексты сайта EN/RU» (CLAUDE.md, «Тексты»: ничего не придумывать без записи).
 * Временно: добавить в таблицу (вкладка «Общее»), затем `npm run texts` — строки из таблицы перекрывают эти, файл можно очистить.
 * Предложения по формам (шаг 8, 13.11): сообщения под полем и подпись текстового поля «Other».
 */
export const pendingTexts = {
  en: {
    "form.invalidEmail": "Please enter a valid email address",
    "form.invalidUrl": "Please enter a valid link",
    "form.tooLong": "This text is too long",
    "form.otherTopic": "Please tell us which topic",
  },
  ru: {
    "form.invalidEmail": "Введите корректный адрес электронной почты",
    "form.invalidUrl": "Введите корректную ссылку",
    "form.tooLong": "Слишком длинный текст",
    "form.otherTopic": "Укажите, какая это тема",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type PendingKey = keyof (typeof pendingTexts)["en"];
