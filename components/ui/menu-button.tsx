import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Пункт меню (Figma: menu-button `1003:7999`).
 * Default — Medium; hover — подчёркивание 1px; selected (`current`) — на desktop
 * Bold −2% (text-button-selected), на mobile/tablet по макету остаётся Medium 18.
 * У пункта nav с aria-current="page" подчёркивание видно всегда, на всех размерах
 * (animations.md, п. 3; решение Юлии 12.11, в Figma линии нет). У выбранного
 * языка EN / RU (variant="language") линии нет.
 * Подчёркивание рисуется отдельной линией (scaleX), чтобы анимацию из
 * animations.md (п. 3) можно было добавить одним transition.
 * Область нажатия на mobile ≥ 44: вертикальные отступы 11.
 * `size="large"` — ссылки открытого мобильного меню (Figma: mobile/menu-link, Regular 28).
 */
type Common = {
  /** nav — пункты шапки (aria-current="page"); language — EN / RU (aria-current="true", жирный на всех размерах). */
  variant?: "nav" | "language";
  size?: "default" | "large";
  /** white — на тёмной фото-карточке (text/white). */
  tone?: "default" | "white";
  current?: boolean;
  className?: string;
  children: ReactNode;
};

function styles({ variant = "nav", size = "default", tone = "default", className }: Pick<Common, "variant" | "size" | "tone" | "className">) {
  const line =
    variant === "nav"
      ? "scale-x-0 group-aria-[current=page]:scale-x-100 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100";
  const bold =
    variant === "language"
      ? "aria-[current=true]:text-button-selected"
      : size === "large"
        ? ""
        : "xl:aria-[current=page]:text-button-selected";
  const type = size === "large" ? "text-menu-link" : "text-button";
  // Высота пункта в Figma — по «обрезанному» тексту (text-box-trim): у 28px — 20, у 16–18px — 11.
  // Линия не входит в высоту (-mb-px). Обычный пункт на mobile / tablet — с полной строкой.
  const trimmed = size === "large" ? "h-5 leading-5" : "h-2.75 leading-2.75";
  const trimAlways = size === "large" || variant === "language";
  // У EN / RU область нажатия ≥ 44 за счёт отрицательных полей: раскладка остаётся как в макете.
  const pad =
    variant === "language" ? "py-2.75 -my-2.75 xl:my-0 xl:py-0" : "py-2.75 xl:py-0";
  return {
    root: [`group inline-flex flex-col gap-1`, tone === "white" ? "text-text-white" : "text-text-body", pad, type, bold, className]
      .filter(Boolean)
      .join(" "),
    label: `whitespace-nowrap ${trimAlways ? trimmed : `xl:h-2.75 xl:leading-2.75`}`,
    line: `block h-px w-full origin-left bg-current -mb-px ${line}`,
  };
}

function Inner({ label, line, children }: { label: string; line: string; children: ReactNode }) {
  return (
    <>
      <span className={label}>{children}</span>
      <span aria-hidden="true" className={line} />
    </>
  );
}

const ariaCurrent = (current: boolean, variant: "nav" | "language") =>
  current ? (variant === "language" ? "true" : "page") : undefined;

export function MenuButton({
  href,
  current = false,
  variant = "nav",
  size = "default",
  tone = "default",
  className,
  children,
  ...rest
}: { href: string } & Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const s = styles({ variant, size, tone, className });
  return (
    <Link href={href} aria-current={ariaCurrent(current, variant)} className={s.root} {...rest}>
      <Inner label={s.label} line={s.line}>{children}</Inner>
    </Link>
  );
}

/** Тот же пункт, но действие, а не переход (например, «Cookie Settings» в футере). */
export function MenuAction({
  size = "default",
  className,
  children,
  type = "button",
  ...rest
}: Pick<Common, "size" | "className" | "children"> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">) {
  const s = styles({ size, className });
  return (
    <button type={type} className={s.root} {...rest}>
      <Inner label={s.label} line={s.line}>{children}</Inner>
    </button>
  );
}
