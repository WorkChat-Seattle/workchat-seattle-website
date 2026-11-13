import { ResponsiveImage } from "@/components/ui/responsive-image";
import { CardSquare } from "@/components/ui/card-square";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { FACEBOOK_URL } from "@/lib/constants";
import hug from "@/public/images/home/hug-illustration.svg";
import photo1Desktop from "@/public/images/home/what-we-do-1-desktop.jpg";
import photo1Mobile from "@/public/images/home/what-we-do-1-mobile.jpg";
import photo1Tablet from "@/public/images/home/what-we-do-1-tablet.jpg";
import photo2Desktop from "@/public/images/home/what-we-do-2-desktop.jpg";
import photo3Desktop from "@/public/images/home/what-we-do-3-desktop.jpg";
import photo3Tablet from "@/public/images/home/what-we-do-3-tablet.jpg";
import Image from "next/image";

/**
 * What we do (Figma: what-we-do `1003:3563`; tablet `1203:14330`, mobile `1110:10616`).
 * Заголовок и текст — desktop от x=300, tablet со 2-й колонки, mobile от края.
 * Сетка карточек:
 *  - desktop 4×2 по 300: [фото 600 | Events | фото] / [Mentorship | фото | рисунок | Community];
 *  - tablet 2×3 по 344: [фото | Events] / [Mentorship | фото] / [рисунок | Community];
 *  - mobile колонка с зазором 20: фото 180, Events, Mentorship, Community, рисунок 175 (двух других фото нет).
 * Фото декоративные (alt=""). Порядок в HTML — по смыслу: сначала три карточки-ссылки.
 */
export function WhatWeDo({ lang, t }: { lang: Locale; t: Dictionary }) {
  const cell = "relative overflow-hidden";
  return (
    <section
      aria-labelledby="what-we-do-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <div className="flex flex-col gap-5 md:pl-43 xl:gap-10 xl:pl-75">
        <h2 data-reveal id="what-we-do-title" className="text-h2 text-text-heading">
          {t["home.whatWeDo.title"]}
        </h2>
        <p data-reveal className="text-body max-w-150 text-text-body">{t["home.whatWeDo.text"]}</p>
      </div>

      <div data-reveal-grid="one-row" className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-0 xl:mt-15 xl:grid-cols-4">
        <div
          className={`${cell} h-45 md:order-1 md:h-auto md:min-h-86 xl:order-none xl:col-span-2 xl:col-start-1 xl:row-start-1 xl:min-h-75`}
        >
          <ResponsiveImage mobile={photo1Mobile} tablet={photo1Tablet} desktop={photo1Desktop} sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw" />
        </div>
        <CardSquare
          title={t["home.whatWeDo.events.title"]}
          text={t["home.whatWeDo.events.text"]}
          linkLabel={t["home.whatWeDo.events.button"]}
          href={localePath(lang, "/events")}
          className="md:order-2 xl:order-none xl:col-start-3 xl:row-start-1"
        />
        <CardSquare
          title={t["home.whatWeDo.mentorship.title"]}
          text={t["home.whatWeDo.mentorship.text"]}
          linkLabel={t["home.whatWeDo.mentorship.button"]}
          href={localePath(lang, "/mentorship")}
          className="md:order-3 xl:order-none xl:col-start-1 xl:row-start-2"
        />
        <CardSquare
          title={t["home.whatWeDo.community.title"]}
          text={t["home.whatWeDo.community.text"]}
          linkLabel={t["home.whatWeDo.community.button"]}
          href={FACEBOOK_URL}
          newTabLabel={t["a11y.newTab"]}
          className="md:order-6 xl:order-none xl:col-start-4 xl:row-start-2"
        />
        <div
          aria-hidden="true"
          className="flex h-43.75 items-center justify-center bg-bg-card-dark md:order-5 md:h-auto md:min-h-86 xl:order-none xl:col-start-3 xl:row-start-2 xl:min-h-75"
        >
          <Image src={hug} alt="" unoptimized className="h-auto w-35.25 md:w-40.5" />
        </div>
        <div
          className={`${cell} hidden md:order-4 md:block md:min-h-86 xl:order-none xl:col-start-2 xl:row-start-2 xl:min-h-75`}
        >
          <ResponsiveImage mobile={photo3Tablet} desktop={photo3Desktop} sizes="(min-width: 1280px) 300px, 50vw" />
        </div>
        <div className={`${cell} hidden xl:col-start-4 xl:row-start-1 xl:block xl:min-h-75`}>
          <ResponsiveImage mobile={photo2Desktop} sizes="300px" />
        </div>
      </div>
    </section>
  );
}
