import type { StaticImageData } from "next/image";
import julia from "@/public/images/about/team-julia.png";
import masha from "@/public/images/about/team-masha.png";
import tatyana from "@/public/images/about/team-tatyana.png";

/**
 * Команда (About, card-team-member `1077:3174`). Тексты — словарь: about.team.<id>.name | role | bio.
 * Фон портрета чередуется: neutral → muted → light (bg/card-neutral, card-muted, card-light).
 */
export const team: { id: "masha" | "tatyana" | "julia"; photo: StaticImageData; tone: "neutral" | "muted" | "light" }[] = [
  { id: "masha", photo: masha, tone: "neutral" },
  { id: "tatyana", photo: tatyana, tone: "muted" },
  { id: "julia", photo: julia, tone: "light" },
];
