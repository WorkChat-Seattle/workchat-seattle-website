import { volunteerTiles } from "@/data/volunteer";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import { RolesGrid, type TileView } from "./roles-grid";

/**
 * Роли волонтёров (Figma: volunteer-roles `1088:1733`; tablet `1240:15711`, mobile `1145:11795`). Тексты собираются на сервере,
 * сетка и кнопка «More ways to contribute» (mobile) — клиентский `RolesGrid`. Отступ сверху 160 / 40 / 80
 * (на tablet 40 — внутренний отступ блока в макете), на mobile кнопка под сеткой через 20.
 */
export function VolunteerRoles({ t }: { t: Dictionary }) {
  const tiles: TileView[] = volunteerTiles.map((tile) =>
    tile.kind === "photo"
      ? { kind: "photo", id: tile.id, images: tile.images }
      : {
          kind: "role",
          id: tile.id,
          tone: tile.tone,
          title: t[`volunteer.roles.${tile.id}.title` as TextKey],
          text: t[`volunteer.roles.${tile.id}.text` as TextKey],
        },
  );
  return (
    <section
      aria-label={t["volunteer.hero.title"]}
      className="mx-auto mt-20 max-w-300 px-5 md:mt-10 md:px-10 xl:mt-40 xl:px-0"
    >
      <RolesGrid tiles={tiles} moreLabel={t["volunteer.roles.more"]} />
    </section>
  );
}
