import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import desktop from "@/public/images/mentorship/mentorship-hero-desktop.jpg";
import mobile from "@/public/images/mentorship/mentorship-hero-mobile.jpg";
import tablet from "@/public/images/mentorship/mentorship-hero-tablet.jpg";

const goals = ["usCareer", "jobSearch", "newDirection", "grow"] as const;

/**
 * Hero Mentorship (Figma: hero `1088:1735`; tablet `1240:15218`, mobile `1135:11310`).
 * Заголовок h1 (стиль h2, две строки) и два абзаца: desktop от x=300 (заголовок 750, текст 600), tablet со 2-й колонки,
 * mobile от края; заголовок → текст 40 / 20 / 20. Ниже — выгоды: desktop — фото 600 слева и карточка bg/card-muted 600
 * со списком справа (список 520 с отступом 40, по центру по высоте); tablet — фото 688×460 и под ним карточка со списком
 * (отступы 40); mobile — фото 350×350 и карточка (отступы 20 / 40). Пункты списка: заголовок h3 + текст, линия между пунктами.
 * Сверху после шапки 60 / 60 / 40, текст → выгоды 60 / 40 / 40.
 */
export function MentorshipHero({ t }: { t: Dictionary }) {
  return (
    <section className="mx-auto mt-10 max-w-300 px-5 md:mt-15 md:px-10 xl:px-0">
      <div className="md:pl-43 xl:pl-75">
        <h1 data-reveal="now" className="text-h2 whitespace-pre-line text-text-heading xl:max-w-187.5">{t["mentorship.hero.title"]}</h1>
        <p data-reveal="now" className="text-body mt-5 whitespace-pre-line text-text-body xl:mt-10 xl:max-w-150">
          {t["mentorship.hero.text"]}
        </p>
      </div>
      <div className="mt-10 flex flex-col xl:mt-15 xl:flex-row">
        <div data-reveal="now" className="relative aspect-square md:aspect-auto md:h-115 xl:h-150 xl:w-150 xl:shrink-0">
          <ResponsiveImage mobile={mobile} tablet={tablet} desktop={desktop} sizes="(min-width: 1280px) 600px, 100vw" />
        </div>
        <ul data-reveal="now" className="flex flex-col gap-5 bg-bg-card-muted px-5 py-10 md:p-10 xl:h-150 xl:w-150 xl:justify-center xl:py-0 xl:pl-10">
          {goals.map((g, i) => (
            <li
              key={g}
              className={`flex flex-col gap-5 ${i < goals.length - 1 ? "border-b border-border-divider pb-5" : ""} xl:max-w-130`}
            >
              <h2 className="text-h3 text-text-heading">{t[`mentorship.goals.${g}.title` as TextKey]}</h2>
              <p className="text-body text-text-body">{t[`mentorship.goals.${g}.text` as TextKey]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
