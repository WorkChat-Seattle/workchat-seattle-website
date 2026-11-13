import { getImageProps, type StaticImageData } from "next/image";

/**
 * Круглое фото с полупрозрачным кольцом (Figma: stroke inside, decor/card-outline = белый 90%).
 * Фото — собственный фон элемента (`background-origin/clip: border-box`): оно идёт под кольцом на весь круг, край один.
 * Так, как в v2 (.testimonial__photo), и как в Figma: сквозь кольцо слегка видно фото. Прежняя схема (рамка вокруг фото внутри
 * `overflow-hidden`) давала сплошное белое кольцо на фоне страницы и тонкую полоску по краю.
 * `ring` — класс ширины кольца (`border-4`, `md:border-8`…); `width` — максимальный размер на экране в px (файл берётся в 2×).
 * Без `alt` фото декоративное (имя рядом).
 */
export function RingPhoto({
  src,
  alt = "",
  width,
  ring,
  className = "",
  priority,
}: {
  src: string | StaticImageData;
  alt?: string;
  width: number;
  ring: string;
  className?: string;
  priority?: boolean;
}) {
  const { props } = getImageProps({ src, alt, width: width * 2, height: width * 2, priority });
  return (
    <span
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      className={["block aspect-square shrink-0 rounded-full border-decor-card-outline", ring, className].join(" ")}
      style={{
        backgroundImage: `url("${props.src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "border-box",
        backgroundClip: "border-box",
      }}
    />
  );
}
