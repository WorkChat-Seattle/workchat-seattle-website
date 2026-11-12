import { type Locale, localePath } from "@/i18n/config";
import { MenuButton } from "./menu-button";

/**
 * Переключатель EN | RU (Figma: Language `1003:8105`). Ведёт на ту же страницу
 * на другом языке — без автоопределения и редиректов (docs/ru-version.md).
 * `path` — адрес текущей страницы без языкового префикса («/», «/events»).
 * `label` — подпись группы для скринридера (a11y.lang).
 * Зазор в Figma 7,5px; Tailwind не принимает шаг 1.875, берём 8px (gap-2).
 * Размеры на mobile / tablet сверить при вёрстке mobile-menu (шаг 4).
 */
export function LanguageSwitch({
  current,
  path,
  label,
  className,
}: {
  current: Locale;
  path: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={["flex items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <MenuButton
        href={localePath("en", path)}
        variant="language"
        current={current === "en"}
        lang="en"
        hrefLang="en"
      >
        EN
      </MenuButton>
      <span aria-hidden="true" className="h-2.75 w-px bg-text-body" />
      <MenuButton
        href={localePath("ru", path)}
        variant="language"
        current={current === "ru"}
        lang="ru"
        hrefLang="ru"
      >
        RU
      </MenuButton>
    </div>
  );
}
