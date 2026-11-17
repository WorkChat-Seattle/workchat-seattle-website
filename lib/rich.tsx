import type { ReactNode } from "react";
import { SmartLink } from "@/components/ui/smart-link";

/** Оборачивает первое вхождение `phrase` в `text` в ссылку (render); если фразы нет — возвращает текст как есть. */
export function linkPhrase(text: string, phrase: string, render: (phrase: string) => ReactNode): ReactNode {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      {render(phrase)}
      {text.slice(i + phrase.length)}
    </>
  );
}

const AUTO_LINK = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

/**
 * Превращает в ссылки адреса сайтов (https://…) и email внутри обычного текста. Ссылки открываются по правилу lib/links.ts (`newTabLabel` — a11y.newTab для внешних http(s)). Знаки препинания в конце
 * адреса (`)`, `.`, `,`, `;`) в ссылку не входят. Переносы строк сохраняются (`white-space: pre-line` у родителя).
 */
export function autoLink(text: string, className = "underline", newTabLabel?: string): ReactNode[] {
  return text.split(AUTO_LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const tail = part.match(/[).,;:]+$/)?.[0] ?? "";
    const core = tail ? part.slice(0, -tail.length) : part;
    const href = core.includes("@") && !core.startsWith("http") ? `mailto:${core}` : core;
    return (
      <span key={i}>
        <SmartLink href={href} className={className} newTabLabel={newTabLabel}>
          {core}
        </SmartLink>
        {tail}
      </span>
    );
  });
}
