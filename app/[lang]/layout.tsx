import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { organizationGraph } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

// metadataBase — адрес сайта для всех абсолютных ссылок в метаданных; title / description / превью — у каждой страницы (lib/seo.ts)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

const JS_FLAG =
  "var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-hydrated'))d.classList.remove('js')},3000)}";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    // Подстраховка: если за 3 с гидрация не случилась (JS не загрузился или упал), класс js снимается — контент не остаётся скрытым (RevealController ставит data-hydrated).
    // suppressHydrationWarning: скрипт в начале <body> до отрисовки ставит класс `js` (animations.md, общие правила)
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <body>
        {/* Скрытие до появления включается только с JS и без prefers-reduced-motion. Скрипт — первым в <body>: браузер
            выполняет его при разборе серверного HTML до отрисовки содержимого (без мигания). Через innerHTML, а не <script>
            в JSX: React 19 на клиенте <script> не выполняет и пишет ошибку в консоль (при переключении EN / RU
            корневой layout рисуется заново на клиенте; класс `js` там возвращает RevealController). */}
        <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `<script>${JS_FLAG}</script>` }} />
        <JsonLd data={organizationGraph(t)} />
        <SiteChrome lang={lang} t={t}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
