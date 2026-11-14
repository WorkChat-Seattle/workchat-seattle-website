"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cssNumber, parallaxQuery, subscribeScroll } from "@/lib/scroll-loop";

/**
 * Параллакс (animations.md, пп. 7–8; эталон — workchat-v2). Только `transform: translate3d`, только пока
 * секция на экране (IntersectionObserver), `will-change` — тоже только на это время; ≥1280 и без reduced motion.
 * Содержимое остаётся в серверном HTML — компоненты лишь двигают свой <div>.
 */

/** Подписка на прокрутку, пока `target` виден; `apply` — расчёт и запись transform, `reset` — вернуть как в статике. */
function useWhileVisible(
  ref: React.RefObject<HTMLElement | null>,
  target: () => Element | null,
  apply: (el: HTMLElement) => void,
  reset: (el: HTMLElement) => void,
) {
  useEffect(() => {
    const el = ref.current;
    const watched = target();
    if (!el || !watched) return;
    const mq = window.matchMedia(parallaxQuery);
    let unsubscribe: (() => void) | undefined;
    let visible = false;

    const sync = () => {
      const on = mq.matches && visible;
      if (on && !unsubscribe) {
        el.style.willChange = "transform";
        unsubscribe = subscribeScroll(() => apply(el));
      } else if (!on && unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
        el.style.willChange = "";
        if (!mq.matches) reset(el);
      }
    };
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    });
    io.observe(watched);
    mq.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
      unsubscribe?.();
      el.style.willChange = "";
      reset(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const clear = (el: HTMLElement) => {
  el.style.transform = "";
};

/**
 * Фото сдвигается вниз внутри рамки на `--parallax-shift` (60 px), без увеличения. Родитель — рамка
 * (`relative overflow-hidden`); слой выше рамки на эти 60 px: `absolute inset-0 xl:-top-15`.
 * basis="page" (hero): 0 наверху страницы → 1, когда фото ушло с экрана;
 * basis="screen" (Featured, Get involved): 0, когда фото входит снизу → 1, когда ушло вверх.
 */
export function ParallaxDrift({
  basis,
  className,
  children,
}: {
  basis: "page" | "screen";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useWhileVisible(
    ref,
    () => ref.current?.parentElement ?? null,
    (el) => {
      const frame = el.parentElement!;
      const shift = cssNumber("--parallax-shift", 60);
      const rect = frame.getBoundingClientRect();
      const t =
        basis === "page"
          ? Math.max(0, Math.min(1, window.scrollY / (rect.top + window.scrollY + frame.offsetHeight)))
          : Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      el.style.transform = `translate3d(0, ${(shift * t).toFixed(1)}px, 0)`;
    },
    clear,
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Community: каждое фото едет со своей скоростью `speed`, максимум `--parallax-shift-community` (120 px),
 * коэффициент `--parallax-gain-community` (400). Опорная секция — ближайшая <section>.
 * norm: +1 — секция только что показалась снизу, −1 — только что ушла вверх.
 */
export function ParallaxSpeed({
  speed,
  className,
  children,
}: {
  speed: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useWhileVisible(
    ref,
    () => ref.current?.closest("section") ?? null,
    (el) => {
      const section = el.closest("section")!;
      const max = cssNumber("--parallax-shift-community", 120);
      const gain = cssNumber("--parallax-gain-community", 400);
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const norm = (rect.top + rect.height / 2 - vh / 2) / (rect.height / 2 + vh / 2);
      const y = Math.max(-max, Math.min(max, norm * speed * gain));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    },
    clear,
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Numbers: две колонки карточек (чётные дети — левая, нечётные — правая) едут с разной скоростью (правая быстрее)
 * и выравниваются по верху, когда секция в центре экрана — это положение в статической раскладке.
 * Путь от выровненного положения: левая `--numbers-travel-left` × norm, правая `--numbers-travel-right` × norm
 * (в v2: 200 и 350 = 200 + 150 разницы колонок). norm: +1 — секция только что показалась снизу, 0 — по центру, −1 — ушла вверх.
 */
export function ParallaxColumns({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useWhileVisible(
    ref,
    () => ref.current?.closest("section") ?? null,
    (el) => {
      const section = el.closest("section")!;
      const left = cssNumber("--numbers-travel-left", 200);
      const right = cssNumber("--numbers-travel-right", 350);
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const norm = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / ((vh + rect.height) / 2)));
      Array.from(el.children).forEach((child, i) => {
        (child as HTMLElement).style.transform = `translate3d(0, ${((i % 2 === 0 ? left : right) * norm).toFixed(1)}px, 0)`;
      });
    },
    (el) => {
      Array.from(el.children).forEach((child) => ((child as HTMLElement).style.transform = ""));
    },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Volunteer roles: четыре столбца карточек плывут по вертикали с разной скоростью (как фото Community, п. 7).
 * В начале страницы смещение 0 — карточки стоят ровно по макету (120 px от вводного текста); дальше столбец уезжает вверх
 * на `прокрутка / (высота секции / 2 + высота экрана / 2) × speed × --parallax-gain-community`, не больше
 * `--parallax-shift-volunteer` (80 px — меньше зазора до текста). У каждой карточки внутри `data-parallax-speed`.
 * Двигаем свойством `translate`, а не `transform`: transform занят появлением при прокрутке (data-reveal-grid).
 * Обёртка `display: contents` — на раскладку не влияет; опорная секция — ближайшая <section>.
 */
export function ParallaxTiles({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tiles = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>("[data-parallax-speed]"));
  useWhileVisible(
    ref,
    () => ref.current?.closest("section") ?? null,
    (el) => {
      const section = el.closest("section")!;
      const max = cssNumber("--parallax-shift-volunteer", 80);
      const gain = cssNumber("--parallax-gain-community", 400);
      const norm = window.scrollY / (section.offsetHeight / 2 + window.innerHeight / 2);
      tiles(el).forEach((tile) => {
        const speed = Number(tile.dataset.parallaxSpeed);
        const y = Math.max(-max, Math.min(0, -norm * speed * gain));
        tile.style.translate = `0 ${y.toFixed(1)}px`;
      });
    },
    (el) => tiles(el).forEach((tile) => (tile.style.translate = "")),
  );
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
