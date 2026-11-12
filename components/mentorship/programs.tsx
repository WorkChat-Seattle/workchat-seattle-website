import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/data/programs";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";

/**
 * Программы (Figma: programs `1088:1740`; tablet `1240:15266`, mobile `1135:11606`; card-program `1013:1367`).
 * Заголовок: desktop от x=300, tablet со 2-й колонки; заголовок → текст 40 / 20 / 20; до карточек 40. Карточка bg/card-neutral:
 * desktop 1200×300 (логотип 220 в белом квадрате, текст и кнопка 316, справа колонка цены 260 с линией слева),
 * tablet — логотип 172, справа тема и описание, под ними цена и кнопка 316; mobile — логотип в белой плашке 120 сверху, ниже
 * тема, описание, цена, кнопка на всю ширину. Зазор между карточками 10 / 20 / 20. Кнопки — внешние ссылки (новая вкладка).
 * Цена «Free⏎Eligibility requirements apply»: первая строка — h3, вторая — body.
 */
export function Programs({ t }: { t: Dictionary }) {
  return (
    <section
      aria-labelledby="programs-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <div className="md:pl-43 xl:pl-75">
        <h2 id="programs-title" className="text-h2 text-text-heading">
          {t["mentorship.programs.title"]}
        </h2>
        <p className="text-body mt-5 text-text-body xl:mt-10 xl:max-w-150">{t["mentorship.programs.text"]}</p>
      </div>
      <ul className="mt-10 flex flex-col gap-5 xl:gap-2.5">
        {programs.map((p) => {
          const [priceHead, ...priceRest] = t[`mentorship.programs.${p.id}.price` as TextKey].split("\n");
          return (
            <li
              key={p.id}
              className="flex flex-col gap-6 bg-bg-card-neutral p-5 md:flex-row md:items-start md:gap-10 md:p-10 xl:h-75"
            >
              <div className="flex h-30 w-full shrink-0 items-center justify-center bg-bg-card-white md:size-43 xl:size-55">
                <Image
                  src={p.logo}
                  alt={p.name}
                  unoptimized={p.logo.src.endsWith(".svg")}
                  className="h-auto w-44 md:w-38"
                />
              </div>
              <div className="relative flex min-w-0 flex-1 flex-col gap-6 xl:h-full xl:justify-between xl:pr-75">
                <div className="flex flex-col gap-5">
                  <p className="text-caption text-text-heading">{t[`mentorship.programs.${p.id}.tags` as TextKey]}</p>
                  <p className="text-body text-text-body xl:max-w-137.75">{t[`mentorship.programs.${p.id}.text` as TextKey]}</p>
                </div>
                <div className="flex flex-col justify-end xl:absolute xl:top-0 xl:right-0 xl:h-full xl:w-65 xl:border-l xl:border-border-divider xl:pl-5">
                  <p className="text-h3 text-text-body">{priceHead}</p>
                  {priceRest.length ? <p className="text-body text-text-body">{priceRest.join("\n")}</p> : null}
                </div>
                <ButtonLink option="dark" href={p.href} newTabLabel={t["a11y.newTab"]} className="w-full md:w-79">
                  {t["mentorship.programs.button"]}
                </ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
