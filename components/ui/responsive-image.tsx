import { getImageProps, type StaticImageData } from "next/image";

/**
 * Картинка с разной обрезкой по размерам (`<picture>`): в Figma у фото на mobile / tablet / desktop
 * свой кадр. Браузер скачивает только подходящий файл; без `tablet` / `desktop` ниже подставляется
 * ближайший меньший. Родитель — `relative` с размерами, картинка заполняет его (`fill`).
 * `priority` — только для картинки первого экрана (hero): предзагружается файл для mobile.
 */
export function ResponsiveImage({
  mobile,
  tablet,
  desktop,
  sizes = "100vw",
  priority = false,
  alt = "",
  className = "object-cover",
}: {
  mobile: StaticImageData;
  tablet?: StaticImageData;
  desktop?: StaticImageData;
  sizes?: string;
  priority?: boolean;
  alt?: string;
  className?: string;
}) {
  const common = { alt, sizes, fill: true, priority } as const;
  const base = getImageProps({ ...common, src: mobile }).props;
  const t = tablet ? getImageProps({ ...common, src: tablet }).props.srcSet : undefined;
  const d = desktop ? getImageProps({ ...common, src: desktop }).props.srcSet : undefined;
  return (
    <picture>
      {d ? <source media="(min-width: 1280px)" srcSet={d} sizes={sizes} /> : null}
      {t ? <source media="(min-width: 768px)" srcSet={t} sizes={sizes} /> : null}
      <img {...base} alt={alt} className={className} />
    </picture>
  );
}
