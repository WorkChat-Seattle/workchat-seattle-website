import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MentorsSection } from "@/components/mentorship/mentors-section";
import { MentorFormSection } from "@/components/mentorship/mentor-form-section";
import { MentorshipHero } from "@/components/mentorship/hero";
import { Programs } from "@/components/mentorship/programs";
import { FaqSection } from "@/components/sections/faq-section";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { mentorshipFaq } from "@/data/faq";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Заглушка: title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = { title: "Mentorship — WorkChat Seattle" };

/**
 * Mentorship (Figma: 390 `1135:11286`, 768 `1240:15215`, 1440 `1003:4997`): hero → менторы → форма «Стать ментором» → FAQ →
 * программы → подписка → «Как помочь». «Meet our mentors» — из data/mentors.ts (нет менторов — секции нет); форма — шаг 8.
 */
export default async function Page({ params }: PageProps<"/[lang]/mentorship">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <MentorshipHero t={t} />
      <MentorsSection lang={lang} t={t} />
      <MentorFormSection t={t} />
      <FaqSection t={t} prefix="mentorship.faq" ids={mentorshipFaq} />
      <Programs t={t} />
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
