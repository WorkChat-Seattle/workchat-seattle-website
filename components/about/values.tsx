"use client";

import { useRef, useState } from "react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { ValueItem } from "@/data/values";

export type ValuesText = { id: ValueItem["id"]; title: string; text: string };

/**
 * Our Values (Figma: values `1113:10994` — 15 вариантов: размер × активная ценность).
 * Один компонент с вкладками: ARIA tabs (`tablist` / `tab` + `aria-selected` / `tabpanel`), стрелки ↑ / ↓ (и ← / →),
 * по умолчанию активна первая. Все пять описаний в HTML, наложены друг на друга (одна ячейка grid), неактивные —
 * `aria-hidden` + `inert`, высота не прыгает; фоны пяти ценностей тоже наложены, видна активная.
 * Раскладка: desktop — высота 800, вкладки 308 слева, описание 347 от x=720, заголовок со столбца x=300;
 * tablet — вкладки 344 (шаг 65) и описание 344 справа, заголовок со 2-й колонки; mobile — вкладки списком (шаг 45),
 * описание под ними через 40. Закрепление блока и смена прокруткой — на проходе анимаций (animations.md, п. 11).
 */
export function Values({ title, items }: { title: string; items: (ValueItem & ValuesText)[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    const next = (i + items.length) % items.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
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
      select(items.length - 1, true);
    }
  };

  return (
    <section
      aria-labelledby="values-title"
      className="relative isolate overflow-hidden px-5 py-20 md:px-10 md:py-30 xl:flex xl:h-200 xl:flex-col xl:px-0 xl:py-0 xl:pt-40"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg-inverse">
        {items.map((item, i) => (
          <div key={item.id} className={`absolute inset-0 ${i === active ? "opacity-100" : "opacity-0"}`}>
            <ResponsiveImage
              mobile={item.images.mobile}
              tablet={item.images.tablet}
              desktop={item.images.desktop}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-300 flex-col gap-10 xl:gap-20">
        <h2 id="values-title" className="text-h2 text-text-white md:pl-43 xl:pl-75">
          {title}
        </h2>
        <div className="flex flex-col gap-10 md:flex-row md:gap-0">
          <div
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
                className={`text-h3 w-full text-left ${i === active ? "text-text-white" : "text-text-inverse-muted hover:text-text-white"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="grid md:flex-1 md:pl-10 xl:ml-73 xl:w-86.75 xl:flex-none xl:pl-0">
            {items.map((item, i) => (
              <p
                key={item.id}
                role="tabpanel"
                id={`value-panel-${item.id}`}
                aria-labelledby={`value-tab-${item.id}`}
                aria-hidden={i !== active}
                inert={i !== active}
                className={`text-body col-start-1 row-start-1 text-text-white ${i === active ? "opacity-100" : "opacity-0"}`}
              >
                {item.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
