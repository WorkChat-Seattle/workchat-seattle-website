import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivacyPolicy } from "@/components/privacy/policy";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

// Privacy Policy — только на английском: /privacy-policy (en); /ru/privacy-policy не существует (404),
// русские страницы ссылаются на английский адрес (CLAUDE.md).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "en" }];
}

// В вкладке SEO таблицы для Privacy Policy строк нет: title — «Privacy Policy» (footer.privacy) + название сайта, описания нет (открытый вопрос).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary("en");
  return pageMetadata({ lang: "en", t, path: "/privacy-policy", title: `${t["footer.privacy"]} — ${SITE_NAME}`, onlyEn: true });
}

export default async function Page({ params }: PageProps<"/[lang]/privacy-policy">) {
  const { lang } = await params;
  if (!hasLocale(lang) || lang !== "en") notFound();
  return <PrivacyPolicy />;
}
