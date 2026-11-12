import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ButtonSocial } from "@/components/ui/button-social";
import { Logo } from "@/components/ui/logo";
import { MenuAction, MenuButton } from "@/components/ui/menu-button";
import { type Locale, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DONATE_URL, SITE_NAME, FACEBOOK_URL, LINKEDIN_URL, PRIVACY_PATH } from "@/lib/constants";
import photoDesktop from "@/public/images/footer/footer-photo-desktop.jpg";
import photoMobile from "@/public/images/footer/footer-photo-mobile.jpg";
import photoTablet from "@/public/images/footer/footer-photo-tablet.jpg";
import hug from "@/public/images/footer/footer-hug.svg";

/**
 * Футер (Figma: footer `1110:10554`; desktop `1048:1461`, tablet `1203:14232`, mobile `1110:10528`).
 * - desktop: фон на всю ширину, контейнер 1200: фото 300×427 (на 40 выше фона), отступ 80, три колонки
 *   (legal 231, nav 161, actions 150) через 139;
 * - tablet: 4 колонки по 172 (legal — две), фото 768×320 под текстом;
 * - mobile: legal, ниже nav слева и actions справа (по низу), фото 390×320 под текстом.
 * «Cookie Settings» — кнопка, откроет окно настроек на шаге 9.
 */
export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className="pt-10 md:pt-0 xl:pt-10">
      <div className="bg-bg-card-neutral">
        <div className="mx-auto max-w-300 xl:flex xl:gap-20">
          <div className="hidden xl:-mt-10 xl:block xl:h-106.75 xl:w-75 xl:shrink-0">
            <Image
              src={photoDesktop}
              alt=""
              sizes="300px"
              className="size-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-y-10 px-5 py-10 md:grid-cols-4 md:gap-y-0 md:px-10 md:pt-10 md:pb-20 xl:flex xl:gap-x-34.75 xl:self-start xl:p-0 xl:pt-20">
            <div className="col-span-2 flex flex-col gap-5 xl:w-57.75">
              <Link href={localePath(lang, "/")} aria-label={SITE_NAME} className="self-start">
                <Logo title={SITE_NAME} />
              </Link>
              <p className="text-body-bold-accent whitespace-pre-line text-text-heading">
                {t["footer.tagline"]}
              </p>
              <p className="text-body whitespace-pre-line text-text-body">{t["footer.legal"]}</p>
              <p className="text-body whitespace-pre-line text-text-body">{t["footer.copyright"]}</p>
            </div>

            <div className="flex flex-col justify-between gap-10 md:gap-5 xl:w-40.25">
              <nav aria-label={t["a11y.navFooter"]}>
                <ul className="flex flex-col gap-1.5 xl:gap-5">
                  <li className="flex">
                    <MenuButton href={localePath(lang, "/about")}>{t["nav.about"]}</MenuButton>
                  </li>
                  <li className="flex">
                    <MenuButton href={localePath(lang, "/events")}>{t["nav.events"]}</MenuButton>
                  </li>
                  <li className="flex">
                    <MenuButton href={localePath(lang, "/mentorship")}>{t["nav.mentorship"]}</MenuButton>
                  </li>
                  <li className="flex">
                    <MenuButton href={PRIVACY_PATH}>{t["footer.privacy"]}</MenuButton>
                  </li>
                  <li className="flex">
                    <MenuAction>{t["footer.cookieSettings"]}</MenuAction>
                  </li>
                </ul>
              </nav>
              <div className="flex gap-2.5">
                <ButtonSocial network="linkedin" href={LINKEDIN_URL} label={t["a11y.linkedin"]} newTabLabel={t["a11y.newTab"]} />
                <ButtonSocial network="facebook" href={FACEBOOK_URL} label={t["a11y.facebook"]} newTabLabel={t["a11y.newTab"]} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 self-end md:self-stretch xl:w-37.5">
              <div className="flex flex-col gap-5">
                <ButtonLink option="white" href={localePath(lang, "/volunteer")} className="w-full">
                  {t["nav.volunteer"]}
                </ButtonLink>
                <ButtonLink option="dark" href={DONATE_URL} newTabLabel={t["a11y.newTab"]} className="w-full">
                  {t["nav.donate"]}
                </ButtonLink>
              </div>
              <Image
                src={hug}
                alt=""
                unoptimized
                className="hidden h-auto w-43 md:block xl:w-37.5"
              />
            </div>
          </div>
        </div>
      </div>

      <Image
        src={photoTablet}
        alt=""
        sizes="100vw"
        className="hidden h-80 w-full object-cover md:block xl:hidden"
      />
      <Image src={photoMobile} alt="" sizes="100vw" className="block h-80 w-full object-cover md:hidden" />
    </footer>
  );
}
