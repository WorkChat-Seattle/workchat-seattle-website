import { ButtonLink } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import desktop from "@/public/images/not-found/coffee-desktop.jpg";
import mobile from "@/public/images/not-found/coffee-mobile.jpg";
import tablet from "@/public/images/not-found/coffee-tablet.jpg";

/**
 * Блок 404 (Figma: not-found; кадры `1454:22166` desktop, `1454:22422` tablet, `1454:22443` mobile).
 * Собран как card-featured-event, без скруглений:
 *  - desktop: 1200×600 по центру, слева карточка 600 (отступы 80, текст по центру по вертикали),
 *    справа фото 600×600; сверху 60 после шапки, снизу 160;
 *  - tablet: карточка 688, сверху фото 688×460, ниже текст с отступами 40; сверху 60, снизу 120;
 *  - mobile: сверху фото 350×350, ниже текст с отступами 20, кнопка на всю ширину; сверху 40, снизу 80.
 * Внутри текста: метка → заголовок → описание через 20, описание → кнопка 40. Заголовок — h1 в стиле h2.
 * Фото декоративное (alt=""), кнопка — ссылка на главную на нужном языке.
 */
export function NotFoundBlock({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="mx-auto mt-10 mb-20 max-w-300 px-5 md:mt-15 md:mb-30 md:px-10 xl:mb-40 xl:px-0">
      <div className="flex flex-col xl:grid xl:min-h-150 xl:grid-cols-2">
        <div className="relative order-1 aspect-square md:aspect-auto md:h-115 xl:order-2 xl:h-auto">
          <ResponsiveImage
            mobile={mobile}
            tablet={tablet}
            desktop={desktop}
            priority
            sizes="(min-width: 1280px) 600px, 100vw"
          />
        </div>
        <div className="order-2 flex flex-col justify-center bg-bg-card-neutral p-5 md:p-10 xl:order-1 xl:p-20">
          <p className="text-caption text-text-body">{t["notFound.label"]}</p>
          <h1 className="text-h2 mt-5 text-text-heading">{t["notFound.title"]}</h1>
          <p className="text-body mt-5 whitespace-pre-line text-text-body">{t["notFound.text"]}</p>
          <ButtonLink option="dark" href={localePath(lang, "/")} className="mt-10 w-full md:w-fit">
            {t["btn.backHome"]}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
