import Image, { type StaticImageData } from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import bgDesktop from "@/public/images/home/find-mentor-bg-desktop.svg";
import bgTablet from "@/public/images/home/find-mentor-bg-tablet.svg";
import d02 from "@/public/images/home/avatar-d02.png";
import d03 from "@/public/images/home/avatar-d03.png";
import d04 from "@/public/images/home/avatar-d04.png";
import d05 from "@/public/images/home/avatar-d05.png";
import d07 from "@/public/images/home/avatar-d07.png";
import d08 from "@/public/images/home/avatar-d08.png";
import m1 from "@/public/images/home/avatar-m1.png";
import m2 from "@/public/images/home/avatar-m2.png";
import m3 from "@/public/images/home/avatar-m3.png";
import m4 from "@/public/images/home/avatar-m4.png";
import t02 from "@/public/images/home/avatar-t02.png";
import t03 from "@/public/images/home/avatar-t03.png";
import t04 from "@/public/images/home/avatar-t04.png";
import t05 from "@/public/images/home/avatar-t05.png";
import t07 from "@/public/images/home/avatar-t07.png";
import t08 from "@/public/images/home/avatar-t08.png";
import s from "./find-mentor.module.css";

const mobile: [string, StaticImageData][] = [
  ["m1", m1],
  ["m2", m2],
  ["m3", m3],
  ["m4", m4],
];
const tablet: [string, StaticImageData][] = [
  ["t08", t08],
  ["t07", t07],
  ["t05", t05],
  ["t04", t04],
  ["t03", t03],
  ["t02", t02],
];
const desktop: [string, StaticImageData][] = [
  ["d08", d08],
  ["d07", d07],
  ["d05", d05],
  ["d04", d04],
  ["d03", d03],
  ["d02", d02],
];

function Avatars({
  items,
  className,
}: {
  items: [string, StaticImageData][];
  className: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      {items.map(([name, img]) => (
        <div key={name} className={`${s.avatar} ${s[name]}`}>
          <Image src={img} alt="" fill sizes="210px" />
        </div>
      ))}
    </div>
  );
}

/**
 * Find your mentor (Figma: find-mentor `1003:3502`; tablet `1203:14458`, mobile `1110:10741`).
 * Фон — три кольца (bg/card-muted, neutral, light) с градиентами сверху и снизу: на desktop и tablet
 * готовый SVG из макета, на mobile — те же кольца в CSS (в Figma там отдельные слои). Холст: 1440×1200,
 * 768×688, 750 высотой. Аватары декоративные, их «плавание» — на проходе анимаций (animations.md, п. 9).
 * Текст и кнопки на холсте: desktop от (420, 496), tablet от (212, 228), mobile от (20, 245).
 * Секция идёт сразу после Resource Hub и перед Subscribe, без отступов.
 */
export function FindMentor({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section
      aria-labelledby="find-mentor-title"
      className="flex justify-center overflow-x-clip"
    >
      {/* холст фиксированной ширины по центру: на 1280–1439 лишнее по бокам обрезается поровну */}
      <div className="relative h-187.5 w-full shrink-0 md:h-172 md:w-192 xl:h-300 xl:w-360">
        {/* mobile: кольца и градиенты в CSS */}
        <div aria-hidden="true" className="absolute inset-0 md:hidden">
          <div className="absolute top-0 left-1/2 size-187.5 -translate-x-1/2 rounded-full bg-bg-card-muted" />
          <div className="absolute top-16.75 left-1/2 size-152.5 -translate-x-1/2 rounded-full bg-bg-card-neutral" />
          <div className="absolute top-34.5 left-1/2 size-117.25 -translate-x-1/2 rounded-full bg-bg-card-light" />
          <div className="absolute inset-x-0 top-10 h-10 bg-gradient-neutral-top" />
          <div className="absolute inset-x-0 top-177.5 h-10 bg-gradient-bottom-neutral" />
        </div>
        <Image
          src={bgTablet}
          alt=""
          aria-hidden="true"
          unoptimized
          fill
          className="hidden md:block xl:hidden"
        />
        <Image
          src={bgDesktop}
          alt=""
          aria-hidden="true"
          unoptimized
          fill
          className="hidden xl:block"
        />

        <Avatars items={mobile} className="md:hidden" />
        <Avatars items={tablet} className="hidden md:block xl:hidden" />
        <Avatars items={desktop} className="hidden xl:block" />

        <div className={`${s.copy} flex flex-col`}>
          <h2 id="find-mentor-title" className="text-h2 text-text-heading">
            {t["home.findMentor.title"]}
          </h2>
          <p className="text-body mt-5 text-text-body">
            {t["home.findMentor.text"]}
          </p>
          <div className="mt-10 flex flex-col gap-2.5 md:flex-row md:self-start">
            <ButtonLink option="dark" href={localePath(lang, "/mentorship")}>
              {t["home.findMentor.browse"]}
            </ButtonLink>
            <ButtonLink
              option="outlined"
              href={`${localePath(lang, "/mentorship")}#mentor-form`}
            >
              {t["home.findMentor.become"]}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
