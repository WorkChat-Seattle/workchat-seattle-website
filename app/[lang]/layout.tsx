import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { hasLocale, locales } from "@/i18n/config";
import "../globals.css";

// Заглушка: настоящие title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = {
  title: "WorkChat Seattle",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
