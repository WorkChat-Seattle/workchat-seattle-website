import { logoBubblePath, logoDots, logoWordmarkPath } from "./glyphs";

/**
 * Логотип WorkChat Seattle (Figma: logo `1048:1421`, 137×45). Цвет — currentColor.
 * Слои как в Figma: wordmark, bubble, dot-1…dot-3. У точек классы для анимации
 * «печатает…» (animations.md, п. 5; сама анимация — на проходе анимаций):
 * `logo-dot` у каждой и `logo-dot-1…3` для задержек 0 / 0.15 / 0.3 s.
 */
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
      className={`logo ${className}`}
      viewBox="0 0 137 45"
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <path className="logo-wordmark" d={logoWordmarkPath} />
      <path className="logo-bubble" d={logoBubblePath} />
      {logoDots.map(({ id, cx, cy, r }) => (
        <circle key={id} className={`logo-dot logo-${id}`} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  );
}
