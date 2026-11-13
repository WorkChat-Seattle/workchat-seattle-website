import { CardLinkOverlay } from "./card-link-overlay";
import { MenuButton } from "./menu-button";

export type CardSquareOption = "neutral" | "dark-neutral";

// фон → hover-цвет 300 ms, содержимое scale(1.02) 350 ms, подчёркивание — на всю карточку (animations.md, п. 4)
const bg = "transition-colors duration-(--duration-card-bg) ease-card motion-reduce:transition-none";
const option: Record<CardSquareOption, string> = {
  neutral: "bg-bg-card-neutral hover:bg-bg-card-light",
  "dark-neutral": "bg-bg-card-dark hover:bg-bg-card-dark-hover",
};

/**
 * Карточка-ссылка (Figma: card-square `1003:8038`, button=true).
 * desktop 300×300, padding 36; tablet 344×344, padding 40 / снизу 29 + кнопка 49; mobile 350×288.
 * Высоты — минимальные (русский текст длиннее). Вся карточка кликабельна (CardLinkOverlay),
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
        "group/card relative flex min-h-72 flex-col justify-between px-5 pt-10 pb-7.25 has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-decor-accent md:min-h-86 md:px-10 xl:min-h-75 xl:p-9",
        bg,
        option[opt],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-4 transition-transform duration-(--duration-card-scale) ease-card motion-safe:group-hover/card:scale-(--card-scale) motion-reduce:transition-none">
        <h3 className="text-h3 text-text-heading">{title}</h3>
        <p className="text-body text-text-body">{text}</p>
      </div>
      <MenuButton
        href={href}
        className="self-start transition-transform duration-(--duration-card-scale) ease-card motion-safe:group-hover/card:scale-(--card-scale) motion-reduce:transition-none focus-visible:outline-none"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {linkLabel}
        {external && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </MenuButton>
      <CardLinkOverlay href={href} />
    </div>
  );
}
