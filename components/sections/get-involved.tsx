import { ParallaxDrift } from "@/components/ui/parallax";
import Image from "next/image";
import { CardSquare } from "@/components/ui/card-square";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DONATE_URL } from "@/lib/constants";
import imgDesktop from "@/public/images/get-involved/get-involved-desktop.jpg";
import imgMobile from "@/public/images/get-involved/get-involved-mobile.jpg";
import imgTablet from "@/public/images/get-involved/get-involved-tablet.jpg";

/**
 * Get Involved (Figma: get-involved `1084:10523`; desktop `1013:1389`, tablet `1203:14182`,
 * mobile `1084:10473`). Карточки: Become a Mentor, фото, Volunteer, Donate.
 * desktop — ряд из 4 по 300, заголовок от 3-го столбца-направляющей (x=300);
 * tablet — сетка 2×2 по 344; mobile — колонка.
 * Фото декоративное (alt=""). Отступ сверху — между секциями (80 / 120 / 160); снизу на desktop 160,
 * на tablet / mobile футер встык.
 */
export function GetInvolved({ lang, t }: { lang: Locale; t: Dictionary }) {
  const photo = "relative min-h-75 overflow-hidden md:min-h-86 xl:min-h-75";
  return (
    <section
      aria-labelledby="get-involved-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:mb-40 xl:px-0"
    >
      <h2 data-reveal id="get-involved-title" className="text-h2 text-text-heading xl:pl-75">
        {t["home.getInvolved.title"]}
      </h2>
      <div data-reveal-grid className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:mt-15 xl:grid-cols-4">
        <CardSquare
          option="dark-neutral"
          title={t["home.getInvolved.mentor.title"]}
          text={t["home.getInvolved.mentor.text"]}
          linkLabel={t["home.getInvolved.mentor.button"]}
          href={`${localePath(lang, "/mentorship")}#mentor-form`}
        />
        <div className={photo}>
          {/* ≥1280: слой выше рамки на 60 px, фото едет вниз (animations.md, п. 7) */}
          <ParallaxDrift basis="screen" className="absolute inset-0 xl:-top-15">
            <Image src={imgMobile} alt="" sizes="100vw" className="object-cover md:hidden" fill />
            <Image src={imgTablet} alt="" sizes="50vw" className="hidden object-cover md:block xl:hidden" fill />
            <Image src={imgDesktop} alt="" sizes="300px" className="hidden object-cover xl:block" fill />
          </ParallaxDrift>
        </div>
        <CardSquare
          option="neutral"
          title={t["home.getInvolved.volunteer.title"]}
          text={t["home.getInvolved.volunteer.text"]}
          linkLabel={t["home.getInvolved.volunteer.button"]}
          href={localePath(lang, "/volunteer")}
        />
        <CardSquare
          option="dark-neutral"
          title={t["home.getInvolved.donate.title"]}
          text={t["home.getInvolved.donate.text"]}
          linkLabel={t["home.getInvolved.donate.button"]}
          href={DONATE_URL}
          newTabLabel={t["a11y.newTab"]}
        />
      </div>
    </section>
  );
}
