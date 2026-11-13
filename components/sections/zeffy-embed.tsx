"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://www.zeffy.com/embed/v2/zeffy-embed.js";
const FORM_URL = "/en-US/embed/newsletter-form/stay-connected-36";

/**
 * Форма подписки Zeffy (iframe): контейнер `zeffy-embed` — фон bg-page, без скругления,
 * отступы сверху / снизу 40, по бокам 150 / 40 / 20 (Figma: subscribe `1084:10472`).
 * Скрипт Zeffy подключается, когда блок подъезжает к экрану, и заново при каждом показе
 * компонента (клиентский переход не перезапускает скрипт сам). Внутри iframe ничего не настраивается.
 * Место под форму зарезервировано (min-h 218), чтобы страница не прыгала.
 */
export function ZeffyEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let script: HTMLScriptElement | null = null;
    const load = () => {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      script?.remove();
    };
  }, []);

  return (
    <div className="zeffy-embed min-h-54.5 bg-bg-page px-5 py-10 md:px-10 xl:px-37.5">
      <div ref={ref} data-zeffy-embed data-form-url={FORM_URL} />
    </div>
  );
}
