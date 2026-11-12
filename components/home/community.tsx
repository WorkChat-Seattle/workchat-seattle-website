import Image, { type StaticImageData } from "next/image";
import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { FACEBOOK_URL } from "@/lib/constants";
import d01 from "@/public/images/home/community-d01.jpg";
import d02 from "@/public/images/home/community-d02.jpg";
import d03 from "@/public/images/home/community-d03.jpg";
import d04 from "@/public/images/home/community-d04.jpg";
import d05 from "@/public/images/home/community-d05.jpg";
import d06 from "@/public/images/home/community-d06.jpg";
import d07 from "@/public/images/home/community-d07.jpg";
import d08 from "@/public/images/home/community-d08.jpg";
import d09 from "@/public/images/home/community-d09.jpg";
import d10 from "@/public/images/home/community-d10.jpg";
import m01 from "@/public/images/home/community-m01.jpg";
import m02 from "@/public/images/home/community-m02.jpg";
import m03 from "@/public/images/home/community-m03.jpg";
import m04 from "@/public/images/home/community-m04.jpg";
import m05 from "@/public/images/home/community-m05.jpg";
import m06 from "@/public/images/home/community-m06.jpg";
import t01 from "@/public/images/home/community-t01.jpg";
import t02 from "@/public/images/home/community-t02.jpg";
import t03 from "@/public/images/home/community-t03.jpg";
import t04 from "@/public/images/home/community-t04.jpg";
import t05 from "@/public/images/home/community-t05.jpg";
import t06 from "@/public/images/home/community-t06.jpg";
import s from "./community.module.css";

const desktop: [string, StaticImageData, string][] = [
  ["d10", d10, "300px"],
  ["d09", d09, "375px"],
  ["d08", d08, "300px"],
  ["d07", d07, "270px"],
  ["d06", d06, "270px"],
  ["d05", d05, "150px"],
  ["d04", d04, "150px"],
  ["d03", d03, "270px"],
  ["d02", d02, "150px"],
  ["d01", d01, "150px"],
];
const tablet = [t01, t02, t03, t04, t05, t06];
const mobileTop = [
  [m01, s.mTop1],
  [m02, s.mTop2],
  [m03, s.mTop3],
] as const;
const mobileBottom = [
  [m04, s.mBottom1],
  [m05, s.mBottom2],
  [m06, s.mBottom3],
] as const;

/**
 * Community (Figma: community `1003:3548`; tablet `1203:14384`, mobile `1110:10668`).
 * Три раскладки одних и тех же слов: desktop — коллаж из 10 фото вокруг текста на холсте 1440×1200 с
 * градиентом bg/gradient-center; tablet — заголовок со 2-й колонки и сетка 3×2 из квадратов 229;
 * mobile — 3 фото сверху, текст, 3 фото снизу, градиент. Лишние группы фото скрыты (display: none,
 * lazy-картинки не скачиваются). Фото декоративные (alt="").
 */
export function Community({ t }: { t: Dictionary }) {
  return (
    <section
      aria-labelledby="community-title"
      className="relative mt-5 overflow-x-clip md:mt-30 xl:mt-20 xl:flex xl:justify-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-170 bg-gradient-center md:max-xl:hidden xl:h-300"
      />

      <div className="relative xl:h-300 xl:w-360 xl:shrink-0">
        {/* mobile: фото сверху */}
        <div className="relative h-64.75 md:hidden">
          {mobileTop.map(([img, cls], i) => (
            <div key={i} className={`${s.photo} ${s.m} ${cls}`}>
              <Image src={img} alt="" fill sizes="150px" className="object-cover" />
            </div>
          ))}
        </div>

        <div className={`${s.copy} flex flex-col px-5 md:px-10 md:pl-53 xl:p-0`}>
          <h2 id="community-title" className="text-h2 text-text-heading">
            {t["home.community.title"]}
          </h2>
          <p className="text-body mt-5 max-w-114.75 text-text-body">{t["home.community.text"]}</p>
          <ButtonLink
            option="dark"
            href={FACEBOOK_URL}
            newTabLabel={t["a11y.newTab"]}
            className="mt-10 w-full md:w-fit"
          >
            {t["home.community.button"]}
          </ButtonLink>
        </div>

        {/* mobile: фото снизу */}
        <div className="relative mt-15 h-45 md:hidden">
          {mobileBottom.map(([img, cls], i) => (
            <div key={i} className={`${s.photo} ${s.m} ${cls}`}>
              <Image src={img} alt="" fill sizes="150px" className="object-cover" />
            </div>
          ))}
        </div>

        {/* tablet: сетка 3×2 */}
        <div className="mx-10 mt-10 hidden grid-cols-3 md:grid xl:hidden">
          {tablet.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image src={img} alt="" fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>

        {/* desktop: коллаж */}
        <div className="hidden xl:contents">
          {desktop.map(([name, img, size]) => (
            <div key={name} className={`${s.photo} ${s[name]}`}>
              <Image src={img} alt="" fill sizes={size} className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
