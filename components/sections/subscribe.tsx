import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { PRIVACY_LINK_TEXT, PRIVACY_PATH } from "@/lib/constants";
import { linkPhrase } from "@/lib/rich";
import bgDesktop from "@/public/images/subscribe/subscribe-bg-desktop.jpg";
import bgMobile from "@/public/images/subscribe/subscribe-bg-mobile.jpg";
import bgTablet from "@/public/images/subscribe/subscribe-bg-tablet.jpg";
import { ZeffyEmbed } from "./zeffy-embed";

/**
 * Subscribe (Figma: subscribe `1084:10472`, state=default; sending / success / error устарели).
 * Фон — фото на всю ширину под размытием (22) и подложкой overlay/blur-light; поверх стеклянная
 * карточка (bg/glass, размытие 47): desktop 1200, padding 150 / 80; tablet 688, padding 60 / 40;
 * mobile на всю ширину, padding 40 / 20. Текст — наш, форма — iframe Zeffy, подпись под формой —
 * наша, «Privacy Policy» — ссылка на английскую страницу.
 */
export function Subscribe({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="subscribe-title" className="relative isolate overflow-hidden py-20 xl:py-30">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={bgMobile} alt="" sizes="100vw" fill className="object-cover md:hidden" />
        <Image src={bgTablet} alt="" sizes="100vw" fill className="hidden object-cover md:block xl:hidden" />
        <Image src={bgDesktop} alt="" sizes="100vw" fill className="hidden object-cover xl:block" />
        <div className="absolute inset-0 bg-overlay-blur-light backdrop-blur-subscribe-bg" />
      </div>

      <div className="mx-auto md:mx-10 xl:mx-auto xl:max-w-300">
        <div data-reveal className="flex flex-col gap-5 bg-bg-glass py-10 backdrop-blur-subscribe-card md:gap-10 md:py-15 xl:px-37.5 xl:py-20">
          <div className="flex flex-col gap-5 px-5 md:px-10 xl:pl-37.5">
            <h2 data-reveal id="subscribe-title" className="text-h2 text-text-heading">
              {t["home.subscribe.title"]}
            </h2>
            <p data-reveal className="text-body text-text-body xl:max-w-150">{t["home.subscribe.text"]}</p>
          </div>
          <div data-reveal className="flex flex-col gap-3">
            <ZeffyEmbed />
            <p className="text-body px-5 text-text-muted md:px-10 xl:max-w-150 xl:pl-37.5">
              {linkPhrase(t["home.subscribe.note"], PRIVACY_LINK_TEXT[lang], (phrase) => (
                <Link href={PRIVACY_PATH} className="underline xl:no-underline xl:text-link">
                  {phrase}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
