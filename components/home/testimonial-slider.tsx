"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonVertical } from "@/components/ui/button-vertical";
import { quoteMarkPath } from "@/components/ui/glyphs";
import { RingPhoto } from "@/components/ui/ring-photo";
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
      {/* фото на весь круг под кольцом 20 (decor/card-outline, 90% белого) — как обводка внутри круга в Figma */}
      <RingPhoto src={item.photo} width={375} ring="border-20" className="size-72.5 md:size-60 xl:size-93.75" />
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
  // карточки, которые сейчас размыты (opacity 0.4 + blur 3px, animations.md, п. 10): уходящая и приходящая, как в v2
  const [dim, setDim] = useState<number[]>([]);
  // быстрый возврат резкости после свайпа пальцем
  const [swiping, setSwiping] = useState(false);
  // высота ленты плавно подстраивается под активную карточку
  const [height, setHeight] = useState<number>();
  const busy = useRef(false);
  const multiple = items.length > 1 && !!labels;
  const count = items.length;

  const slideAt = (i: number) => track.current?.children[i] as HTMLElement | undefined;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const leftOf = (slide: HTMLElement) => slide.offsetLeft - (track.current as HTMLElement).offsetLeft;

  // Ждём, пока прокрутка дойдёт до `left` (или 1,5 с): scrollend есть не во всех браузерах
  const settle = (left: number) =>
    new Promise<void>((resolve) => {
      const el = track.current as HTMLElement;
      const start = performance.now();
      let still = 0;
      const tick = () => {
        still = Math.abs(el.scrollLeft - left) < 1.5 ? still + 1 : 0;
        if (still >= 3 || performance.now() - start > 1500) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

  /**
   * Переход к карточке `target`. По кругу в обе стороны: с последней вперёд — к первой, с первой назад — к последней.
   * Для этого нужная карточка на время перехода переставляется (CSS `order`) за последнюю / перед первой, лента едет к ней,
   * затем порядок возвращается и прокрутка мгновенно ставится на ту же карточку — глаз перестановки не видит.
   */
  const go = async (target: number) => {
    const el = track.current;
    const from = index;
    if (!el || busy.current || target === from || target < 0 || target >= count) return;
    const from_ = slideAt(from);
    const to = slideAt(target);
    if (!from_ || !to) return;

    if (reduceMotion()) {
      el.scrollTo({ left: leftOf(to), behavior: "instant" });
      setIndex(target);
      return;
    }

    busy.current = true;
    const wrapForward = from === count - 1 && target === 0;
    const wrapBack = from === 0 && target === count - 1;
    const between: number[] = [];
    if (wrapForward || wrapBack) between.push(from, target);
    else for (let k = Math.min(from, target); k <= Math.max(from, target); k++) between.push(k);

    // приходящая карточка ждёт уже размытой и проявляется по пути; уходящая (и промежуточные) остаются размытыми
    setDim(between);
    setIndex(target);
    let destination: number;
    if (wrapForward) {
      to.style.order = "1";
      destination = leftOf(to);
    } else if (wrapBack) {
      const before = from_.offsetLeft;
      to.style.order = "-1";
      el.scrollTo({ left: el.scrollLeft + (from_.offsetLeft - before), behavior: "instant" });
      destination = leftOf(to);
    } else {
      destination = leftOf(to);
    }
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    setDim(between.filter((k) => k !== target));
    el.scrollTo({ left: destination, behavior: "smooth" });
    await settle(destination);
    if (wrapForward || wrapBack) {
      to.style.order = "";
      el.scrollTo({ left: leftOf(to), behavior: "instant" });
    }
    setDim([]);
    busy.current = false;
  };

  const step = (dir: 1 | -1) => void go((index + dir + count) % count);

  useEffect(() => {
    const slide = track.current?.children[index] as HTMLElement | undefined;
    if (!slide || items.length < 2) return;
    const measure = () => setHeight(slide.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [index, items.length]);

  // Прокрутка пальцем / колесом: активная карточка — ближайшая к краю; пока лента едет — все карточки размыты, после остановки
  // резкость возвращается за 250 мс. Переходы кнопками (go) ведут себя сами.
  useEffect(() => {
    const el = track.current;
    if (!el || items.length < 2) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (busy.current) return;
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
      setSwiping(true);
      setDim(slides.map((_, i) => i));
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDim([]);
        setSwiping(false);
      }, 100);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [items.length]);

  return (
    <div
      onKeyDown={(e) => {
        if (!multiple) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
      }}
    >
      <div className="flex items-stretch">
        <div className="hidden xl:block">
          {multiple ? (
            <ButtonVertical direction="left" label={labels.prev} onClick={() => step(-1)} />
          ) : (
            <div aria-hidden="true" className="h-full w-37.5 bg-bg-card-muted" />
          )}
        </div>
        <ul ref={track} data-swiping={swiping || undefined} style={height ? { height } : undefined} className={`${s.track} -mr-5 min-w-0 flex-1 pr-5 md:-mr-10 md:pr-10 xl:mr-0 xl:pr-0`}>
          {items.map((item, i) => (
            <li key={item.id} data-dim={dim.includes(i) || undefined} className={s.slide} inert={items.length > 1 && i !== index}>
              <Card item={item} readMore={readMore} />
            </li>
          ))}
        </ul>
        <div className="hidden xl:block">
          {multiple ? (
            <ButtonVertical direction="right" label={labels.next} onClick={() => step(1)} />
          ) : (
            <div aria-hidden="true" className="h-full w-37.5 bg-bg-card-muted" />
          )}
        </div>
      </div>
      {multiple ? (
        <div className="mt-5 flex justify-center gap-2 xl:hidden">
          {items.map((item, i) => (
            <PaginationDot key={item.id} active={i === index} label={labels.slideN.replace("{n}", String(i + 1)).replace("{total}", String(items.length))} onClick={() => void go(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
