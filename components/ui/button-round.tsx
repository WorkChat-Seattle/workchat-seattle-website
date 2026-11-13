import type { ButtonHTMLAttributes } from "react";
import { arrowRightPath } from "./glyphs";

export type Direction = "left" | "right";

/**
 * Рисунок круглой кнопки со стрелкой (Figma: button-round `1003:8025`, 60×60).
 * Default: белый круг, стрелка decor/icon. Hover — родитель с классом `group`:
 * тёмный круг, белая стрелка 90%. Левая — зеркальное отражение правой.
 */
export function RoundArrow({
  direction = "right",
  className = "size-15",
  zoom = false,
}: {
  direction?: Direction;
  className?: string;
  /** Как стрелки слайдера в v2: на hover круг увеличивается (scale 1.2, 350 ms), цвет не меняется. Увеличение делает родитель (ButtonVertical); здесь — только цвет. Родитель — с классом `group`. */
  zoom?: boolean;
}) {
  return (
    <svg
      className={[
        className,
        direction === "left" ? "-scale-x-100" : "",
      ].join(" ")}
      viewBox="0 0 60 60"
      aria-hidden="true"
    >
      <circle
        cx="30"
        cy="30"
        r="30"
        className={zoom ? "fill-button-white" : "fill-button-white group-hover:fill-button-dark group-focus-visible:fill-button-dark"}
      />
      <path
        d={arrowRightPath}
        className={zoom ? "fill-decor-icon" : "fill-decor-icon group-hover:fill-icon-glyph group-hover:opacity-90 group-focus-visible:fill-icon-glyph"}
      />
    </svg>
  );
}

/** Круглая кнопка «назад / вперёд» (слайдер отзывов). `label` — подпись для скринридера. */
export function ButtonRound({
  direction = "right",
  label,
  className,
  type = "button",
  ...rest
}: {
  direction?: Direction;
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label={label}
      className={["group inline-flex shrink-0 rounded-full", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <RoundArrow direction={direction} />
    </button>
  );
}
