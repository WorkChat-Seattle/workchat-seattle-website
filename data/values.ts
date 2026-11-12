import type { StaticImageData } from "next/image";
import communityDesktop from "@/public/images/about/values-community-desktop.jpg";
import communityMobile from "@/public/images/about/values-community-mobile.jpg";
import communityTablet from "@/public/images/about/values-community-tablet.jpg";
import empowermentDesktop from "@/public/images/about/values-empowerment-desktop.jpg";
import empowermentMobile from "@/public/images/about/values-empowerment-mobile.jpg";
import empowermentTablet from "@/public/images/about/values-empowerment-tablet.jpg";
import growthDesktop from "@/public/images/about/values-growth-desktop.jpg";
import growthMobile from "@/public/images/about/values-growth-mobile.jpg";
import growthTablet from "@/public/images/about/values-growth-tablet.jpg";
import learningDesktop from "@/public/images/about/values-learning-desktop.jpg";
import learningMobile from "@/public/images/about/values-learning-mobile.jpg";
import learningTablet from "@/public/images/about/values-learning-tablet.jpg";
import supportDesktop from "@/public/images/about/values-support-desktop.jpg";
import supportMobile from "@/public/images/about/values-support-mobile.jpg";
import supportTablet from "@/public/images/about/values-support-tablet.jpg";

/**
 * Our Values (About, values `1113:10994`): пять ценностей и фон каждой (в трёх обрезках по размерам).
 * Тексты — словарь: about.values.<id>.title | text. Порядок — как вкладки.
 */
export type ValueItem = {
  id: "community" | "support" | "growth" | "empowerment" | "learning";
  images: { mobile: StaticImageData; tablet: StaticImageData; desktop: StaticImageData };
};

export const values: ValueItem[] = [
  { id: "community", images: { mobile: communityMobile, tablet: communityTablet, desktop: communityDesktop } },
  { id: "support", images: { mobile: supportMobile, tablet: supportTablet, desktop: supportDesktop } },
  { id: "growth", images: { mobile: growthMobile, tablet: growthTablet, desktop: growthDesktop } },
  { id: "empowerment", images: { mobile: empowermentMobile, tablet: empowermentTablet, desktop: empowermentDesktop } },
  { id: "learning", images: { mobile: learningMobile, tablet: learningTablet, desktop: learningDesktop } },
];
