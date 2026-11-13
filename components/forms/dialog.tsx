"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { autoLink } from "@/lib/rich";
import closeIcon from "@/public/images/forms/modal-close.svg";
import iconError from "@/public/images/forms/icon-error.svg";
import iconSuccess from "@/public/images/forms/icon-success.svg";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Модальное окно (Figma: modal-message `1442:18126`, modal-suggest-event `1381:13869`): `role="dialog"` `aria-modal="true"`,
 * фокус внутри окна (Tab не выходит), прокрутка страницы заблокирована, закрытие по крестику, Esc и клику по затемнению.
 * Desktop 680, tablet 640, по центру на затемнении overlay/hover-dark; mobile — во весь экран без затемнения.
 * Возврат фокуса после закрытия — забота вызывающего (`onClose`).
 */
export function Dialog({
  labelledBy,
  closeLabel,
  onClose,
  minHeight,
  children,
}: {
  labelledBy: string;
  /** a11y-подпись крестика (btn.close). */
  closeLabel: string;
  onClose: () => void;
  /** Минимальная высота окна — у сообщений (388 / 378); у формы окно по содержимому. */
  minHeight?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.getClientRects().length > 0);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-bg-card-neutral md:flex md:items-center md:justify-center md:bg-overlay-hover-dark md:p-10"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={[
          "flex min-h-full w-full flex-col bg-bg-card-neutral outline-none md:m-auto md:min-h-0 md:w-160 md:shadow-modal xl:w-170",
          minHeight ? "md:min-h-94.5 xl:min-h-97" : "",
        ].join(" ")}
      >
        <div className="flex justify-end pt-3 pr-3 pl-4 md:px-4 md:pt-4">
          <button type="button" onClick={onClose} aria-label={closeLabel} className="size-10 cursor-pointer outline-offset-2 focus-visible:outline-2 focus-visible:outline-decor-accent">
            <Image src={closeIcon} alt="" width={40} height={40} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Результат отправки (Figma: modal-message type = success | error): иконка 64, h2, текст, кнопка «Close» (outlined). */
export function MessageDialog({
  type,
  title,
  text,
  closeLabel,
  onClose,
}: {
  type: "success" | "error";
  title: string;
  text: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <Dialog labelledBy="form-result-title" closeLabel={closeLabel} onClose={onClose} minHeight>
      <div className="flex flex-col gap-10 px-5 pb-10 md:px-10 md:pb-12">
        <div className="flex flex-col gap-5">
          <Image src={type === "success" ? iconSuccess : iconError} alt="" width={64} height={64} />
          <h2 id="form-result-title" className="text-h2 text-text-heading">
            {title}
          </h2>
          <p className="text-body whitespace-pre-line text-text-body">{type === "error" ? autoLink(text) : text}</p>
        </div>
        <Button option="outlined" onClick={onClose} className="w-full md:w-60">
          {closeLabel}
        </Button>
      </div>
    </Dialog>
  );
}
