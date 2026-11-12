import type { ButtonHTMLAttributes } from "react";

/**
 * Тег-фильтр на Events (Figma: tag `1353:12193`, status=default | selected).
 * Капсула с рамкой 1px, текст caption (UPPERCASE). Выбранный — залит button/dark.
 */
export function Tag({
  selected = false,
  className,
  type = "button",
  ...rest
}: { selected?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={[
        "inline-flex items-center justify-center rounded-full border border-button-outline px-5 py-2 text-caption whitespace-nowrap",
        selected
          ? "bg-button-dark text-button-text-light"
          : "text-button-text-dark hover:bg-button-dark hover:text-button-text-light",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

/** Метка на карточке события (Figma: tag status=card-tag): просто текст, не кнопка. */
export function CardTag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={["text-caption text-button-text-dark", className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
