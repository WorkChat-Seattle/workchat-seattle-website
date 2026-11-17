import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { externalProps, isPlainAnchor, needsNewTabLabel } from "@/lib/links";

/**
 * Общая ссылка сайта: сама выбирает по адресу. Внутренняя (`/…`, `#…`) — `next/link` в той же вкладке; внешний http(s) и `mailto:` —
 * `<a target="_blank" rel="noopener noreferrer">`. `newTabLabel` (a11y.newTab) добавляется скрытым текстом только у внешних http(s),
 * у mailto — нет. Атрибуты из `rest` (в том числе свой `target`) перекрывают автоматические.
 */
export function SmartLink({
  href,
  newTabLabel,
  children,
  ...rest
}: { href: string; newTabLabel?: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (!isPlainAnchor(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...externalProps(href)} {...rest}>
      {children}
      {newTabLabel && needsNewTabLabel(href) ? <span className="sr-only"> {newTabLabel}</span> : null}
    </a>
  );
}
