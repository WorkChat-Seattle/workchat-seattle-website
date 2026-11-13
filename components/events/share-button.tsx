"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * «Share this event» (Figma: button option=outlined). На телефонах и планшетах открывает системное окно «Поделиться»,
 * на компьютере копирует адрес страницы и на пару секунд подтверждает это текстом на кнопке (и для скринридера через aria-live).
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

  function confirmCopied() {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  }

  // Запасной способ копирования (старые браузеры, нет доступа к буферу): временное поле + execCommand
  function legacyCopy(text: string): boolean {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    field.remove();
    return ok;
  }

  async function share() {
    const url = window.location.href;
    // Системное окно — только на устройствах с касанием (телефоны, планшеты). На компьютере (Mac: Safari и Chrome тоже умеют
    // navigator.share) кнопка всегда копирует адрес и говорит об этом: открывающееся системное окно выглядело как «не работает».
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return; // окно закрыли
        // другая ошибка — копируем адрес ниже
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      confirmCopied();
    } catch {
      if (legacyCopy(url)) confirmCopied();
    }
  }

  return (
    <Button option="outlined" onClick={share} className={className} aria-live="polite">
      {copied ? texts.copied : texts.share}
    </Button>
  );
}
