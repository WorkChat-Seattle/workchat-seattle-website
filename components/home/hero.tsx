import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { Dictionary } from "@/i18n/dictionaries";
import desktop from "@/public/images/home/hero-desktop.jpg";
import mobile from "@/public/images/home/hero-mobile.jpg";
import tablet from "@/public/images/home/hero-tablet.jpg";

/**
 * Hero (Figma: hero `1003:3576`; tablet `1203:14325`, mobile `1110:10611`).
 * Заголовок h1 (стиль h1) и текст: desktop от 3-го столбца (x=300), tablet — со 2-й колонки (172),
 * mobile от края. Заголовок → текст 40 / 20 / 20, текст → фото 60 / 60 / 40.
 * Фото на всю ширину: 650 / 440 / 540 высотой (на desktop отражено, отражение уже в файле).
 */
export function Hero({ t }: { t: Dictionary }) {
  return (
    <section className="pt-10 md:pt-15">
      <div className="mx-auto max-w-300 px-5 md:px-10 xl:px-0">
        <div className="flex flex-col gap-5 md:pl-43 xl:gap-10 xl:pl-75">
          <h1 data-reveal="now" className="text-h1 whitespace-pre-line text-text-heading">{t["home.hero.title"]}</h1>
          <p data-reveal="now" className="text-body max-w-142.25 text-balance text-text-body">{t["home.hero.text"]}</p>
        </div>
      </div>
      <div data-reveal="now" className="relative mt-10 h-135 md:mt-15 md:h-110 xl:h-162.5">
        <ResponsiveImage mobile={mobile} tablet={tablet} desktop={desktop} priority />
      </div>
    </section>
  );
}
