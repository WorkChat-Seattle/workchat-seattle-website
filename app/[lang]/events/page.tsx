import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PastEvents, type PastEventView } from "@/components/events/past-events";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { hasLocale, locales, localePath } from "@/i18n/config";
import { getDictionary, type TextKey } from "@/i18n/dictionaries";
import { TAG_ORDER, eventShort, eventTitle, formatDate, locationLabel, pastEvents, upcomingEvents } from "@/lib/events";

// ISR: событие переезжает из Upcoming в Past с задержкой до часа (docs/dynamic-content.md)
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Заглушка: title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = { title: "Events — WorkChat Seattle" };

/**
 * Events (Figma: 390 `1145:12534`, 768 `1240:16472`, 1440 `1003:4174`; нет предстоящих — `1582:26100` / `1582:26137` / `1582:24736`):
 * Upcoming → Past (с фильтром по тегам) → подписка → «Как помочь». Окно «Suggest an event» — шаг 8.
 */
export default async function Page({ params }: PageProps<"/[lang]/events">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  const now = new Date();
  const upcoming = upcomingEvents(now);
  const past = pastEvents(now);

  const label = (tag: string) => t[`tag.${tag}` as TextKey] ?? tag;
  const views: PastEventView[] = past.map((e) => ({
    slug: e.slug,
    href: localePath(lang, `/events/${e.slug}`),
    title: eventTitle(e, lang),
    short: eventShort(e, lang),
    date: formatDate(e.start, lang),
    place: locationLabel(e, t["format.Online"]),
    cover: e.cover,
    recording: e.recordingLink,
    tags: e.tags.map((id) => ({ id, label: label(id) })),
  }));
  // в фильтре — только теги, которые есть у прошедших событий (пустых фильтров не показываем)
  const used = [...new Set(past.flatMap((e) => e.tags))].sort((a, b) => {
    const ia = TAG_ORDER.indexOf(a);
    const ib = TAG_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <>
      <UpcomingEvents events={upcoming} lang={lang} t={t} />
      {past.length ? (
        <section aria-labelledby="past-title" className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0">
          <h2 data-reveal id="past-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
            {t["events.past.title"]}
          </h2>
          <PastEvents
            events={views}
            tags={used.map((id) => ({ id, label: label(id) }))}
            titleId="past-title"
            texts={{
              details: t["btn.details"],
              video: t["btn.videoRecording"],
              showMore: t["btn.showMore"],
              newTab: t["a11y.newTab"],
            }}
          />
        </section>
      ) : null}
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
