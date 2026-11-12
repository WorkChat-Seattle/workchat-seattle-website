import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { Dictionary } from "@/i18n/dictionaries";
import desktop from "@/public/images/about/about-hero-desktop.jpg";
import mobile from "@/public/images/about/about-hero-mobile.jpg";
import tablet from "@/public/images/about/about-hero-tablet.jpg";

/**
 * Миссия (Figma: hero `1088:1725`; tablet `1240:14907`, mobile `1113:11040`).
 * desktop: фото 600×600 слева и карточка bg/card-neutral 600×600 справа, текст в ней по центру (отступ 37,
 * ширина 458); tablet: заголовок и текст со 2-й колонки, под ними фото 688×516; mobile: заголовок, текст, фото 350×350.
 * Сверху после шапки 60 / 60 / 40; внизу 0 / 40 / 20 (дальше сразу блок ценностей).
 */
export function AboutHero({ t }: { t: Dictionary }) {
  return (
    <section className="mx-auto mt-10 max-w-300 px-5 pb-5 md:mt-15 md:px-10 md:pb-10 xl:flex xl:px-0 xl:pb-0">
      <div className="order-1 xl:order-2 xl:flex xl:h-150 xl:w-150 xl:flex-col xl:justify-center xl:bg-bg-card-neutral xl:px-9.25">
        <div className="flex flex-col gap-5 md:pl-43 xl:max-w-114.5 xl:pl-0">
          <h1 className="text-h2 text-text-heading">{t["about.mission.title"]}</h1>
          <p className="text-body text-text-body">{t["about.mission.text"]}</p>
        </div>
      </div>
      <div className="relative order-2 mt-10 aspect-square md:aspect-auto md:h-129 xl:order-1 xl:mt-0 xl:h-150 xl:w-150 xl:shrink-0">
        <ResponsiveImage mobile={mobile} tablet={tablet} desktop={desktop} priority sizes="(min-width: 1280px) 600px, 100vw" />
      </div>
    </section>
  );
}
