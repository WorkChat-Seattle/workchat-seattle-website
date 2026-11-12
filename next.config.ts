import type { NextConfig } from "next";

/**
 * Языки (docs/ru-version.md): EN без префикса, RU с префиксом /ru.
 * Страницы лежат в app/[lang]; адреса без префикса внутренне отдаются как /en/…
 * Без автоопределения языка и без редиректов по языку браузера.
 */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // только globals.css: иначе загрузчик Tailwind перехватывает и *.module.css (CSS-модули перестают работать)
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
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
        // всё, что не начинается с /ru, — английская версия
        { source: "/:path((?!ru(?:/|$)).+)", destination: "/en/:path" },
      ],
    };
  },
};

export default nextConfig;
