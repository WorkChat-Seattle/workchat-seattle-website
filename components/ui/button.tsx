import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentProps } from "react";

export type ButtonOption = "dark" | "white" | "outlined";

// .btn — заливка въезжает слева и уходит вправо (animations.md, п. 2; стили в globals.css)
const base =
  "btn inline-flex h-12 items-center justify-center px-6 py-3 text-center text-button whitespace-nowrap";

const options: Record<ButtonOption, string> = {
  dark: "btn-dark bg-button-dark text-button-text-light disabled:opacity-50",
  white: "btn-white bg-button-white text-button-text-dark",
  // рамка 1px в цвет заливки при hover — размер кнопки не прыгает
  outlined:
    "btn-outlined border border-button-outline text-button-text-dark",
};

const classes = (option: ButtonOption, className?: string) =>
  [base, options[option], className].filter(Boolean).join(" ");

type Props = { option?: ButtonOption };

/** Кнопка-действие (Figma: button `1003:8012`). Disabled у dark: opacity 50% («Sending…», «Registration closed»). */
export function Button({
  option = "dark",
  className,
  type = "button",
  ...rest
}: Props & ComponentProps<"button">) {
  return <button type={type} className={classes(option, className)} {...rest} />;
}

/** Кнопка-ссылка: тот же вид, но `<a href>` (переходы — только ссылками). Внешняя — обычный `<a>`. */
export function ButtonLink({
  option = "dark",
  className,
  href,
  newTabLabel,
  children,
  ...rest
}: Props &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    /** a11y.newTab: пометка для скринридера у внешней ссылки (она открывается в новой вкладке). */
    newTabLabel?: string;
  }) {
  const cls = classes(option, className);
  const external = /^(https?:|mailto:|tel:)/.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {href.startsWith("http") && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
