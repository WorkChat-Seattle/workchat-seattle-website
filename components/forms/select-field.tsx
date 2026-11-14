"use client";

import Image from "next/image";
import { type KeyboardEvent, type ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import chevron from "@/public/images/forms/chevron-down.svg";
import { Checkbox } from "./checkbox";
import { FieldError, PlaceholderText, parseRequired } from "./text-field";

export type SelectOption = {
  value: string;
  /** Текст для закрытого поля и скринридера. */
  text: string;
  /** Содержимое строки в открытом списке (по умолчанию `text`); например, с ссылкой внутри. */
  label?: ReactNode;
};

/** 2 строки по 16 / 130% — больше в закрытом поле не показываем (CLAUDE.md, «Правила вёрстки», п. 8). */
const TWO_LINES = 42;

/**
 * Выпадающий список формы (docs/forms-to-notion.md, «Выпадающие списки»; Figma: form-field type=select + `Volunteer / help dropdown open`).
 * - `multi` — чекбоксы (`role="group"`, нативные `<input type="checkbox">`), `single` — `role="listbox"`: выбор закрывает список.
 * - Закрытое поле: вопрос (плейсхолдер) или выбранное; текст переносится по словам на две строки, стрелка по центру по вертикали, без многоточия.
 *   Выбранные чекбоксы — через запятую, не помещаются в две строки — «N selected».
 * - Подсказка — только в открытом списке, первой строкой. Esc и клик вне закрывают, фокус возвращается на поле.
 * - `max` — предел выбранных; при достижении остальные варианты `aria-disabled`.
 */
export function SelectField({
  id,
  label,
  hint,
  options,
  mode,
  value,
  onChange,
  max,
  error,
  countText,
  requiredText,
}: {
  id: string;
  /** Вопрос: плейсхолдер закрытого поля и имя для скринридера. */
  label: string;
  hint: string;
  options: SelectOption[];
  mode: "single" | "multi";
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  error?: string;
  /** Подпись «N selected». */
  countText: (n: number) => string;
  /** a11y.required («required» / «обязательное поле»): скрытое слово в доступном имени обязательного списка (звёздочка в подписи — aria-hidden). */
  requiredText?: string;
}) {
  const { text: labelText, required } = parseRequired(label);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const uid = useId();
  const panelId = `${id}-panel`;
  const hintId = `${id}-hint`;
  const labelId = `${id}-q`;
  const reqId = `${id}-req`;
  const valueId = `${id}-val`;
  const errorId = `${id}-error`;

  const selected = options.filter((o) => value.includes(o.value));
  const joined = selected.map((o) => o.text).join(", ");
  const filled = selected.length > 0;

  // Не помещается в две строки — «N selected». Мерим невидимую копию текста той же ширины.
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || mode !== "multi") return;
    const measure = () => setCollapsed(el.offsetHeight > TWO_LINES);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement as Element);
    return () => ro.disconnect();
  }, [joined, mode]);

  const close = (focusButton: boolean) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // Esc — на document: в Safari клик по кнопке не даёт ей фокус, и событие не дошло бы до корня списка
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const optionButtons = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

  const openList = () => {
    setOpen(true);
    if (mode === "single") {
      // фокус на выбранный (или первый) вариант — после отрисовки панели
      requestAnimationFrame(() => {
        const opts = optionButtons();
        (opts.find((o) => o.getAttribute("aria-selected") === "true") ?? opts[0])?.focus();
      });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== "single") return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      if (!open) {
        openList();
        return;
      }
      const opts = optionButtons();
      const i = opts.indexOf(document.activeElement as HTMLElement);
      const next =
        e.key === "Home" ? 0 : e.key === "End" ? opts.length - 1 : e.key === "ArrowDown" ? Math.min(opts.length - 1, i + 1) : Math.max(0, i - 1);
      opts[next]?.focus();
    }
  };

  const toggle = (v: string) => {
    if (mode === "single") {
      onChange([v]);
      close(true);
      return;
    }
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else if (max === undefined || value.length < max) onChange([...value, v]);
  };

  const full = max !== undefined && value.length >= max;

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        // Фокус ушёл на другой элемент вне списка (Tab) — закрываем. Клик по пустому месту панели даёт relatedTarget = null — не закрываем.
        // Клик по тексту варианта переводит фокус на ближайший фокусируемый предок — <form tabindex="-1"> (фокус после отправки):
        // предки списка тоже не считаем «уходом», иначе панель закрывается раньше, чем клик дойдёт до чекбокса.
        const to = e.relatedTarget as Node | null;
        const root = rootRef.current;
        if (open && to && root && !root.contains(to) && !to.contains(root)) setOpen(false);
      }}
    >
      <span id={labelId} className="sr-only">
        {labelText}
      </span>
      {required && requiredText ? (
        <span id={reqId} className="sr-only">
          {requiredText}
        </span>
      ) : null}
      {/* aria-invalid на button: в ARIA 1.2 он помечен устаревшим как глобальный, но скринридеры его читают; eslint-плагин на нём ругается */}
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup={mode === "single" ? "listbox" : "true"}
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        aria-controls={panelId}
        aria-labelledby={[labelId, required && requiredText ? reqId : "", filled ? valueId : ""].filter(Boolean).join(" ")}
        aria-describedby={[open ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
        onClick={() => (open ? close(false) : openList())}
        className={[
          "flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 border bg-bg-input px-4 py-3 text-left text-body outline-none",
          error
            ? "border-status-error"
            : open
              ? "border-border-input-focus"
              : "border-transparent hover:border-border-input-hover focus-visible:border-border-input-focus",
        ].join(" ")}
      >
        <span className="relative min-w-0 flex-1 break-words">
          {filled ? (
            <span id={valueId} className="text-text-heading">
              {mode === "multi" && collapsed ? countText(selected.length) : joined}
            </span>
          ) : (
            <span className="text-text-placeholder">
              <PlaceholderText label={label} />
            </span>
          )}
          <span ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 w-full break-words">
            {joined}
          </span>
        </span>
        <Image src={chevron} alt="" width={20} height={20} className="shrink-0" />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-20 flex flex-col gap-2 border border-border-divider bg-bg-input p-4 shadow-modal"
        >
          <p id={hintId} className="text-body text-text-muted">
            {hint}
          </p>
          {mode === "multi" ? (
            <div role="group" aria-labelledby={labelId} className="mt-1 flex flex-col xl:gap-2">
              {options.map((o, i) => {
                const checked = value.includes(o.value);
                return (
                  <Checkbox
                    key={o.value}
                    id={`${uid}-${i}`}
                    checked={checked}
                    onChange={() => toggle(o.value)}
                    ariaDisabled={full && !checked}
                    className="py-3 xl:py-0"
                  >
                    {o.label ?? o.text}
                  </Checkbox>
                );
              })}
            </div>
          ) : (
            <div role="listbox" aria-labelledby={labelId} className="mt-1 flex flex-col">
              {options.map((o) => {
                const checked = value.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(o.value)}
                    className={[
                      "cursor-pointer px-2 py-3 text-left text-body text-text-body outline-none hover:bg-bg-card-neutral focus-visible:bg-bg-card-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-decor-accent xl:py-2",
                      checked ? "bg-bg-card-neutral font-medium text-text-heading" : "",
                    ].join(" ")}
                  >
                    {o.label ?? o.text}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
      <div className="mt-2 empty:hidden">
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    </div>
  );
}
