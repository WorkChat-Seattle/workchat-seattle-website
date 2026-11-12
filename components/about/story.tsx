import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Our Story (Figma: story `1088:1726`; tablet `1240:14915`, mobile `1113:11058`).
 * Колонка 600 от x=300 (desktop), 516 со 2-й колонки (tablet), на всю ширину (mobile). Заголовок h2 → lead (h3) →
 * основной текст через 20 (на desktop между заголовком и lead 40). Абзацы основного текста — по пустой строке.
 * Отступ сверху 160 / 120 / 80.
 */
export function Story({ t }: { t: Dictionary }) {
  return (
    <section
      aria-labelledby="story-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <div className="md:pl-43 xl:pl-75">
        <div className="flex flex-col gap-5 xl:max-w-150">
          <h2 id="story-title" className="text-h2 text-text-heading">
            {t["about.story.title"]}
          </h2>
          <p className="text-h3 text-text-heading xl:mt-5">{t["about.story.lead"]}</p>
          <p className="text-body whitespace-pre-line text-text-body">{t["about.story.text"]}</p>
        </div>
      </div>
    </section>
  );
}
