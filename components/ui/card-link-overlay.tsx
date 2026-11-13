import Link from "next/link";

/**
 * Невидимая ссылка на всю карточку (карточки card-square / card-rectangle). Настоящая ссылка с подписью остаётся внутри карточки
 * (фокус, скринридер); эта — только для мыши и касания: `aria-hidden`, вне порядка табуляции.
 * Нельзя растягивать саму ссылку через `::after`: на hover её содержимое масштабируется (`transform`), и растянутая область
 * сужалась до размера ссылки — клик работал только по тексту (баг 13.11).
 * Карточка должна быть `relative`.
 */
export function CardLinkOverlay({ href }: { href: string }) {
  const external = /^https?:/.test(href);
  const common = { "aria-hidden": true as const, tabIndex: -1, className: "absolute inset-0 z-10" };
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...common} />
  ) : (
    <Link href={href} {...common} />
  );
}
