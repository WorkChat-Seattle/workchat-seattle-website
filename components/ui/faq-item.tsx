"use client";

import { type ReactNode, useId, useState } from "react";
import { faqClosePath, faqPlusPath } from "./glyphs";

/**
 * Переключатель FAQ (Figma: faq-toggle `1041:1384`, 24×24): плюс, при раскрытии — крестик; линия 1,5.
 * Цвет — currentColor (decor/icon, при hover на тёмной строке — text/inverse).
 */
function FaqToggle({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6 shrink-0 fill-none stroke-current text-decor-icon group-hover:text-text-inverse"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d={open ? faqClosePath : faqPlusPath} />
    </svg>
  );
}

/**
 * Строка FAQ / раздел политики (Figma: faq-item `1010:1354`, state collapsed | hover | expanded).
 * Вопрос — заголовок h3 стиля h3 внутри кнопки на всю строку (`aria-expanded`, `aria-controls`); внизу линия
 * border/divider. Hover (мышь) — строка bg/inverse, вопрос text/inverse. Ответ отступает слева на 150 (desktop)
 * и 172 (tablet), на mobile — на всю ширину; он всегда есть в HTML, закрытый — `inert` и высотой 0.
 * Каждая строка открывается независимо. Плавное раскрытие — на проходе анимаций (animations.md, п. 12).
 * Отступы строки: 40 (desktop, tablet) и 24 (mobile); вопрос→ответ 20.
 */
export function FaqItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div data-reveal className="border-b border-border-divider">
      <h3 className="text-h3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen((v) => !v)}
          className={`group flex w-full items-start justify-between gap-5 py-6 text-left text-text-heading hover:bg-bg-inverse hover:text-text-inverse md:items-center md:py-10 ${open ? "pb-5 md:pb-5" : ""}`}
        >
          <span className="min-w-0 flex-1">{question}</span>
          <FaqToggle open={open} />
        </button>
      </h3>
      <div
        id={`${id}-answer`}
        inert={!open}
        className={open ? "pb-6 md:pb-10" : "h-0 overflow-hidden"}
      >
        <div className="text-body flex flex-col gap-5 text-text-body md:pl-43 xl:pl-37.5">{children}</div>
      </div>
    </div>
  );
}
