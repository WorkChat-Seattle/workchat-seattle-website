import type { StaticImageData } from "next/image";
import inkspire from "@/public/images/events/map-inkspire-print-studio.png";
import creekPkwy from "@/public/images/events/map-19015-n-creek-pkwy.png";

/**
 * Статичные карты для состояния consent (docs/cookie-consent.md, map-embed): 704×704, стиль OpenFreeMap с подписью об источнике.
 * Ключ — Place name из Notion. Для нового места добавить кадр `map / …` в Figma (scripts/figma-assets.ts) и строку сюда;
 * без картинки заглушка рисуется на нейтральном фоне.
 */
const MAPS: Record<string, StaticImageData> = {
  "Inkspire Print Studio": inkspire,
  "Plaza at North Creek": creekPkwy,
};

export const eventMapImage = (placeName: string | null): StaticImageData | null =>
  (placeName && MAPS[placeName]) || null;
