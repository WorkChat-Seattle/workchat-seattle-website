import { NumberCard } from "@/components/ui/number-card";
import { QuoteAccent } from "@/components/ui/quote-accent";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Numbers (Figma: numbers `1003:3581`; tablet `1203:14365`, mobile `1110:10649`).
 * Круг bg/card-neutral с цитатой выходит за левый край (−150 / −76 / −124): раскладка flex, лишнее
 * обрезает секция по горизонтали. Карточки 2×2: desktop 300×210 (колонки по 300, верх на 125 от
 * верха круга), tablet 172, mobile 175 под кругом. В HTML порядок: 2018, 5,800+, 50+, 10,000+;
 * на tablet карточки идут по строкам в другом порядке (2018, 50+ / 5,800+, 10,000+).
 * Параллакс колонок на desktop — на проходе анимаций (animations.md, п. 8).
 */
export function Numbers({ t }: { t: Dictionary }) {
  return (
    <section aria-label={t["home.numbers.caption"]} className="mt-5 overflow-x-clip md:mt-30 xl:mt-15">
      <div className="mx-auto flex max-w-300 flex-col px-5 md:flex-row md:items-center md:px-10 xl:items-start xl:px-0">
        <div className="order-2 mt-5 -ml-31 flex size-114.75 shrink-0 items-center rounded-full bg-bg-card-neutral pl-31 md:order-1 md:mt-0 md:-ml-19 md:mr-5 md:-my-7 md:size-100 md:pl-19 xl:mr-22.5 xl:-ml-37.5 xl:my-0 xl:size-165 xl:pl-37.5">
          <QuoteAccent className="w-79 md:w-69 xl:w-75">{t["home.numbers.caption"]}</QuoteAccent>
        </div>
        <div className="order-1 grid grid-cols-2 md:order-2 md:w-86 xl:mt-31.25 xl:w-150 xl:grid-cols-2">
          <NumberCard
            option="light"
            value={t["home.numbers.founded.value"]}
            label={t["home.numbers.founded.label"]}
          />
          <NumberCard
            option="neutral"
            value={t["home.numbers.members.value"]}
            label={t["home.numbers.members.label"]}
            className="md:order-3 xl:order-none"
          />
          <NumberCard
            option="neutral"
            value={t["home.numbers.events.value"]}
            label={t["home.numbers.events.label"]}
            className="md:order-2 xl:order-none"
          />
          <NumberCard
            option="muted"
            value={t["home.numbers.questions.value"]}
            label={t["home.numbers.questions.label"]}
            className="md:order-4 xl:order-none"
          />
        </div>
      </div>
    </section>
  );
}
