import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDescription } from "@/components/events/event-description";
import { EventDetail } from "@/components/events/event-detail";
import { EventMap } from "@/components/events/event-map";
import { EventImage } from "@/components/events/event-image";
import { RegisterButton } from "@/components/events/register-button";
import { ShareButton } from "@/components/events/share-button";
import { SpeakerCard } from "@/components/events/speaker-card";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { ButtonLink } from "@/components/ui/button";
import { events } from "@/data/events";
import { eventMapImage } from "@/lib/event-maps";
import { hasLocale, locales, localePath } from "@/i18n/config";
import { getDictionary, type TextKey } from "@/i18n/dictionaries";
import {
  eventDescription,
  eventEnd,
  eventShort,
  eventTitle,
  formatDate,
  formatTime,
  getEvent,
  isPast,
  locationLabel,
} from "@/lib/events";

// ISR: кнопки регистрации у только что закончившегося события обновит клиентский компонент, страницу — раз в час
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.flatMap((lang) => events.map((e) => ({ lang, slug: e.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/events/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const event = getEvent(slug);
  if (!hasLocale(lang) || !event) return {};
  // Заглушка: настоящие title / description / превью — шаг 10.
  return { title: `${eventTitle(event, lang)} — WorkChat Seattle`, description: eventShort(event, lang) };
}

/**
 * Страница события (Figma: How AI… — 390 `1145:12238`, 768 `1240:16177`, 1440 `1003:5145`; остальные — docs/event-pages-sizes.md).
 * Карточка bg/card-neutral: фото → название, кнопки и детали → Details → Speakers → Location → кнопки → «Back to all events».
 * Онлайн-событие — без Location, без спикеров (только с Consent received, их фильтрует sync) — без Speakers.
 * Location: адрес, ссылка «Открыть в Google Maps» и карта (`EventMap`: интерактивная Google Maps или статичная картинка + «Show map»).
 */
export default async function Page({ params }: PageProps<"/[lang]/events/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const event = getEvent(slug);
  if (!event) notFound();
  const t = await getDictionary(lang);

  const closed = isPast(event);
  const title = eventTitle(event, lang);
  const hasPlace = event.format !== "Online" && Boolean(event.placeName || event.address);
  const register = {
    href: event.registrationLink,
    endTime: eventEnd(event).toISOString(),
    initialClosed: closed,
    texts: { register: t["btn.register"], closed: t["btn.registrationClosed"], newTab: t["a11y.newTab"] },
  };
  const share = { title, texts: { share: t["eventPage.share"], copied: t["eventPage.shareCopied"] } };
  const language = t[`language.${event.language}` as TextKey] ?? event.language;
  const sectionTitle = "text-h3 text-text-heading";

  return (
    <>
      <article className="mt-10 md:mt-15 md:px-10 xl:mx-auto xl:max-w-300 xl:px-0">
        <div data-reveal="now" className="flex flex-col gap-10 bg-bg-card-neutral px-5 py-10 md:p-10 xl:gap-15 xl:px-10 xl:py-20">
          <div className="flex flex-col gap-5 md:flex-row md:gap-10">
            <div className="relative aspect-square w-full shrink-0 md:size-66 xl:size-55">
              <EventImage src={event.cover} sizes="(min-width: 1280px) 220px, (min-width: 768px) 264px, 350px" priority />
            </div>
            <div className="flex flex-col md:flex-1 xl:flex-row xl:gap-10">
              {/* ниже xl обёртка «contents»: название, детали и кнопки идут одной колонкой в порядке order */}
              <div className="contents xl:flex xl:min-h-55 xl:w-140 xl:shrink-0 xl:flex-col xl:justify-between">
                <h1 className="order-1 text-event-title text-text-heading">{title}</h1>
                <div className="order-3 mt-10 flex flex-col gap-2.5 xl:mt-0 xl:flex-row xl:flex-wrap">
                  <RegisterButton {...register} className="w-full xl:w-auto" />
                  <ShareButton {...share} className="w-full xl:w-auto" />
                  {event.recordingLink ? (
                    <ButtonLink
                      option="outlined"
                      href={event.recordingLink}
                      newTabLabel={t["a11y.newTab"]}
                      className="w-full xl:w-auto"
                    >
                      {t["btn.videoRecording"]}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
              <div className="order-2 mt-5 flex flex-col gap-5 xl:mt-0">
                <EventDetail type="date">{formatDate(event.start, lang)}</EventDetail>
                <EventDetail type="time">{formatTime(event.start, event.end, lang)}</EventDetail>
                <EventDetail type="location">{locationLabel(event, t["format.Online"])}</EventDetail>
                <EventDetail type="language">{language}</EventDetail>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 xl:gap-15 xl:pl-65">
            <section aria-labelledby="event-details" className="xl:max-w-150">
              <h2 data-reveal id="event-details" className={sectionTitle}>
                {t["eventPage.details"]}
              </h2>
              <div data-reveal className="mt-5 xl:mt-10">
                <EventDescription blocks={eventDescription(event, lang)} />
              </div>
            </section>

            {event.speakers.length ? (
              <section aria-labelledby="event-speakers" className="xl:max-w-150">
                <h2 data-reveal id="event-speakers" className={sectionTitle}>
                  {t["eventPage.speakers"]}
                </h2>
                <ul data-reveal-grid className="mt-5 flex flex-col gap-5 xl:mt-10 xl:gap-2.5">
                  {event.speakers.map((s) => (
                    <SpeakerCard key={s.id} speaker={s} lang={lang} t={t} />
                  ))}
                </ul>
              </section>
            ) : null}

            {hasPlace ? (
              <section aria-labelledby="event-location" className="xl:max-w-150">
                <h2 data-reveal id="event-location" className={sectionTitle}>
                  {t["eventPage.location"]}
                </h2>
                <div data-reveal className="mt-5 flex flex-col gap-5 md:flex-row md:gap-10 xl:mt-10 xl:gap-0">
                  <div className="flex flex-col gap-5 md:w-66 xl:w-75">
                    {event.placeName ? <p className="text-feature text-text-body">{event.placeName}</p> : null}
                    {event.address ? <p className="text-body whitespace-pre-line text-text-body">{event.address}</p> : null}
                    {event.mapsLink ? (
                      <a
                        href={event.mapsLink}
                        className="text-body w-fit text-text-body underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t["eventPage.openMap"]}
                        <span className="sr-only"> {t["a11y.newTab"]}</span>
                      </a>
                    ) : null}
                  </div>
                  {event.address ? (
                    <EventMap
                      image={eventMapImage(event.placeName)}
                      address={event.address}
                      name={event.placeName ?? event.address}
                      lang={lang}
                      labels={{ text: t["map.consent.text"], button: t["map.consent.button"] }}
                    />
                  ) : null}
                </div>
              </section>
            ) : null}

            <div data-reveal className="flex flex-col gap-2.5 md:flex-row md:gap-10 xl:gap-2.5">
              <RegisterButton {...register} className="w-full md:w-66 xl:w-72.5" />
              <ShareButton {...share} className="w-full md:w-76 xl:w-75" />
            </div>
          </div>
        </div>
      </article>
      <div data-reveal className="mt-10 flex justify-center px-5 md:px-10 xl:mt-20">
        <ButtonLink option="dark" href={localePath(lang, "/events")} className="w-full md:w-45 xl:w-75">
          {t["eventPage.back"]}
        </ButtonLink>
      </div>
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
