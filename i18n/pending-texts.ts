/**
 * Тексты, которых ещё нет в Google-таблице (13.11, менторы). Временный мост: когда Юлия добавит строки в таблицу
 * и запустит `npm run texts`, значения из словарей имеют приоритет, а этот файл можно удалить вместе с подключением
 * в `dictionaries.ts`. RU — черновик, нужна вычитка. Список ключей — в CLAUDE.md, «Статус».
 */
export const pendingTexts = {
  en: {
    "a11y.personFacebook": "{name} on Facebook",
  },
  ru: {
    "a11y.personFacebook": "{name} в Facebook",
  },
} as const;
