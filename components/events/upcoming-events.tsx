import { CardEvent } from "@/components/events/card-event";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/data/events";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SHOW_SUGGEST_EVENT } from "@/lib/constants";

/**
 * Upcoming Events (Figma: upcoming-events `1088:1729`; tablet `1240:16475`, mobile `1145:12558`; пустое — `1582:24736`,
 * `1582:26137`, `1582:26100`). Заголовок — h1 стиля h2, со 2-й колонки (desktop x=300, tablet 172). Дальше карточки
 * предстоящих событий (между ними 10 / 20 / 20) или, если их нет, блок empty-state: lead (h3) и текст — на desktop колонка 600
 * от x=300, между ними 40 (tablet / mobile — 20). Кнопка «Suggest an event» — по центру; пока окна формы нет, скрыта флагом.
 */
export function UpcomingEvents({ events, lang, t }: { events: EventItem[]; lang: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="upcoming-title" className="mx-auto mt-10 max-w-300 px-5 md:mt-15 md:px-10 xl:px-0">
      <h1 id="upcoming-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
        {t["events.upcoming.title"]}
      </h1>
      {events.length ? (
        <ul className="mt-10 flex flex-col gap-5 xl:gap-2.5">
          {events.map((e, i) => (
            <li key={e.slug}>
              <CardEvent event={e} lang={lang} t={t} priority={i === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col gap-5 md:pl-43 xl:max-w-150 xl:gap-10 xl:pl-75">
          <p className="text-h3 text-text-heading">{t["events.empty.lead"]}</p>
          <p className="text-body text-text-body">{t["events.empty.text"]}</p>
        </div>
      )}
      {SHOW_SUGGEST_EVENT ? (
        <div className="mt-10 flex justify-center">
          <Button option="dark" className="w-full md:w-fit xl:w-75">
            {t["btn.suggestEvent"]}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
