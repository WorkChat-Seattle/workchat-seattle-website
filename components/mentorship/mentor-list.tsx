"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Список карточек менторов с кнопкой «View all mentors» (docs/decisions-2026-11-05.md, п. 1). Карточки сверх `visible` всегда
 * в HTML (`hidden`), кнопка разворачивает их на месте и может вернуть «Show fewer»; без лишних карточек кнопки нет.
 * Раскладка: desktop — две колонки без зазора, tablet — одна колонка без зазора, mobile — одна колонка через 20.
 */
export function MentorList({
  items,
  visible,
  viewAll,
  showFewer,
}: {
  items: { key: string; node: ReactNode }[];
  visible: number;
  viewAll: string;
  showFewer: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const hasMore = items.length > visible;
  return (
    <>
      <ul id={id} className="grid gap-5 md:gap-0 xl:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.key} className="flex" hidden={i >= visible && !open}>
            {item.node}
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-10 flex flex-col md:pl-43 xl:pl-75">
          <Button option="outlined" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="md:w-fit xl:w-66">
            {open ? showFewer : viewAll}
          </Button>
        </div>
      ) : null}
    </>
  );
}
