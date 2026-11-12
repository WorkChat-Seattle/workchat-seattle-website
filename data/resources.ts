/**
 * Карточки Resource Hub на Home (Figma: resource-hub `1003:3521`). Тексты — словарь (home.resources.<id>.*).
 * `href` — куда ведёт карточка. Адресов в проекте пока нет (открытый вопрос в CLAUDE.md): пока
 * пусто — карточка показывает подпись без ссылки, мёртвых ссылок нет.
 */
export const resourceCards = [
  { id: "findWork", option: "neutral", href: "" },
  { id: "usCareer", option: "dark-neutral", href: "" },
  { id: "advance", option: "dark-neutral", href: "" },
  { id: "business", option: "image", href: "" },
] as const;
