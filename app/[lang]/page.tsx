import { notFound } from "next/navigation";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { Hero } from "@/components/home/hero";
import { Community } from "@/components/home/community";
import { Numbers } from "@/components/home/numbers";
import { WhatWeDo } from "@/components/home/what-we-do";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Home: собирается по секциям (шаг 5). Готовы hero, what-we-do, numbers, community, subscribe, get-involved.
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
      <Subscribe lang={lang} t={t} />
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
