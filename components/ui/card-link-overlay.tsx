import { SmartLink } from "./smart-link";

/**
 * Невидимая ссылка на всю карточку (карточки card-square / card-rectangle). Настоящая ссылка с подписью остаётся внутри карточки
 * (фокус, скринридер); эта — только для мыши и касания: `aria-hidden`, вне порядка табуляции.
 * Нельзя растягивать саму ссылку через `::after`: на hover её содержимое масштабируется (`transform`), и растянутая область
 * сужалась до размера ссылки — клик работал только по тексту (баг 13.11).
 * Карточка должна быть `relative`.
 */
export function CardLinkOverlay({ href }: { href: string }) {
  return <SmartLink href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10" />;
}
