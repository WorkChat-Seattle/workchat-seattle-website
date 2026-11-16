"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PaginationDot } from "@/components/ui/pagination-dot";
import { QuoteAccent } from "@/components/ui/quote-accent";
import type { team as teamData } from "@/data/team";

export type TeamMember = (typeof teamData)[number] & { name: string; role: string; bio: string };

const tone = { neutral: "bg-bg-card-neutral", muted: "bg-bg-card-muted", light: "bg-bg-card-light" } as const;

/**
 * Команда (Figma: team `1088:1727`; tablet `1240:14919`, mobile `1113:11062`; карточка card-team-member `1077:3174`,
 * оверлей с био — секция Overlays `1633:28076`).
 * desktop: цитата слева (x=0, ширина 269) и три карточки 300×(450 + текст) от x=300; tablet / mobile: заголовок, цитата и
 * лента карточек (виден край следующей, точки-индикатор под лентой).
 * Био (два абзаца) всегда в HTML, до открытия визуально скрыто (плашка за нижним краем фото и выезжает снизу, translateY, 400 ms). Оверлей: на устройствах с мышью — по hover и фокусу,
 * на планшетах и телефонах — по нажатию на фото (`<button aria-expanded aria-controls>`); открыт один, закрытие —
 * повторное нажатие, другая карточка или Esc.
 */
export function Team({
  title,
  quote,
  members,
}: {
  title: string;
  quote: string;
  members: TeamMember[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      let best = 0;
      let dist = Infinity;
      slides.forEach((sl, i) => {
        const d = Math.abs(sl.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < dist) {
          best = i;
          dist = d;
        }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      aria-labelledby="team-title"
      className="mt-20 overflow-x-clip md:mt-30 xl:mt-40"
    >
      <div className="mx-auto max-w-300 px-5 md:px-10 xl:px-0">
        <div className="flex flex-col gap-5 md:pl-43 xl:block xl:pl-75">
          <h2 data-reveal id="team-title" className="text-h2 text-text-heading">
            {title}
          </h2>
          <QuoteAccent className="w-79 md:w-129 xl:hidden">
            <span>{quote}</span>
          </QuoteAccent>
        </div>

        <div className="mt-10 xl:mt-15 xl:flex">
          <div className="hidden w-75 shrink-0 xl:block">
            <QuoteAccent className="w-67.25">
              <span className="whitespace-pre-line">{quote}</span>
            </QuoteAccent>
          </div>
          <ul
            ref={track}
            className="scrollbar-none -mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5 md:-mr-10 md:pr-10 xl:mr-0 xl:gap-0 xl:overflow-visible xl:pr-0"
          >
            {members.map((m) => {
              const isOpen = open === m.id;
              return (
                <li key={m.id} className="w-75 shrink-0 snap-start">
                  <article className="group">
                    <div className={`relative h-112.5 overflow-hidden ${tone[m.tone]}`}>
                      <Image
                        src={m.photo}
                        alt=""
                        sizes="300px"
                        className="absolute bottom-0 h-107.5 w-full object-cover object-bottom"
                      />
                      <button
                        type="button"
                        aria-label={m.name}
                        aria-expanded={isOpen}
                        aria-controls={`bio-${m.id}`}
                        onClick={() => setOpen(isOpen ? null : m.id)}
                        className="absolute inset-0 focus-visible:-outline-offset-2"
                      />
                      <div
                        id={`bio-${m.id}`}
                        className={`pointer-events-none absolute inset-0 overflow-hidden bg-overlay-team-bio p-5 text-text-white transition-transform duration-(--duration-team-bio) ease-card motion-reduce:transition-none group-has-focus-visible:translate-y-0 xl:group-hover:translate-y-0 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
                      >
                        <p className="text-body whitespace-pre-line">{m.bio}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 pt-5">
                      <h3 className="text-h3 text-text-heading">{m.name}</h3>
                      <p className="text-body text-text-body">{m.role}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <div aria-hidden="true" className="mt-5 flex justify-center gap-2 xl:hidden">
          {members.map((m, i) => (
            <PaginationDot key={m.id} active={i === index} label="" tabIndex={-1} />
          ))}
        </div>
      </div>
    </section>
  );
}
