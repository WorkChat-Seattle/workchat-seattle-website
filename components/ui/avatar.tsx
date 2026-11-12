import Image from "next/image";

/**
 * Круглое фото с белой обводкой (Figma: avatar `1009:1302`, 86×86; размер любой —
 * через className). Обводка 4px decor/card-outline. Фото декоративное, если
 * рядом есть имя: `alt=""`.
 */
export function Avatar({
  src,
  alt = "",
  sizes = "86px",
  className = "size-21.5",
}: {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <span
      className={[
        "relative block aspect-square shrink-0 overflow-hidden rounded-full border-4 border-decor-card-outline",
        className,
      ].join(" ")}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </span>
  );
}
