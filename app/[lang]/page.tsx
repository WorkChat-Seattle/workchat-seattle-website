import { notFound } from "next/navigation";
import { GetInvolved } from "@/components/sections/get-involved";
import { Testimonials } from "@/components/home/testimonials";
import { Subscribe } from "@/components/sections/subscribe";
import { Hero } from "@/components/home/hero";
import { Community } from "@/components/home/community";
import { FindMentor } from "@/components/home/find-mentor";
import { Numbers } from "@/components/home/numbers";
import { ResourceHub } from "@/components/home/resource-hub";
import { WhatWeDo } from "@/components/home/what-we-do";
import { SHOW_RESOURCE_HUB } from "@/lib/constants";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Home: собирается по секциям (шаг 5). Готовы hero, what-we-do, numbers, community, resource hub (скрыт флагом), find mentor, subscribe, testimonials, get-involved.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <Hero t={t} />
      <WhatWeDo lang={lang} t={t} />
      <Numbers t={t} />
      <Community t={t} />
      {SHOW_RESOURCE_HUB ? <ResourceHub t={t} /> : null}
      <FindMentor lang={lang} t={t} spaced={!SHOW_RESOURCE_HUB} />
      <Subscribe lang={lang} t={t} />
      <Testimonials t={t} />
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
