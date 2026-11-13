import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Hero Volunteer (Figma: hero `1088:1732`; tablet `1240:15707`, mobile `1145:11791`).
 * Заголовок h1 (стиль h2) → lead (h3) → текст: desktop от x=300 (колонка 600), tablet со 2-й колонки, mobile от края.
 * Заголовок → lead 40 / 20 / 20, lead → текст 20. Сверху после шапки 60 / 60 / 40.
 */
export function VolunteerHero({ t }: { t: Dictionary }) {
  return (
    <section className="mx-auto mt-10 max-w-300 px-5 md:mt-15 md:px-10 xl:px-0">
      <div className="md:pl-43 xl:pl-75">
        <div className="flex flex-col gap-5 xl:max-w-150">
          <h1 data-reveal="now" className="text-h2 text-text-heading xl:mb-5">{t["volunteer.hero.title"]}</h1>
          <p data-reveal="now" className="text-h3 text-text-heading">{t["volunteer.hero.lead"]}</p>
          {/* два абзаца в ячейке таблицы разделены переводом строки: показываем отдельными <p> с отступом 20 */}
          <div data-reveal="now" className="text-body flex flex-col gap-5 text-text-body">
            {t["volunteer.hero.text"].split(/\n+/).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
