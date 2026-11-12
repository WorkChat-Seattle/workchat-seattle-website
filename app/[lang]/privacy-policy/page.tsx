import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivacyPolicy } from "@/components/privacy/policy";
import { hasLocale } from "@/i18n/config";

// Privacy Policy — только на английском: /privacy-policy (en); /ru/privacy-policy не существует (404),
// русские страницы ссылаются на английский адрес (CLAUDE.md).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "en" }];
}

// Заглушка: title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = { title: "Privacy Policy — WorkChat Seattle" };

export default async function Page({ params }: PageProps<"/[lang]/privacy-policy">) {
  const { lang } = await params;
  if (!hasLocale(lang) || lang !== "en") notFound();
  return <PrivacyPolicy />;
}
