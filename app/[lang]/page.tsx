import { notFound } from "next/navigation";
import { CardEvent } from "@/components/events/card-event";
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
import { featuredEvent } from "@/lib/events";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// ISR: Featured меняется, когда событие заканчивается (до часа задержки)
export const revalidate = 3600;

// Home: собирается по секциям (шаг 5). Готовы hero, what-we-do, numbers, community, resource hub (скрыт флагом), find mentor, subscribe, testimonials, get-involved.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const featured = featuredEvent();

  return (
    <>
      <Hero t={t} />
      <WhatWeDo lang={lang} t={t} />
      <Numbers t={t} />
      <Community t={t} />
      {featured ? (
        // Featured (Figma: featured-event `1110:10681` / `1203:14397` / `1047:6842`): ближайшее предстоящее; нет — блока нет
        <section
          aria-label={t["home.featured.label"]}
          className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
        >
          <CardEvent event={featured} lang={lang} t={t} featured />
        </section>
      ) : null}
      {SHOW_RESOURCE_HUB ? <ResourceHub t={t} /> : null}
      <FindMentor lang={lang} t={t} spaced={!SHOW_RESOURCE_HUB} />
      <Subscribe lang={lang} t={t} />
      <Testimonials t={t} />
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
