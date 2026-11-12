import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

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
 */
export function MenuButton({
  href,
  current = false,
  variant = "nav",
  className,
  children,
  ...rest
}: {
  href: string;
  current?: boolean;
  /** nav — пункты шапки (aria-current="page"); language — EN / RU (aria-current="true", жирный на всех размерах). */
  variant?: "nav" | "language";
  children: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">) {
  const ariaCurrent = current ? (variant === "language" ? "true" : "page") : undefined;
  const line =
    variant === "nav"
      ? "scale-x-0 group-aria-[current=page]:scale-x-100 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100";
  const bold =
    variant === "language"
      ? "aria-[current=true]:text-button-selected"
      : "xl:aria-[current=page]:text-button-selected";
  return (
    <Link
      href={href}
      aria-current={ariaCurrent}
      className={[
        "group inline-flex flex-col gap-1 py-2.75 text-text-body text-button xl:py-0",
        bold,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span
        aria-hidden="true"
        className={`block h-px w-full origin-left bg-current ${line}`}
      />
    </Link>
  );
}
