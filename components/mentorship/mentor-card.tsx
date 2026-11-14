import { Avatar } from "@/components/ui/avatar";
import { ButtonSocial } from "@/components/ui/button-social";
import { ButtonLink } from "@/components/ui/button";
import type { Mentor } from "@/data/mentors";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { mentorBio, mentorRole } from "@/lib/mentors";

/**
 * Карточка ментора (Figma: card-mentor `1010:1323`, option neutral | dark-neutral × size). Отступы 36 / 40 / 20 (снизу 56),
 * внутри: аватар 90 (mobile 64) + имя (feature) и должность, био, внизу LinkedIn / Facebook и «View profile» (264; mobile — на всю ширину).
 * Desktop — высота от 472, подвал прижат к низу, от био не ближе 40 (gap-10 + flex-1; карточки ряда одной высоты); tablet / mobile — подвал через 40. Фон: neutral → muted (`tone`).
 * Только те кнопки соцсетей, ссылки на которые есть в Notion.
 */
export function MentorCard({
  mentor,
  lang,
  t,
  tone,
}: {
  mentor: Mentor;
  lang: Locale;
  t: Dictionary;
  tone: "neutral" | "muted";
}) {
  return (
    <article
      className={[
        "flex w-full flex-col gap-10 px-5 pt-5 pb-14 md:p-10 xl:min-h-118 xl:p-9",
        tone === "muted" ? "bg-bg-card-muted" : "bg-bg-card-neutral",
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 xl:flex-1">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-2">
          {mentor.photo ? (
            <Avatar src={mentor.photo} size={90} className="size-16 md:row-span-2 md:size-22.5" />
          ) : null}
          <h3 className="text-feature text-text-heading md:self-end">{mentor.name}</h3>
          <p className="text-body col-span-2 text-text-body md:col-span-1 md:self-start">{mentorRole(mentor)}</p>
        </div>
        <p className="text-body whitespace-pre-line text-text-body">{mentorBio(mentor, lang)}</p>
      </div>
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
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
        <ButtonLink option="outlined" href={localePath(lang, `/mentors/${mentor.slug}`)} className="w-full md:w-66">
          {t["btn.viewProfile"]}
        </ButtonLink>
      </div>
    </article>
  );
}
