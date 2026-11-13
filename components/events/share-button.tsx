"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * «Share this event» (Figma: button option=outlined). Где есть системное окно «Поделиться» (телефоны) — открывает его,
 * иначе копирует адрес страницы и на пару секунд подтверждает это текстом на кнопке (и для скринридера через aria-live).
 */
export function ShareButton({
  title,
  texts,
  className,
}: {
  title: string;
  texts: { share: string; copied: string };
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // окно «Поделиться» закрыли или буфер недоступен — ничего не делаем
    }
  }

  return (
    <Button option="outlined" onClick={share} className={className} aria-live="polite">
      {copied ? texts.copied : texts.share}
    </Button>
  );
}
