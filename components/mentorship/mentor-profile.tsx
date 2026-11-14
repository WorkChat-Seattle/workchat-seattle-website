import { RingPhoto } from "@/components/ui/ring-photo";
import { ButtonSocial } from "@/components/ui/button-social";
import { ButtonLink } from "@/components/ui/button";
import type { Mentor } from "@/data/mentors";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { mentorBio, mentorRole, mentorTags } from "@/lib/mentors";

/**
 * Профиль ментора (Figma: mentor-profile `1145:12181`, profile-card: 1440 `1145:12187`, 768 `1240:16017`, mobile `1145:12208`).
 * Карточка bg/card-neutral. Desktop: отступы 80 / 40 слева / 150 справа, фото 375 (обводка 15) и колонка 600 через 36; имя (h1, стиль h2),
 * в строке LinkedIn / Facebook и должность (bold), био, Expertise и Industry в ряд, «Get connected». Tablet: отступы 40, фото 212 (обводка 11)
 * слева, справа имя, должность, соцсети; ниже био, подписи столбиком, кнопка по центру 300. Mobile: отступы 20, фото на всю ширину, ниже всё в столбец,
 * кнопка на всю ширину. «Get connected» — `mailto:` только если у ментора есть email (Consent received проверил sync).
 */
export function MentorProfile({ mentor, lang, t }: { mentor: Mentor; lang: Locale; t: Dictionary }) {
  const expertise = mentorTags(t, "expertise", mentor.expertise);
  const industry = mentorTags(t, "industry", mentor.industry);
  return (
    <div data-reveal="now" className="grid gap-5 bg-bg-card-neutral p-5 md:grid-cols-[auto_1fr] md:gap-x-23 md:p-10 xl:gap-x-9 xl:py-20 xl:pr-37.5 xl:pl-10">
      {mentor.photo ? (
        <RingPhoto
          src={mentor.photo}
          alt={mentor.name}
          width={375}
          ring="border-11 xl:border-15"
          priority
          className="w-full self-start md:w-53 xl:row-span-3 xl:w-93.75"
        />
      ) : null}
      <div className="flex flex-col gap-5 pt-5 md:col-start-2 md:pt-0 xl:mt-5.5">
        <h1 className="text-h2 text-text-heading">{mentor.name}</h1>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-9">
          <p className="text-body-bold-accent text-text-body xl:order-2">{mentorRole(mentor)}</p>
          <Socials mentor={mentor} t={t} />
        </div>
      </div>
      <p className="text-body whitespace-pre-line text-text-body md:col-span-2 xl:col-span-1 xl:col-start-2">
        {mentorBio(mentor, lang)}
      </p>
      {expertise.length || industry.length || mentor.email ? (
        <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-1 xl:col-start-2 xl:gap-10">
          {expertise.length || industry.length ? (
            <dl className="text-body flex flex-col gap-2.5 text-text-body xl:flex-row xl:gap-35">
              {expertise.length ? (
                <div className="flex gap-1">
                  <dt className="text-body-bold-accent shrink-0">{t["mentor.expertise"]}</dt>
                  <dd className="flex flex-col">{expertise.map((v) => <span key={v}>{v}</span>)}</dd>
                </div>
              ) : null}
              {industry.length ? (
                <div className="flex gap-1">
                  <dt className="text-body-bold-accent shrink-0">{t["mentor.industry"]}</dt>
                  <dd className="flex flex-col">{industry.map((v) => <span key={v}>{v}</span>)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {mentor.email ? (
            <div className="flex flex-col pt-5 md:items-center xl:items-start xl:pt-0">
              <ButtonLink option="outlined" href={`mailto:${mentor.email}`} className="w-full md:w-75">
                {t["btn.getConnected"]}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Socials({ mentor, t }: { mentor: Mentor; t: Dictionary }) {
  if (!mentor.linkedin && !mentor.facebook) return null;
  return (
    <div className="flex items-center gap-2.5">
      {mentor.linkedin ? (
        <ButtonSocial
          network="linkedin"
          href={mentor.linkedin}
          label={t["a11y.speakerLinkedin"].replace("{name}", mentor.name)}
          newTabLabel={t["a11y.newTab"]}
        />
      ) : null}
      {mentor.facebook ? (
        <ButtonSocial
          network="facebook"
          href={mentor.facebook}
          label={t["a11y.personFacebook"].replace("{name}", mentor.name)}
          newTabLabel={t["a11y.newTab"]}
        />
      ) : null}
    </div>
  );
}
