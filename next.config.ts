import type { NextConfig } from "next";

/**
 * Content-Security-Policy-Report-Only (13.11): пока только сообщает о нарушениях в консоль браузера, ничего не блокирует.
 * Боевой заголовок включим после проверки на превью-деплое (в консоли не должно быть «[Report Only] …»).
 * Статические страницы без nonce → 'unsafe-inline' для скриптов (inline-скрипт класса js, JSON-LD, служебные скрипты Next).
 * Источники: Zeffy (форма Subscribe, iframe), GA4 / Tag Manager, Google Maps JS API, Cloudflare Turnstile.
 * Картинки Notion на сайте не подгружаются: sync:events / sync:mentors копируют их в public/images.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.zeffy.com https://www.googletagmanager.com https://maps.googleapis.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.zeffy.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.zeffy.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://maps.googleapis.com https://challenges.cloudflare.com",
  "frame-src https://*.zeffy.com https://challenges.cloudflare.com https://www.google.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // от встраивания нашего сайта в чужие страницы (наши iframe — Zeffy, Turnstile — этого не касается)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

/**
 * Языки (docs/ru-version.md): EN без префикса, RU с префиксом /ru.
 * Страницы лежат в app/[lang]; адреса без префикса внутренне отдаются как /en/…
 * Без автоопределения языка и без редиректов по языку браузера.
 */
const nextConfig: NextConfig = {
  // dev по локальной сети (телефон): иначе /_next/* с чужого адреса блокируется
  allowedDevOrigins: ["192.168.1.54"],
  experimental: {
    // 404 для корневого layout с динамическим сегментом [lang] (app/global-not-found.tsx)
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      // только globals.css: иначе загрузчик Tailwind перехватывает и *.module.css (CSS-модули перестают работать)
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    // /en/... — дубль адреса без префикса: отправляем на канонический
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path+", destination: "/:path+", permanent: true },
    ];
  },

  async rewrites() {
    return {
      // afterFiles: файлы из public и служебные маршруты (api, _next) не затрагиваются
      afterFiles: [
        { source: "/", destination: "/en" },
        // всё, что не начинается с /ru, — английская версия; /api и /og (картинки превью; динамические маршруты проверяются после afterFiles) не трогаем
        { source: "/:path((?!ru(?:/|$)|api(?:/|$)|og(?:/|$)).+)", destination: "/en/:path" },
      ],
    };
  },
};

export default nextConfig;
