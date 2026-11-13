"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonVertical } from "@/components/ui/button-vertical";
import { quoteMarkPath } from "@/components/ui/glyphs";
import { PaginationDot } from "@/components/ui/pagination-dot";
import s from "./testimonials.module.css";

export type TestimonialItem = {
  id: string;
  photo: StaticImageData;
  lead: string;
  text: string;
  name: string;
};

/** Подписи из словаря; `slideN` — шаблон с {n} и {total} (a11y.slideN). */
export type SliderLabels = { prev: string; next: string; slideN: string };

/** Карточка отзыва (Figma: card-testimonial `1084:10455`, tablet 640×610, mobile 330×723, desktop 900×518). */
function Card({ item, readMore }: { item: TestimonialItem; readMore: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="relative flex h-full flex-col gap-5 bg-bg-card-neutral p-5 md:min-h-152.5 md:flex-row md:gap-16 md:p-10 xl:min-h-129.5 xl:gap-8 xl:pt-20 xl:pr-10 xl:pb-10 xl:pl-10">
      {/* фото на весь круг, кольцо 20 (decor/card-outline, 90% белого) поверх — как обводка внутри круга в Figma */}
      <div className="relative size-72.5 shrink-0 overflow-hidden rounded-full md:size-60 xl:size-93.75">
        <Image
          src={item.photo}
          alt=""
          fill
          sizes="(min-width: 1280px) 375px, (min-width: 768px) 240px, 290px"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 rounded-full border-20 border-decor-card-outline" />
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 60 40"
        className="h-10 w-15 shrink-0 fill-bg-card-dark md:absolute md:top-5 md:left-70.75 xl:top-15 xl:left-96.5"
      >
        <path d={quoteMarkPath} />
      </svg>
      <div className="flex min-w-0 flex-col gap-5 md:w-64 md:flex-none xl:w-97.5">
        <h3 className="text-h3 text-text-body">{item.lead}</h3>
        <p
          className={`text-body whitespace-pre-line text-text-body ${expanded ? "" : "max-md:line-clamp-4"}`}
          id={`testimonial-${item.id}-text`}
        >
          {item.text}
        </p>
        <p className="text-body-italic-accent text-text-body">{item.name}</p>
        {!expanded ? (
          <button
            type="button"
            aria-expanded={false}
            aria-controls={`testimonial-${item.id}-text`}
            onClick={() => setExpanded(true)}
            className="self-start py-2.75 text-button text-text-body md:hidden"
          >
            {readMore}
          </button>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Лента отзывов: на desktop — полосы со стрелками по бокам (150) и карточка 900; на tablet / mobile —
 * карточки в ленте с виднеющимся краем следующей (лента тянется до края экрана) и точки под лентой. Прокрутка и привязка — нативные
 * (scroll-snap), стрелки и точки листают программно; невидимые карточки — `inert`.
 * При одном отзыве листать нечего: стрелки и точки не выводятся (полосы остаются как фон).
 * Подписи стрелок и точек — из словаря (a11y.*); без них управления не показываются.
 */
export function TestimonialSlider({
  items,
  readMore,
  labels,
}: {
  items: TestimonialItem[];
  readMore: string;
  labels?: SliderLabels;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  // лента едет: уходящая и приходящая карточки — opacity 0.4 + blur(3px) (animations.md, п. 10)
  const [moving, setMoving] = useState(false);
  // высота ленты плавно подстраивается под активную карточку
  const [height, setHeight] = useState<number>();
  const multiple = items.length > 1 && !!labels;

  const go = (i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el && slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: reduce ? "instant" : "smooth" });
  };

  useEffect(() => {
    const slide = track.current?.children[index] as HTMLElement | undefined;
    if (!slide || items.length < 2) return;
    const measure = () => setHeight(slide.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [index, items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el || items.length < 2) return;
    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((sl, i) => {
        const d = Math.abs(sl.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < bestDist) {
          best = i;
          bestDist = d;
        }
      });
      setIndex(best);
    };
    let timer: ReturnType<typeof setTimeout>;
    const onScrollMoving = () => {
      onScroll();
      setMoving(true);
      clearTimeout(timer);
      timer = setTimeout(() => setMoving(false), 120);
    };
    el.addEventListener("scroll", onScrollMoving, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScrollMoving);
    };
  }, [items.length]);

  return (
    <div>
      <div className="flex items-stretch">
        <div className="hidden xl:block">
          {multiple ? (
            <ButtonVertical direction="left" label={labels.prev} onClick={() => go(Math.max(0, index - 1))} />
          ) : (
            <div aria-hidden="true" className="h-full w-37.5 bg-bg-card-muted" />
          )}
        </div>
        <ul ref={track} data-moving={moving || undefined} style={height ? { height } : undefined} className={`${s.track} -mr-5 min-w-0 flex-1 pr-5 md:-mr-10 md:pr-10 xl:mr-0 xl:pr-0`}>
          {items.map((item, i) => (
            <li key={item.id} className={s.slide} inert={items.length > 1 && i !== index}>
              <Card item={item} readMore={readMore} />
            </li>
          ))}
        </ul>
        <div className="hidden xl:block">
          {multiple ? (
            <ButtonVertical direction="right" label={labels.next} onClick={() => go(Math.min(items.length - 1, index + 1))} />
          ) : (
            <div aria-hidden="true" className="h-full w-37.5 bg-bg-card-muted" />
          )}
        </div>
      </div>
      {multiple ? (
        <div className="mt-5 flex justify-center gap-2 xl:hidden">
          {items.map((item, i) => (
            <PaginationDot key={item.id} active={i === index} label={labels.slideN.replace("{n}", String(i + 1)).replace("{total}", String(items.length))} onClick={() => go(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
