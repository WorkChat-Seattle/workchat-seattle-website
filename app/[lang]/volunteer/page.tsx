import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formLabels } from "@/components/forms/labels";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { VolunteerFormSection } from "@/components/volunteer/volunteer-form-section";
import { VolunteerHero } from "@/components/volunteer/hero";
import { VolunteerRoles } from "@/components/volunteer/roles";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Заглушка: title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = { title: "Volunteer — WorkChat Seattle" };

/** Volunteer (Figma: 390 `1145:11767`, 768 `1240:15704`, 1440 `1003:4794`): hero → роли → форма → подписка → «Как помочь». Форма — `components/forms/volunteer-form.tsx`. */
export default async function Page({ params }: PageProps<"/[lang]/volunteer">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <VolunteerHero t={t} />
      <VolunteerRoles t={t} />
      <VolunteerFormSection t={t}>
        <VolunteerForm lang={lang} labels={formLabels(t)} />
      </VolunteerFormSection>
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
