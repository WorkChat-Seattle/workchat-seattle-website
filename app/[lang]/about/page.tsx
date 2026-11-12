import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutFaq } from "@/components/about/faq";
import { AboutHero } from "@/components/about/hero";
import { Story } from "@/components/about/story";
import { Team } from "@/components/about/team";
import { Values } from "@/components/about/values";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { team } from "@/data/team";
import { values } from "@/data/values";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary, type TextKey } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Заглушка: title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = { title: "About Us — WorkChat Seattle" };

/** About (Figma: 390 `1113:11016`, 768 `1240:14904`, 1440 `1003:3944`): миссия → ценности → история → команда → FAQ → подписка → «Как помочь». */
export default async function Page({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <AboutHero t={t} />
      <div className="xl:mt-40">
        <Values
          title={t["about.values.title"]}
          items={values.map((v) => ({
            ...v,
            title: t[`about.values.${v.id}.title` as TextKey],
            text: t[`about.values.${v.id}.text` as TextKey],
          }))}
        />
      </div>
      <Story t={t} />
      <Team
        title={t["about.team.title"]}
        quote={t["about.team.text"]}
        members={team.map((m) => ({
          ...m,
          name: t[`about.team.${m.id}.name` as TextKey],
          role: t[`about.team.${m.id}.role` as TextKey],
          bio: t[`about.team.${m.id}.bio` as TextKey],
        }))}
      />
      <AboutFaq t={t} />
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
