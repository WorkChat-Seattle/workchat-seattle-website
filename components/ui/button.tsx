import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type ButtonOption = "dark" | "white" | "outlined";

const base =
  "inline-flex h-12 items-center justify-center px-6 py-3 text-center text-button whitespace-nowrap";

const options: Record<ButtonOption, string> = {
  dark: "bg-button-dark text-button-text-light hover:bg-button-hover disabled:opacity-50 disabled:hover:bg-button-dark",
  white:
    "bg-button-white text-button-text-dark hover:bg-bg-card-light hover:text-button-dark",
  // рамка 1px в цвет заливки при hover — размер кнопки не прыгает
  outlined:
    "border border-button-outline text-button-text-dark hover:border-button-hover hover:bg-button-hover hover:text-button-text-light",
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
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={classes(option, className)} {...rest} />;
}

/** Кнопка-ссылка: тот же вид, но `<a href>` (переходы — только ссылками). Внешняя — обычный `<a>`. */
export function ButtonLink({
  option = "dark",
  className,
  href,
  ...rest
}: Props & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }) {
  const cls = classes(option, className);
  const external = /^(https?:|mailto:|tel:)/.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      />
    );
  }
  return <Link href={href} className={cls} {...rest} />;
}
