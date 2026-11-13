import type { ButtonHTMLAttributes } from "react";
import { type Direction, RoundArrow } from "./button-round";

/**
 * Вертикальная полоса со стрелкой посередине (Figma: button-vertical `1048:1439`,
 * 150 шириной, высота — по родителю; в макете 558). Вся полоса — область нажатия.
 */
export function ButtonVertical({
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
      className={[
        "group flex h-full w-37.5 shrink-0 items-center justify-center bg-bg-card-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {/* увеличение — на обёртке: у левой стрелки на самом svg уже стоит отражение (-scale-x-100) */}
      <span className="flex transition-transform duration-(--duration-card-scale) ease-card motion-reduce:transition-none motion-safe:group-hover:scale-(--round-scale) motion-safe:group-focus-visible:scale-(--round-scale)">
        <RoundArrow direction={direction} zoom />
      </span>
    </button>
  );
}
