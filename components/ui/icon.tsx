import {
  chevronDownPath,
  datePath,
  languagePath,
  locationPath,
  timePath,
} from "./glyphs";

export type IconType = "date" | "location" | "time" | "language";

const glyphs: Record<IconType, string> = {
  date: datePath,
  location: locationPath,
  time: timePath,
  language: languagePath,
};

/**
 * Иконки событий 20×20 (Figma: icon `1036:1384`): круг icon/bg + глиф icon/glyph.
 * В Figma глифы time и language — заготовки, которые ещё будут перерисованы.
 */
export function Icon({
  type,
  className = "size-5 shrink-0",
}: {
  type: IconType;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" className="fill-icon-bg" />
      <path
        d={glyphs[type]}
        className="fill-icon-glyph"
        fillRule={type === "language" ? "evenodd" : undefined}
        clipRule={type === "language" ? "evenodd" : undefined}
      />
    </svg>
  );
}

/** Шеврон выпадающих списков (Figma: icon/chevron-down `1017:1347`). Цвет — currentColor. */
export function IconChevronDown({
  className = "size-5 text-decor-icon",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={chevronDownPath} />
    </svg>
  );
}
