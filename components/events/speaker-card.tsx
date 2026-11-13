import { Avatar } from "@/components/ui/avatar";
import { ButtonSocial } from "@/components/ui/button-social";
import type { Speaker } from "@/data/events";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { speakerBio } from "@/lib/events";

/**
 * Карточка спикера (Figma: speaker `1010:1332`; tablet / mobile `1145:12227`). bg/card-light, отступы 40 (mobile 20):
 * аватар 97 (mobile 64) с белой обводкой, имя (feature), LinkedIn справа (mobile — под текстом), под ними био.
 * Должность и компания в макете не показаны — идут только в разметку JSON-LD (шаг 10). Сайт спикера — текстовая ссылка под именем.
 */
export function SpeakerCard({ speaker, lang, t }: { speaker: Speaker; lang: Locale; t: Dictionary }) {
  const bio = speakerBio(speaker, lang);
  const host = speaker.website ? new URL(speaker.website).hostname.replace(/^www\./, "") : null;
  const linkedin = speaker.linkedin ? (
    <ButtonSocial
      network="linkedin"
      href={speaker.linkedin}
      label={t["a11y.speakerLinkedin"].replace("{name}", speaker.name)}
      newTabLabel={t["a11y.newTab"]}
    />
  ) : null;
  return (
    <li className="flex flex-col gap-5 bg-bg-card-light px-5 pt-5 pb-10 md:gap-4 md:p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-2.5">
          {speaker.photo ? (
            <Avatar src={speaker.photo} sizes="97px" className="size-16 md:size-24" />
          ) : null}
          <div className="flex flex-col gap-2">
            <h3 className="text-feature text-text-heading">{speaker.name}</h3>
            {host ? (
              <a href={speaker.website!} className="text-body underline" target="_blank" rel="noopener noreferrer">
                {host}
                <span className="sr-only"> {t["a11y.newTab"]}</span>
              </a>
            ) : null}
          </div>
        </div>
        <div className="hidden md:block">{linkedin}</div>
      </div>
      <p className="text-body whitespace-pre-line text-text-body">{bio}</p>
      {linkedin ? <div className="pt-5 md:hidden">{linkedin}</div> : null}
    </li>
  );
}
