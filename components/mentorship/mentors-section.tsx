import { MentorCard } from "@/components/mentorship/mentor-card";
import { MentorList } from "@/components/mentorship/mentor-list";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MENTORS_VISIBLE, allMentors } from "@/lib/mentors";

/**
 * «Meet our mentors» (Figma: mentors `1088:1737`; tablet `1240:15229`, mobile `1135:11337`). Заголовок h2 + текст: desktop от x=420
 * (title → text 40), tablet со 2-й колонки, mobile от края (20); до карточек 60 / 40 / 40. Отступ сверху 160 / 120 / 80.
 * Нет менторов с согласием — секции нет вообще. Карточки: фон чередуется neutral / muted.
 */
export function MentorsSection({ lang, t }: { lang: Locale; t: Dictionary }) {
  const list = allMentors();
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="mentors-title" className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0">
      <div className="mb-10 flex flex-col gap-5 md:pl-43 xl:mb-15 xl:gap-10 xl:pl-75">
        <h2 data-reveal id="mentors-title" className="text-h2 text-text-heading">
          {t["mentorship.mentors.title"]}
        </h2>
        <p data-reveal className="text-body text-text-body xl:max-w-150">{t["mentorship.mentors.text"]}</p>
      </div>
      <MentorList
        visible={MENTORS_VISIBLE}
        viewAll={t["mentorship.mentors.viewAll"]}
        showFewer={t["mentorship.mentors.showFewer"]}
        items={list.map((m, i) => ({
          key: m.slug,
          node: <MentorCard mentor={m} lang={lang} t={t} tone={i % 2 === 0 ? "neutral" : "muted"} />,
        }))}
      />
    </section>
  );
}
