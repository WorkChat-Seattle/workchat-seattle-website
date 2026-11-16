import Image, { type StaticImageData } from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
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
import d02Color from "@/public/images/home/avatar-d02-color.png";
import d04Color from "@/public/images/home/avatar-d04-color.png";
import d05Color from "@/public/images/home/avatar-d05-color.png";
import d07Color from "@/public/images/home/avatar-d07-color.png";
import d08Color from "@/public/images/home/avatar-d08-color.png";
import t02Color from "@/public/images/home/avatar-t02-color.png";
import t04Color from "@/public/images/home/avatar-t04-color.png";
import t05Color from "@/public/images/home/avatar-t05-color.png";
import t07Color from "@/public/images/home/avatar-t07-color.png";
import t08Color from "@/public/images/home/avatar-t08-color.png";
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

// Цветные версии для hover «ч/б → цвет» (animations.md, п. 9): у аватара, который в макете цветной (03), и у mobile их нет.
const colorOf: Record<string, StaticImageData> = {
  d02: d02Color,
  d04: d04Color,
  d05: d05Color,
  d07: d07Color,
  d08: d08Color,
  t02: t02Color,
  t04: t04Color,
  t05: t05Color,
  t07: t07Color,
  t08: t08Color,
};

// Появление и «плавание» аватаров — значения из workchat-v2 (.mentorship__avatar--NN), по порядку списка:
// задержка появления, амплитуда (px, вверх), период, сдвиг по времени. animations.md, п. 9.
const motion = [
  { delay: 400, amp: 10, dur: 8, offset: 0 },
  { delay: 460, amp: 17, dur: 6.5, offset: 1.2 },
  { delay: 520, amp: 16, dur: 7.5, offset: 2.4 },
  { delay: 580, amp: 19, dur: 6, offset: 0.6 },
  { delay: 640, amp: 10, dur: 10, offset: 3 },
  { delay: 700, amp: 13, dur: 9, offset: 1.8 },
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
      {items.map(([name, img], i) => {
        const m = motion[i % motion.length];
        return (
          <div
            key={name}
            className={`fm-avatar ${s.avatar} ${s[name]}`}
            style={
              {
                "--appear-delay": `${m.delay}ms`,
                "--float-amp": `${m.amp}px`,
                "--float-dur": `${m.dur}s`,
                "--float-offset": `${m.offset}s`,
              } as React.CSSProperties
            }
          >
            <Image src={img} alt="" fill sizes="210px" />
            {colorOf[name] ? (
              // цветная версия проявляется поверх ч/б при hover (только @media (hover: hover), стили — fm-avatar-color)
              <Image src={colorOf[name]} alt="" fill sizes="210px" className="fm-avatar-color" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Кольца и градиенты фона (содержимое SVG из макета, inline — чтобы кольца анимировались по отдельности). */
function RingsSvg({
  id,
  className,
  w,
  h,
  rings,
  gradients,
}: {
  id: string;
  className: string;
  w: number;
  h: number;
  rings: [string, number, number, number, string][];
  gradients: [number, number][];
}) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className={`absolute inset-0 size-full ${className}`}>
      {rings.map(([cls, cx, cy, r, fill]) => (
        <circle key={cls} className={`fm-ring ${cls}`} cx={cx} cy={cy} r={r} style={{ fill }} />
      ))}
      <defs>
        {gradients.map(([from, to], i) => (
          <linearGradient key={i} id={`${id}-${i}`} x1={w / 2} x2={w / 2} y1={from} y2={to} gradientUnits="userSpaceOnUse">
            <stop style={{ stopColor: "var(--neutral-600)", stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: "var(--neutral-600)" }} />
          </linearGradient>
        ))}
      </defs>
      {gradients.map(([from, to], i) => (
        <rect key={i} x="0" y={Math.min(from, to)} width={w} height={Math.abs(to - from)} fill={`url(#${id}-${i})`} />
      ))}
    </svg>
  );
}

/**
 * Find your mentor (Figma: find-mentor `1003:3502`; tablet `1203:14458`, mobile `1110:10741`).
 * Фон — три кольца (bg/card-muted, neutral, light) с градиентами сверху и снизу: на desktop и tablet
 * готовый SVG из макета, на mobile — те же кольца в CSS (в Figma там отдельные слои). Холст: 1440×1200,
 * 768×688, 750 высотой. Аватары декоративные. Анимация (animations.md, п. 9) — классы `fm-*` в globals.css; фон — inline-SVG (кольца анимируются по отдельности).
 * Текст и кнопки на холсте: desktop от (420, 496), tablet от (212, 228), mobile от (20, 245).
 * Секция идёт сразу после Resource Hub и перед Subscribe, без отступов. `spaced` — когда Resource Hub скрыт
 * (SHOW_RESOURCE_HUB): отступ сверху как у любой секции (80 / 120 / 160), иначе блок слипнется с предыдущим.
 */
export function FindMentor({ lang, t, spaced = false }: { lang: Locale; t: Dictionary; spaced?: boolean }) {
  return (
    <section
      aria-labelledby="find-mentor-title"
      data-in-view
      className={`flex justify-center overflow-x-clip ${spaced ? "mt-20 md:mt-30 xl:mt-40" : ""}`}
    >
      {/* холст фиксированной ширины по центру: на 1280–1439 лишнее по бокам обрезается поровну */}
      <div className="relative h-187.5 w-full shrink-0 md:h-172 md:w-192 xl:h-300 xl:w-360">
        {/* mobile: кольца и градиенты в CSS */}
        <div aria-hidden="true" className="absolute inset-0 md:hidden">
          <div className="fm-ring fm-ring-outer absolute top-0 left-1/2 size-187.5 -translate-x-1/2 rounded-full bg-bg-card-muted" />
          <div className="fm-ring fm-ring-middle absolute top-16.75 left-1/2 size-152.5 -translate-x-1/2 rounded-full bg-bg-card-neutral" />
          <div className="fm-ring fm-ring-inner absolute top-34.5 left-1/2 size-117.25 -translate-x-1/2 rounded-full bg-bg-card-light" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-neutral-top" />
          <div className="absolute inset-x-0 top-177.5 h-10 bg-gradient-bottom-neutral" />
        </div>
        <RingsSvg
          id="fm-t"
          className="hidden md:block xl:hidden"
          w={768}
          h={688}
          rings={[
            ["fm-ring-outer", 384, 344, 344, "var(--neutral-500)"],
            ["fm-ring-middle", 383.713, 341.42, 279.5, "var(--neutral-400)"],
            ["fm-ring-inner", 383.427, 341.133, 215, "var(--neutral-200)"],
          ]}
          gradients={[[89, 9], [605, 685]]}
        />
        <RingsSvg
          id="fm-d"
          className="hidden xl:block"
          w={1440}
          h={1200}
          rings={[
            ["fm-ring-outer", 731, 600, 600, "var(--neutral-500)"],
            ["fm-ring-middle", 730.5, 595.5, 487.5, "var(--neutral-400)"],
            ["fm-ring-inner", 730, 595, 375, "var(--neutral-200)"],
          ]}
          gradients={[[150, 0], [1050, 1200]]}
        />

        <Avatars items={mobile} className="md:hidden" />
        <Avatars items={tablet} className="hidden md:block xl:hidden" />
        <Avatars items={desktop} className="hidden xl:block" />

        <div className={`${s.copy} flex flex-col`}>
          <h2 id="find-mentor-title" className="fm-rise fm-rise-title text-h2 text-text-heading xl:whitespace-nowrap">
            {t["home.findMentor.title"]}
          </h2>
          <p className="fm-rise fm-rise-text text-body mt-5 text-text-body">
            {t["home.findMentor.text"]}
          </p>
          <div className="fm-rise fm-rise-buttons mt-10 flex flex-col gap-2.5 md:flex-row md:self-start">
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
