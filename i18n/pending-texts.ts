/**
 * Тексты, которых ещё нет в Google-таблице (12.11, страницы событий). Временный мост: когда Юлия добавит строки в таблицу
 * и запустит `npm run texts`, значения из словарей имеют приоритет, а этот файл можно удалить вместе с подключением
 * в `dictionaries.ts`. RU — черновик, нужна вычитка. Список ключей — в CLAUDE.md, «Статус».
 */
export const pendingTexts = {
  en: {
    "eventPage.location": "Location",
    "eventPage.openMap": "Open in Google Maps",
    "eventPage.shareCopied": "Link copied",
    "a11y.speakerLinkedin": "{name} on LinkedIn",
  },
  ru: {
    "eventPage.location": "Место проведения",
    "eventPage.openMap": "Открыть в Google Maps",
    "eventPage.shareCopied": "Ссылка скопирована",
    "a11y.speakerLinkedin": "{name} в LinkedIn",
  },
} as const;
