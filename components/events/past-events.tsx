"use client";

import { useEffect, useRef, useState } from "react";
import { EventDetail } from "@/components/events/event-detail";
import { EventImage } from "@/components/events/event-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { CardTag, Tag } from "@/components/ui/tag";

/** Прошедшее событие, уже приведённое к языку страницы на сервере (тексты, дата, место). */
export type PastEventView = {
  slug: string;
  href: string;
  title: string;
  short: string;
  date: string;
  place: string;
  cover: string | null;
  recording: string | null;
  tags: { id: string; label: string }[];
};

export type PastEventsTexts = {
  details: string;
  video: string;
  showMore: string;
  newTab: string;
};

const PAGE = 10;

/**
 * Past Events: фильтр по тегам и «Show more» (docs/decisions-2026-11-05.md, п. 4). Фильтр применяется до разбиения
 * на порции по 10; кнопка «Show more» — только если событий больше, чем показано; после подгрузки фокус уходит на
 * первую новую карточку. Все карточки первой порции — в HTML с сервера.
 * Карточка (Figma: card-event-past `1145:12533`): desktop — фото 220, текст, колонка справа 260 с линией слева;
 * tablet — фото 264 слева, справа текст, детали и кнопки; mobile — всё в колонку.
 */
export function PastEvents({
  events,
  tags,
  titleId,
  texts,
}: {
  events: PastEventView[];
  tags: { id: string; label: string }[];
  titleId: string;
  texts: PastEventsTexts;
}) {
  const [tag, setTag] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const focusIndex = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = tag ? events.filter((e) => e.tags.some((x) => x.id === tag)) : events;
  const shown = filtered.slice(0, visible);

  useEffect(() => {
    if (focusIndex.current === null) return;
    const card = listRef.current?.children[focusIndex.current];
    card?.querySelector<HTMLElement>("a")?.focus();
    focusIndex.current = null;
  }, [visible]);

  return (
    <>
      {tags.length > 1 ? (
        <div data-reveal role="group" aria-labelledby={titleId} className="mt-10 flex flex-wrap gap-3 md:pl-43 xl:pl-75">
          {tags.map((x) => (
            <Tag
              key={x.id}
              selected={tag === x.id}
              onClick={() => {
                setTag(tag === x.id ? null : x.id);
                setVisible(PAGE);
              }}
            >
              {x.label}
            </Tag>
          ))}
        </div>
      ) : null}
      <ul ref={listRef} className="mt-10 flex flex-col gap-5 xl:gap-2.5">
        {shown.map((e) => (
          <li key={e.slug} className="flex flex-col bg-bg-card-neutral p-5 md:flex-row md:gap-10 md:p-10 xl:min-h-75">
            <div className="relative mb-5 h-50 w-full shrink-0 md:mb-0 md:size-66 xl:size-55">
              <EventImage src={e.cover} sizes="(min-width: 1280px) 220px, (min-width: 768px) 264px, 350px" />
            </div>
            <div className="flex flex-1 flex-col xl:flex-row xl:gap-10">
              {/* ниже xl обёртки «contents»: текст, детали и кнопки идут одной колонкой в порядке order */}
              <div className="contents xl:flex xl:flex-1 xl:flex-col xl:justify-between">
                <div className="order-1 flex flex-col gap-5">
                  <h3 className="text-h3 text-text-heading xl:max-w-142.5">{e.title}</h3>
                  <p className="flex items-center gap-1">
                    {e.tags.map((x, i) => (
                      <span key={x.id} className="flex items-center gap-1">
                        {i > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-button-text-dark" /> : null}
                        <CardTag>{x.label}</CardTag>
                      </span>
                    ))}
                  </p>
                  <p className="text-body text-text-body xl:max-w-137.75">{e.short}</p>
                </div>
                <ButtonLink option="dark" href={e.href} className="order-3 mt-10 w-full xl:mt-0 xl:w-61">
                  {texts.details}
                </ButtonLink>
              </div>
              <div className="contents xl:flex xl:w-65 xl:flex-col xl:justify-between xl:border-l xl:border-border-divider xl:pl-5">
                <div className="order-2 mt-10 flex flex-col gap-4 md:mt-5 xl:mt-0">
                  <EventDetail type="date">{e.date}</EventDetail>
                  <EventDetail type="location">{e.place}</EventDetail>
                </div>
                {e.recording ? (
                  <ButtonLink
                    option="outlined"
                    href={e.recording}
                    newTabLabel={texts.newTab}
                    className="order-4 mt-2.5 w-full xl:mt-0"
                  >
                    {texts.video}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length > visible ? (
        <div className="mt-10 flex justify-center">
          <Button
            option="outlined"
            onClick={() => {
              focusIndex.current = visible;
              setVisible(visible + PAGE);
            }}
          >
            {texts.showMore}
          </Button>
        </div>
      ) : null}
    </>
  );
}
