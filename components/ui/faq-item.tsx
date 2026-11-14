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
      className="size-6 shrink-0 fill-none stroke-current text-decor-icon group-hover/faq:text-text-inverse transition-colors duration-(--duration-faq-hover) ease-faq motion-reduce:transition-none"
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
 * border/divider. Hover (мышь) — вся строка (вопрос и раскрытый ответ) bg/inverse, текст text/inverse; слева отступа нет — текст стоит по направляющей. Ответ отступает слева на 150 (desktop)
 * и 172 (tablet), на mobile — на всю ширину; он всегда есть в HTML, закрытый — `inert` и высотой 0.
 * Каждая строка открывается независимо. Смена цвета при hover плавная в обе стороны (`--duration-faq-hover`, 300 ms; transition — на базовом состоянии). Раскрытие плавное (animations.md, п. 12): высота ответа 0fr → 1fr + opacity, 350 ms ease-out;
 * у открытой строки вопрос ниже на 5 (padding-top 40 → 45, desktop / tablet); padding-top и padding-bottom кнопки анимируются с той же длительностью и кривой, что и высота ответа.
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
    <div data-reveal className="group/faq border-b border-border-divider transition-colors duration-(--duration-faq-hover) ease-faq hover:bg-bg-inverse motion-reduce:transition-none">
      <h3 className="text-h3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-start justify-between gap-5 py-6 text-left text-text-heading group-hover/faq:text-text-inverse transition-[padding-top,padding-bottom,color] ease-faq [transition-duration:var(--duration-faq),var(--duration-faq),var(--duration-faq-hover)] motion-reduce:transition-none md:items-center md:py-10 ${open ? "pb-5 md:pt-11.25 md:pb-5" : ""}`}
        >
          <span className="min-w-0 flex-1">{question}</span>
          <FaqToggle open={open} />
        </button>
      </h3>
      {/* раскрытие по высоте вместе с проявлением: grid-template-rows 0fr → 1fr + opacity (animations.md, п. 12) */}
      <div
        id={`${id}-answer`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-(--duration-faq) ease-faq motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="text-body flex flex-col gap-5 pb-6 text-text-body transition-colors duration-(--duration-faq-hover) ease-faq group-hover/faq:text-text-inverse motion-reduce:transition-none md:pb-10 md:pl-43 xl:pl-37.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
