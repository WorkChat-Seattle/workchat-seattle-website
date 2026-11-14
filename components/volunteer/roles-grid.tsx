"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ParallaxTiles } from "@/components/ui/parallax";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { Photo } from "@/data/volunteer";
import s from "./roles.module.css";

const tone = { neutral: "bg-bg-card-neutral", dark: "bg-bg-card-dark" } as const;

export type TileView =
  | { kind: "photo"; id: string; images: Photo["images"] }
  | { kind: "role"; id: string; tone: "neutral" | "dark"; title: string; text: string };

/**
 * Скорость параллакса по столбцам desktop (animations.md, п. 13): столбец определяется порядком в roles.module.css
 * (1: photo1, speak, resources; 2: events, photo2, connect; 3: programs, operations, photo3; 4: photo4, mentor, stories).
 */
const columnSpeed: Record<string, number> = {
  photo1: 0.12, speak: 0.12, resources: 0.12,
  events: 0.3, photo2: 0.3, connect: 0.3,
  programs: 0.18, operations: 0.18, photo3: 0.18,
  photo4: 0.24, mentor: 0.24, stories: 0.24,
};

/** Сколько плиток видно на mobile до нажатия кнопки: фото, Share what you know, Bring events to life, Keep things running. */
const VISIBLE_ON_MOBILE = 4;

/**
 * Сетка ролей Volunteer. 8 карточек (заголовок h3 сверху, текст снизу, без ссылок) и 4 фото. mobile — колонка (фото 240, карточки по
 * содержимому), tablet — 2 колонки по 344, desktop — четыре колонки по 300 со ступенькой (roles.module.css). Один набор разметки
 * на все размеры, порядок меняется стилями.
 * На mobile сначала видны 4 плитки (фото и 3 роли), остальные раскрывает кнопка «More ways to contribute»
 * (`<button aria-expanded aria-controls>`); скрытые плитки всегда в HTML (display: none только на mobile). После раскрытия кнопка
 * исчезает, фокус — на первую открытую плитку. На tablet и desktop видно всё, кнопки нет.
 */
export function RolesGrid({ tiles, moreLabel }: { tiles: TileView[]; moreLabel: string }) {
  const [expanded, setExpanded] = useState(false);
  const firstNew = useRef<HTMLLIElement>(null);
  const extraIds = tiles.slice(VISIBLE_ON_MOBILE).map((t) => `vol-${t.id}`);

  return (
    <>
      <ParallaxTiles>
      <ul data-reveal-grid className={`${s.grid} flex flex-col`}>
        {tiles.map((tile, i) => {
          const hidden = !expanded && i >= VISIBLE_ON_MOBILE ? "max-md:hidden" : "";
          const ref = i === VISIBLE_ON_MOBILE ? firstNew : undefined;
          return tile.kind === "photo" ? (
            <li
              key={tile.id}
              id={`vol-${tile.id}`}
              ref={ref}
              tabIndex={-1}
              data-parallax-speed={columnSpeed[tile.id]}
              className={`${s.tile} ${s[tile.id]} relative h-60 md:aspect-square md:h-auto xl:aspect-auto ${hidden}`}
            >
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
              id={`vol-${tile.id}`}
              ref={ref}
              tabIndex={-1}
              data-parallax-speed={columnSpeed[tile.id]}
              className={`${s.tile} ${s[tile.id]} flex flex-col justify-between gap-4 px-5 py-10 md:min-h-86 md:p-10 xl:min-h-0 xl:p-9 ${tone[tile.tone]} ${hidden}`}
            >
              <h2 className="text-h3 text-text-heading">{tile.title}</h2>
              <p className="text-body text-text-body">{tile.text}</p>
            </li>
          );
        })}
      </ul>
      </ParallaxTiles>
      {!expanded ? (
        <Button
          option="outlined"
          aria-expanded={false}
          aria-controls={extraIds.join(" ")}
          onClick={() => {
            setExpanded(true);
            requestAnimationFrame(() => firstNew.current?.focus());
          }}
          className="mt-5 w-full md:hidden"
        >
          {moreLabel}
        </Button>
      ) : null}
    </>
  );
}
