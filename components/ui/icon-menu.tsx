import type { ButtonHTMLAttributes, Ref } from "react";

/**
 * Кнопка-бургер (Figma: icon/menu `1291:5`, 44×44 — область нажатия).
 * state=closed — две линии 38×2 через 10; open — крестик из двух линий 34×2.
 * `controls` — id мобильного меню; `label` — a11y.openMenu / a11y.closeMenu.
 */
export function IconMenu({
  expanded,
  controls,
  label,
  className,
  type = "button",
  ...rest
}: {
  expanded: boolean;
  controls: string;
  label: string;
  ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded" | "aria-controls" | "aria-label">) {
  return (
    <button
      type={type}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={label}
      className={["relative size-11 shrink-0", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {expanded ? (
        <>
          <span className="absolute top-1/2 left-1/2 h-0.5 w-8.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-icon-bg" />
          <span className="absolute top-1/2 left-1/2 h-0.5 w-8.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-icon-bg" />
        </>
      ) : (
        <span className="flex flex-col items-center justify-center gap-2.5">
          <span className="block h-0.5 w-9.5 bg-icon-bg" />
          <span className="block h-0.5 w-9.5 bg-icon-bg" />
        </span>
      )}
    </button>
  );
}
