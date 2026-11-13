"use client";

import { type Ref, useEffect, useImperativeHandle, useRef } from "react";

/** Cloudflare Turnstile (docs/forms-to-notion.md): невидимая проверка, виджет показывается, только если Cloudflare просит действия. */
type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  /** Загрузить скрипт и вывести виджет (при первом фокусе в форме — чтобы не грузить Cloudflare тем, кто форму не трогает). */
  prepare: () => Promise<void>;
  /** Токен для отправки (ждёт до 15 с; null — не получили). */
  getToken: () => Promise<string | null>;
  /** После отправки: токен одноразовый. */
  reset: () => void;
};

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Контейнер виджета Turnstile + ручка `handle` (prepare / getToken / reset). Ключ сайта — NEXT_PUBLIC_TURNSTILE_SITE_KEY. */
export function Turnstile({ lang, handle }: { lang: string; handle: Ref<TurnstileHandle> }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((t: string | null) => void)[]>([]);

  const settle = (t: string | null) => {
    token.current = t;
    if (t) waiters.current.splice(0).forEach((w) => w(t));
  };

  const prepare = async () => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (widget.current || !container.current || !siteKey) return;
    try {
      await loadScript();
    } catch {
      return;
    }
    if (widget.current || !container.current || !window.turnstile) return;
    widget.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      appearance: "interaction-only",
      language: lang,
      callback: (t: string) => settle(t),
      "expired-callback": () => settle(null),
      "error-callback": () => settle(null),
    });
  };

  useImperativeHandle(handle, () => ({
    prepare,
    async getToken() {
      await prepare();
      if (token.current) return token.current;
      return new Promise<string | null>((resolve) => {
        waiters.current.push(resolve);
        setTimeout(() => resolve(token.current), 15000);
      });
    },
    reset() {
      token.current = null;
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }));

  useEffect(
    () => () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    },
    [],
  );

  return <div ref={container} />;
}
