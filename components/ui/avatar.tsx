import { RingPhoto } from "./ring-photo";

/**
 * Круглое фото с кольцом 4px decor/card-outline (Figma: avatar `1009:1302`, 86×86; размер любой —
 * через className). Кольцо полупрозрачное, фото под ним (RingPhoto). Фото декоративное, если
 * рядом есть имя: `alt=""`. `size` — наибольший размер на экране в px (файл берётся в 2×).
 */
export function Avatar({
  src,
  alt = "",
  size = 97,
  className = "size-21.5",
}: {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  return <RingPhoto src={src} alt={alt} width={size} ring="border-4" className={className} />;
}
