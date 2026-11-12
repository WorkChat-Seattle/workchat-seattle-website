import type { ButtonHTMLAttributes } from "react";

/**
 * Точка слайдера (Figma: pagination-dot `1123:2094`): default 8×8 (decor/icon),
 * active — «таблетка» 24×8 (text/heading). В ряду — зазор 8. Область нажатия
 * расширена невидимым слоем (≈ 44 по высоте).
 */
export function PaginationDot({
  active = false,
  label,
  className,
  type = "button",
  ...rest
}: {
  active?: boolean;
  /** Подпись для скринридера, например «Slide 2». */
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className={[
        "relative block h-2 shrink-0 rounded-sm after:absolute after:-inset-x-1 after:-inset-y-4.5 after:content-['']",
        active ? "w-6 bg-text-heading" : "w-2 bg-decor-icon",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
