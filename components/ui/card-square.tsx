import { MenuButton } from "./menu-button";

export type CardSquareOption = "neutral" | "dark-neutral";

const option: Record<CardSquareOption, string> = {
  neutral: "bg-bg-card-neutral hover:bg-bg-card-light",
  "dark-neutral": "bg-bg-card-dark hover:bg-bg-card-dark-hover",
};

/**
 * Карточка-ссылка (Figma: card-square `1003:8038`, button=true).
 * desktop 300×300, padding 36; tablet 344×344, padding 40 / снизу 29 + кнопка 49; mobile 350×288.
 * Высоты — минимальные (русский текст длиннее). Ссылка растянута на всю карточку (::after),
 * подпись у скринридера — только текст ссылки; hover — на всю карточку.
 * Для внешней ссылки передайте `newTabLabel` (a11y.newTab).
 */
export function CardSquare({
  option: opt = "neutral",
  title,
  text,
  href,
  linkLabel,
  newTabLabel,
  className,
}: {
  option?: CardSquareOption;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  newTabLabel?: string;
  className?: string;
}) {
  const external = /^https?:/.test(href);
  return (
    <div
      className={[
        "relative flex min-h-72 flex-col justify-between px-5 pt-10 pb-7.25 has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-decor-accent md:min-h-86 md:px-10 xl:min-h-75 xl:p-9",
        option[opt],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-h3 text-text-heading">{title}</h3>
        <p className="text-body text-text-body">{text}</p>
      </div>
      <MenuButton
        href={href}
        className="self-start after:absolute after:inset-0 focus-visible:outline-none"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {linkLabel}
        {external && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </MenuButton>
    </div>
  );
}
