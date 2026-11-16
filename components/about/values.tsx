"use client";

import { useEffect, useRef, useState } from "react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { ValueItem } from "@/data/values";
import { cssNumber, subscribeScroll } from "@/lib/scroll-loop";
import s from "./values.module.css";

export type ValuesText = { id: ValueItem["id"]; title: string; text: string };

/** Слова описания: каждое — в своей маске (разбивка при серверной отрисовке, не в DOM после загрузки). */
function Words({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className={s.word}>
            <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Верх закреплённой сцены: нижняя граница шапки (--header-height); если сцена выше окна без шапки — виден её низ. */
function stickyTop(stageH: number): number {
  const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
  return header + Math.min(0, window.innerHeight - header - stageH);
}

/**
 * Our Values (Figma: values `1113:10994` — 15 вариантов: размер × активная ценность).
 * Один компонент с вкладками: ARIA tabs (`tablist` / `tab` + `aria-selected` / `tabpanel`), стрелки ↑ / ↓ (и ← / →),
 * по умолчанию активна первая. Все пять описаний в HTML, наложены друг на друга (одна ячейка grid), неактивные —
 * `aria-hidden` + `inert`, высота не прыгает.
 * Раскладка: desktop — высота 800, вкладки 308 слева, описание 347 от x=720, заголовок со столбца x=300;
 * tablet — вкладки 344 (шаг 65) и описание 344 справа, заголовок со 2-й колонки; mobile — вкладки списком (шаг 45),
 * описание под ними через 40.
 *
 * Анимация (animations.md, п. 11): сцена закреплена (`position: sticky`), секция выше сцены на N × `--values-step`
 * (60vh), ценность = floor(прокручено в закреплении / шаг). Фон перетекает (600 ms), старый текст уезжает по словам,
 * новый приезжает через 600 ms, клик по вкладке плавно прокручивает к её шагу. Без движения (нет JS / reduced motion) —
 * без закрепления, переключение нажатием. Фоны грузятся только для активной ценности и соседних.
 */
export function Values({ title, items }: { title: string; items: (ValueItem & ValuesText)[] }) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  // фоны, которые уже можно грузить: активный и соседние (следующий — предзагрузка), дальше по мере прокрутки
  const [loaded, setLoaded] = useState<number[]>([0, 1]);
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgsRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLParagraphElement | null)[]>([]);
  const prev = useRef(0);
  // закрепление: на всех размерах, без prefers-reduced-motion и только с JS (класс js на <html>)
  const [pin, setPin] = useState(false);
  const pinned = useRef(false);
  const leavingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // смена ценности: фон и текст (текст — классами, как в v2: «стартовая позиция без анимации → активная»)
  useEffect(() => {
    const from = prev.current;
    if (from === active) return;
    prev.current = active;
    const dir = active > from ? 1 : -1;

    setLoaded((l) => Array.from(new Set([...l, active - 1, active, active + 1])).filter((i) => i >= 0 && i < count));
    setLeaving(from);
    clearTimeout(leavingTimer.current);
    leavingTimer.current = setTimeout(() => setLeaving(null), 1300);

    const old = panels.current[from];
    const next = panels.current[active];
    if (old) {
      old.classList.remove(s.isActive);
      if (dir > 0) old.classList.add(s.isUp);
      else old.classList.remove(s.isUp);
    }
    if (next) {
      next.classList.remove(s.isUp);
      next.classList.add(dir > 0 ? s.fromBelow : s.fromAbove);
      void next.offsetWidth; // стартовая позиция применяется без анимации
      next.classList.remove(s.fromBelow, s.fromAbove);
      next.classList.add(s.isActive);
    }
  }, [active, count]);

  useEffect(() => () => clearTimeout(leavingTimer.current), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = () => setPin(mq.matches && document.documentElement.classList.contains("js"));
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // закрепление: ценность по прокрутке + параллакс фона
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const layer = bgsRef.current;
    if (!root || !stage || !layer) return;
    pinned.current = pin;
    if (!pin) return;

    const shift = cssNumber("--values-shift", 100);
    let unsubscribe: (() => void) | undefined;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const stageH = stage.offsetHeight;
      // сцена закреплена под шапкой; на низком окне виден низ блока
      const top = stickyTop(stageH);
      stage.style.top = `${top}px`;
      const pin = root.offsetHeight - stageH;
      const step = pin / count;
      if (step <= 0) return;

      // параллакс фона: подъезд −shift → 0, закрепление 0 → −shift, уход обратно к 0
      let y: number;
      if (rect.top > top) {
        y = -shift * (1 - Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight - top))));
      } else {
        const end = top + stageH;
        if (rect.bottom > end) y = -shift * Math.max(0, Math.min(1, (top - rect.top) / pin));
        else y = -shift * (1 - Math.max(0, Math.min(1, (end - rect.bottom) / end)));
      }
      layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;

      const index = Math.max(0, Math.min(count - 1, Math.floor((top - rect.top) / step)));
      setActive(index);
    };

    const io = new IntersectionObserver((entries) => {
      const visible = entries[entries.length - 1].isIntersecting;
      if (visible && !unsubscribe) {
        layer.style.willChange = "transform";
        unsubscribe = subscribeScroll(update);
      } else if (!visible && unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
        layer.style.willChange = "";
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      unsubscribe?.();
      layer.style.willChange = "";
      layer.style.transform = "";
      stage.style.top = "";
    };
  }, [count, pin]);

  /** Выбор ценности: при закреплении — плавная прокрутка к её шагу, иначе — мгновенная смена. */
  const select = (i: number, focus = false) => {
    const next = (i + count) % count;
    if (focus) tabs.current[next]?.focus();
    const root = rootRef.current;
    const stage = stageRef.current;
    if (pinned.current && root && stage) {
      const top = stickyTop(stage.offsetHeight);
      const step = (root.offsetHeight - stage.offsetHeight) / count;
      window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - top + next * step + 2, behavior: "smooth" });
    } else {
      setActive(next);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      select(i + 1, true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      select(i - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(count - 1, true);
    }
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="values-title"
      className="relative"
      style={{ "--values-count": count } as React.CSSProperties}
    >
      <div
        ref={stageRef}
        className={`isolate overflow-hidden px-5 py-20 md:px-10 md:py-30 xl:flex xl:h-200 xl:flex-col xl:px-0 xl:py-0 xl:pt-40 ${s.stage}`}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg-inverse">
          <div ref={bgsRef} className={`absolute inset-0 ${s.bgs}`}>
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`${s.bg} ${i === active ? s.bgActive : i === leaving ? s.bgLeaving : ""}`}
              >
                {loaded.includes(i) ? (
                  <ResponsiveImage
                    mobile={item.images.mobile}
                    tablet={item.images.tablet}
                    desktop={item.images.desktop}
                    sizes="100vw"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-300 flex-col gap-10 xl:gap-20">
          <h2 data-reveal id="values-title" className="text-h2 text-text-white md:pl-43 xl:pl-75">
            {title}
          </h2>
          <div className="flex flex-col gap-10 md:flex-row md:gap-0">
            <div
              data-reveal
              role="tablist"
              aria-orientation="vertical"
              aria-labelledby="values-title"
              className="flex flex-col items-start gap-5 md:w-86 md:shrink-0 md:gap-10 xl:w-77 xl:gap-15"
            >
              {items.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`value-tab-${item.id}`}
                  aria-selected={i === active}
                  aria-controls={`value-panel-${item.id}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`text-h3 w-full text-left transition-colors duration-(--duration-values-color) ease-(--ease-values-color) motion-reduce:transition-none ${i === active ? "text-text-white" : "text-text-inverse-muted hover:text-text-white"}`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div data-reveal className="grid md:flex-1 md:pl-10 xl:ml-73 xl:w-86.75 xl:flex-none xl:pl-0">
              {items.map((item, i) => (
                <p
                  key={item.id}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  role="tabpanel"
                  id={`value-panel-${item.id}`}
                  aria-labelledby={`value-tab-${item.id}`}
                  aria-hidden={i !== active}
                  inert={i !== active}
                  className={`text-body col-start-1 row-start-1 text-text-white ${i === 0 ? s.isActive : ""}`}
                >
                  <Words text={item.text} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={s.spacer} />
    </section>
  );
}
