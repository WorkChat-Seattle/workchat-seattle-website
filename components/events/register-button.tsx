"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

/** Таймеры длиннее ~24,8 дня (2³¹ мс) в браузере срабатывают сразу — ограничиваем и перепроверяем (docs/dynamic-content.md). */
const MAX_TIMEOUT = 2_000_000_000;

/**
 * Кнопка регистрации (Figma: button option=dark, state=disabled «Registration closed»). Пока событие не закончилось —
 * ссылка на Zeffy в новой вкладке; после окончания — `<button disabled>`. Страница отдаётся с кэшем до часа,
 * поэтому клиент сам переключает кнопку: проверка при монтировании, таймер до окончания, перепроверка при возврате на вкладку.
 * У предстоящего события без ссылки на регистрацию кнопки нет; у прошедшего неактивная кнопка есть всегда.
 */
export function RegisterButton({
  href,
  endTime,
  initialClosed,
  texts,
  className,
}: {
  href: string | null;
  /** Момент окончания события, ISO. */
  endTime: string;
  initialClosed: boolean;
  texts: { register: string; closed: string; newTab: string };
  className?: string;
}) {
  const [closed, setClosed] = useState(initialClosed);

  useEffect(() => {
    const end = new Date(endTime).getTime();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      clearTimeout(timer);
      const left = end - Date.now();
      if (left <= 0) {
        setClosed(true);
        return;
      }
      timer = setTimeout(check, Math.min(left, MAX_TIMEOUT));
    };
    check();
    document.addEventListener("visibilitychange", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [endTime]);

  if (closed) {
    return (
      <Button option="dark" disabled className={className}>
        {texts.closed}
      </Button>
    );
  }
  if (!href) return null;
  return (
    <ButtonLink option="dark" href={href} newTabLabel={texts.newTab} className={className}>
      {texts.register}
    </ButtonLink>
  );
}
