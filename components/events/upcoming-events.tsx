import { CardEvent } from "@/components/events/card-event";
import { SuggestEvent } from "@/components/forms/suggest-event";
import { formLabels } from "@/components/forms/labels";
import type { EventItem } from "@/data/events";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SHOW_SUGGEST_EVENT } from "@/lib/constants";
import { autoLink } from "@/lib/rich";

/**
 * Upcoming Events (Figma: upcoming-events `1088:1729`; tablet `1240:16475`, mobile `1145:12558`; пустое — `1582:24736`,
 * `1582:26137`, `1582:26100`). Заголовок — h1 стиля h2, со 2-й колонки (desktop x=300, tablet 172). Дальше карточки
 * предстоящих событий (между ними 10 / 20 / 20) или, если их нет, блок empty-state: lead (h3) и текст — на desktop колонка 600
 * от x=300, между ними 40 (tablet / mobile — 20). Кнопка «Suggest an event» — по центру; открывает окно с формой (components/forms/suggest-event.tsx).
 */
export function UpcomingEvents({ events, lang, t }: { events: EventItem[]; lang: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="upcoming-title" className="mx-auto mt-10 max-w-300 px-5 md:mt-15 md:px-10 xl:px-0">
      <h1 data-reveal="now" id="upcoming-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
        {t["events.upcoming.title"]}
      </h1>
      {events.length ? (
        <ul data-reveal-grid className="mt-10 flex flex-col gap-5 xl:gap-2.5">
          {events.map((e, i) => (
            <li key={e.slug}>
              <CardEvent event={e} lang={lang} t={t} priority={i === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col gap-5 md:pl-43 xl:max-w-225 xl:pl-75">
          <p data-reveal="now" className="text-h3 text-text-heading">{t["events.empty.lead"]}</p>
          <p data-reveal="now" className="text-body whitespace-pre-line text-text-body">{autoLink(t["events.empty.text"], "underline xl:no-underline xl:text-link", t["a11y.newTab"])}</p>
        </div>
      )}
      {SHOW_SUGGEST_EVENT ? (
        <div data-reveal className="mt-10 flex justify-center">
          <SuggestEvent lang={lang} labels={formLabels(t)} buttonClassName="w-full md:w-fit xl:w-75" />
        </div>
      ) : null}
    </section>
  );
}
