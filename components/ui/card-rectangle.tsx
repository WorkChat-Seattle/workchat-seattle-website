import Image, { type StaticImageData } from "next/image";
import { MenuButton } from "./menu-button";

export type CardRectangleOption = "neutral" | "dark-neutral" | "image";

// фон → hover-цвет 300 ms, содержимое scale(1.02) 350 ms, подчёркивание — на всю карточку (animations.md, п. 4)
const bg = "transition-colors duration-(--duration-card-bg) ease-card motion-reduce:transition-none";
const option: Record<CardRectangleOption, string> = {
  neutral: "bg-bg-card-neutral hover:bg-bg-card-light",
  "dark-neutral": "bg-bg-card-dark hover:bg-bg-card-dark-hover",
  image: "bg-bg-inverse",
};

/**
 * Карточка-ссылка прямоугольная (Figma: card-rectangle `1003:8059`).
 * desktop 600×400, padding 60, текст→текст 20; tablet 344×380 и mobile 350×410: padding 40 / 20 по бокам,
 * сверху 40, снизу 29 + кнопка 49. Высоты минимальные (русский текст длиннее).
 * option=image: фото-фон `image`, тёмная подложка overlay/blur-light с размытием 17, текст белый.
 * Ссылка растянута на всю карточку. Без `href` показывается только подпись (адресов пока нет).
 */
export function CardRectangle({
  option: opt = "neutral",
  title,
  text,
  href,
  linkLabel,
  newTabLabel,
  image,
  className,
}: {
  option?: CardRectangleOption;
  title: string;
  text: string;
  href?: string;
  linkLabel: string;
  newTabLabel?: string;
  image?: StaticImageData;
  className?: string;
}) {
  const isImage = opt === "image";
  const tone = isImage ? "white" : "default";
  const external = !!href && /^https?:/.test(href);
  return (
    <div
      className={[
        "group/card relative flex min-h-102.5 flex-col justify-between overflow-hidden px-5 pt-10 pb-7.25 has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-decor-accent md:min-h-95 md:px-10 xl:min-h-100 xl:p-15",
        bg,
        option[opt],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isImage && image ? (
        <>
          <Image src={image} alt="" fill sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div aria-hidden="true" className={`absolute inset-0 bg-overlay-blur-light backdrop-blur-card-photo group-hover/card:bg-overlay-hover-dark ${bg}`} />
        </>
      ) : null}
      <div className={`relative flex flex-col gap-5 transition-transform duration-(--duration-card-scale) ease-card motion-safe:group-hover/card:scale-(--card-scale) motion-reduce:transition-none ${isImage ? "text-text-white" : ""}`}>
        <h3 className={`text-h3 ${isImage ? "text-text-white" : "text-text-heading"}`}>{title}</h3>
        <p className={`text-body xl:max-w-111.75 ${isImage ? "text-text-white" : "text-text-body"}`}>{text}</p>
      </div>
      <div className="relative transition-transform duration-(--duration-card-scale) ease-card motion-safe:group-hover/card:scale-(--card-scale) motion-reduce:transition-none">
        {href ? (
          <MenuButton
            href={href}
            tone={tone}
            className="after:absolute after:inset-0 focus-visible:outline-none"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {linkLabel}
            {external && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
          </MenuButton>
        ) : (
          <span
            className={`inline-flex py-2.75 text-button xl:h-2.75 xl:py-0 xl:leading-2.75 ${isImage ? "text-text-white" : "text-text-body"}`}
          >
            {linkLabel}
          </span>
        )}
      </div>
    </div>
  );
}
