"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Появление блоков при прокрутке (animations.md, п. 1).
 *
 * Разметка помечает элементы атрибутами, текст остаётся в серверном HTML:
 *  - `data-reveal` — проявить один раз, когда видно 15% элемента; `data-reveal="now"` — сразу при загрузке (hero);
 *  - `data-reveal-grid` — контейнер, чьи дети проявляются строками: строка целиком, следующая через 150 ms;
 *    `data-reveal-grid="one-row"` — все карточки одной строкой (What we do, Resource Hub, команда).
 * Соседи в одной строке одной секции идут с шагом 100 ms (`--reveal-delay`).
 *
 *  - `data-in-view` — секция с собственной анимацией (Find your mentor): один раз при видимых 20% получает `data-in`,
 *    дальше всё делает CSS.
 * Скрытие до появления — только CSS `.js …` (класс `js` ставит скрипт в <head>, если нет
 * prefers-reduced-motion), поэтому без JS и при reduced motion всё видно сразу.
 * Состояние: нет атрибута `data-revealed` — скрыт; `in` — идёт переход; `done` — стили сняты,
 * дальше работают собственные hover-переходы элемента.
 */

const num = (name: string, fallback: number) => {
  const v = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js") || !("IntersectionObserver" in window)) {
      root.classList.remove("js");
      return;
    }

    const STEP = num("--duration-reveal-step", 100);
    const ROW_STEP = num("--duration-reveal-row", 150);
    const THRESHOLD = num("--reveal-threshold", 0.15);

    const show = (el: HTMLElement, delay: number) => {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      el.dataset.revealed = "in";
      const done = (e: TransitionEvent) => {
        if (e.target !== el || e.propertyName !== "opacity") return;
        el.removeEventListener("transitionend", done);
        el.style.removeProperty("--reveal-delay");
        el.dataset.revealed = "done";
      };
      el.addEventListener("transitionend", done);
    };

    const top = (el: Element) => Math.round(el.getBoundingClientRect().top + window.scrollY);
    const cleanups: Array<() => void> = [];

    // одиночные элементы: задержка = место в строке (одинаковый верх) × 100 ms
    const singles = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const rankByRow = new Map<string, number>();
    const single = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          single.unobserve(entry.target);
          show(entry.target as HTMLElement, Number((entry.target as HTMLElement).dataset.revealRank ?? 0) * STEP);
        }
      },
      { threshold: THRESHOLD },
    );
    for (const el of singles) {
      const section = el.closest("section, footer, article");
      const key = `${section ? Array.from(document.querySelectorAll("section, footer, article")).indexOf(section) : -1}:${Math.round(top(el) / 4)}`;
      const rank = rankByRow.get(key) ?? 0;
      rankByRow.set(key, rank + 1);
      el.dataset.revealRank = String(rank);
      if (el.dataset.reveal === "now") show(el, rank * STEP);
      else single.observe(el);
    }
    cleanups.push(() => single.disconnect());

    // сетки карточек: строка целиком, следующая через 150 ms
    type Row = { items: HTMLElement[]; top: number; done: boolean; block: Element };
    const rowObserver = new IntersectionObserver(
      (entries) => {
        const rows: Row[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const row = rowOf.get(entry.target as HTMLElement)!;
          rowObserver.unobserve(entry.target);
          if (row.done) continue;
          row.done = true;
          rows.push(row);
        }
        rows.sort((a, b) => a.top - b.top);
        const seen = new Map<Element, number>();
        for (const row of rows) {
          const n = seen.get(row.block) ?? 0;
          seen.set(row.block, n + 1);
          for (const el of row.items) show(el, n * ROW_STEP);
        }
      },
      { threshold: THRESHOLD },
    );
    const rowOf = new Map<HTMLElement, Row>();
    for (const block of document.querySelectorAll<HTMLElement>("[data-reveal-grid]")) {
      const oneRow = block.dataset.revealGrid === "one-row";
      const byTop = new Map<number, HTMLElement[]>();
      for (const child of Array.from(block.children) as HTMLElement[]) {
        if (child.dataset.revealed) continue;
        const t = oneRow ? 0 : top(child);
        byTop.set(t, [...(byTop.get(t) ?? []), child]);
      }
      for (const [t, items] of byTop) {
        const row: Row = { items, top: t, done: false, block };
        for (const el of items) {
          rowOf.set(el, row);
          rowObserver.observe(el);
        }
      }
    }
    cleanups.push(() => rowObserver.disconnect());

    // секции с собственной анимацией: data-in при 20% (Find your mentor, animations.md, п. 9)
    const inView = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "true";
          inView.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    document.querySelectorAll<HTMLElement>("[data-in-view]:not([data-in])").forEach((el) => inView.observe(el));
    cleanups.push(() => inView.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
