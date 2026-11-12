import type { ReactNode } from "react";

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
