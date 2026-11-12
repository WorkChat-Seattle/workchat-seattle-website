import { logoPath } from "./glyphs";

/** Логотип WorkChat Seattle (Figma: logo `1048:1421`, 137×45). Цвет — currentColor. */
export function Logo({
  className = "h-11.25 w-34.25 text-text-body",
  title = "WorkChat Seattle",
}: {
  className?: string;
  /** Подпись для скринридера (текст логотипа нарисован контурами). */
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 137 45"
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <path d={logoPath} />
    </svg>
  );
}
