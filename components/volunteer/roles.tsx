import { ResponsiveImage } from "@/components/ui/responsive-image";
import { volunteerTiles } from "@/data/volunteer";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import s from "./roles.module.css";

const tone = { neutral: "bg-bg-card-neutral", dark: "bg-bg-card-dark" } as const;

/**
 * Роли волонтёров (Figma: volunteer-roles `1088:1733`; tablet `1240:15711`, mobile `1145:11795`).
 * 8 карточек (заголовок h3 сверху, текст снизу, без ссылок) и 4 фото. mobile — колонка (фото 240, карточки по содержимому),
 * tablet — 2 колонки по 344, desktop — четыре колонки по 300 со ступенькой (см. roles.module.css). Один набор разметки на все
 * размеры, порядок меняется стилями. Отступ сверху 160 / 40 / 80 (на tablet 40 — внутренний отступ блока в макете).
 * Кнопка «More ways to contribute» на mobile (в Figma сворачивает часть ролей) в таблице текстов пока не заведена —
 * без подписи показываем все роли (открытый вопрос в CLAUDE.md).
 */
export function VolunteerRoles({ t }: { t: Dictionary }) {
  return (
    <section
      aria-label={t["volunteer.hero.title"]}
      className="mx-auto mt-20 max-w-300 px-5 md:mt-10 md:px-10 xl:mt-40 xl:px-0"
    >
      <ul className={`${s.grid} flex flex-col`}>
        {volunteerTiles.map((tile) =>
          tile.kind === "photo" ? (
            <li key={tile.id} className={`${s.tile} ${s[tile.id]} relative h-60 md:h-auto md:aspect-square xl:aspect-auto`}>
              <ResponsiveImage
                mobile={tile.images.mobile}
                tablet={tile.images.tablet}
                desktop={tile.images.desktop}
                sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw"
              />
            </li>
          ) : (
            <li
              key={tile.id}
              className={`${s.tile} ${s[tile.id]} flex flex-col justify-between gap-4 px-5 py-10 md:min-h-86 md:p-10 xl:min-h-0 xl:p-9 ${tone[tile.tone]}`}
            >
              <h2 className="text-h3 text-text-heading">{t[`volunteer.roles.${tile.id}.title` as TextKey]}</h2>
              <p className="text-body text-text-body">{t[`volunteer.roles.${tile.id}.text` as TextKey]}</p>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
