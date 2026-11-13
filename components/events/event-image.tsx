import Image from "next/image";

/** Обложка события: заполняет родителя (`relative` с размерами), обрезка по центру; декоративная (alt=""), название рядом. */
export function EventImage({ src, sizes, priority = false }: { src: string | null; sizes: string; priority?: boolean }) {
  if (!src) return <div className="absolute inset-0 bg-bg-card-dark" aria-hidden="true" />;
  return <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />;
}
