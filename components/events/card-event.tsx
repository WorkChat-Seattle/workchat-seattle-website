import { ParallaxDrift } from "@/components/ui/parallax";
import { EventDetail } from "@/components/events/event-detail";
import { EventImage } from "@/components/events/event-image";
import { ButtonLink } from "@/components/ui/button";
import type { EventItem } from "@/data/events";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { eventShort, eventTitle, formatDate, locationLabel } from "@/lib/events";

/**
 * Карточка предстоящего события на Events (Figma: card-event `1145:12510`; 1440 `1552:18745`, 768 `1552:18715`, 390 `1552:18685`)
 * и Featured на Home (card-featured-event `1084:10416`, тот же вид + метка и вторая кнопка).
 * desktop — текст слева (отступы 80/40), фото 600 справа; tablet / mobile — фото сверху (400 / 270), под ним текст
 * с отступами 40 / 20. Название — h2 стиля event-title (Title Case в EN), описание, дата и место (на mobile друг под другом),
 * кнопка Details → /events/[slug]. `featured` добавляет метку и «See all events».
 */
export function CardEvent({
  event,
  lang,
  t,
  featured = false,
  priority = false,
}: {
  event: EventItem;
  lang: Locale;
  t: Dictionary;
  featured?: boolean;
  priority?: boolean;
}) {
  const href = localePath(lang, `/events/${event.slug}`);
  return (
    <article className="flex flex-col bg-bg-card-neutral xl:min-h-139 xl:flex-row">
      <div className="relative order-first h-67.5 shrink-0 overflow-hidden md:h-100 xl:order-last xl:h-auto xl:w-150">
        {featured ? (
          // Featured на Home: фото едет вниз внутри рамки на 60 px (animations.md, п. 7), слой выше рамки на 60 px (≥1280)
          <ParallaxDrift basis="screen" className="absolute inset-0 xl:-top-15">
            <EventImage src={event.cover} sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 350px" priority={priority} />
          </ParallaxDrift>
        ) : (
          <EventImage src={event.cover} sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 350px" priority={priority} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-10 p-5 md:p-10 xl:py-20 xl:pr-10 xl:pl-20">
        <div className="flex flex-col gap-5">
          {featured ? <p className="text-caption text-text-body">{t["home.featured.label"]}</p> : null}
          <h2 className="text-event-title text-text-heading xl:max-w-118.25">{eventTitle(event, lang)}</h2>
          <p className="text-body text-text-body xl:max-w-93.5">{eventShort(event, lang)}</p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-5 xl:flex-1">
          <EventDetail type="date">{formatDate(event.start, lang)}</EventDetail>
          <EventDetail type="location">{locationLabel(event, t["format.Online"])}</EventDetail>
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row">
          <ButtonLink option="dark" href={href} className={featured ? "w-full md:w-fit" : "w-full md:w-55"}>
            {t[featured ? "home.featured.details" : "btn.details"]}
          </ButtonLink>
          {featured ? (
            <ButtonLink option="outlined" href={localePath(lang, "/events")} className="w-full md:w-fit">
              {t["home.featured.allEvents"]}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
