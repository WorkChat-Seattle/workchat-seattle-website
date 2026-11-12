import { CardRectangle } from "@/components/ui/card-rectangle";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import { resourceCards } from "@/data/resources";
import business from "@/public/images/home/resource-hub-business.jpg";

/**
 * Resource Hub (Figma: resource-hub `1003:3521`; tablet `1203:14421`, mobile `1110:10705`).
 * Заголовок: desktop от x=300, tablet со 2-й колонки (172), mobile от края; до карточек 60 / 40 / 40.
 * Сетка карточек: 2×2 по 600×400 на desktop, по 344×380 на tablet, колонка 350×410 на mobile.
 */
export function ResourceHub({ t }: { t: Dictionary }) {
  return (
    <section
      aria-labelledby="resource-hub-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <h2 id="resource-hub-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
        {t["home.resources.title"]}
      </h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:mt-15">
        {resourceCards.map((card) => (
          <CardRectangle
            key={card.id}
            option={card.option}
            title={t[`home.resources.${card.id}.title` as TextKey]}
            text={t[`home.resources.${card.id}.text` as TextKey]}
            linkLabel={t[`home.resources.${card.id}.button` as TextKey]}
            href={card.href || undefined}
            image={card.option === "image" ? business : undefined}
          />
        ))}
      </div>
    </section>
  );
}
