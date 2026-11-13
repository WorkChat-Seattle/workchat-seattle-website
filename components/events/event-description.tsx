import type { Block, Run } from "@/data/events";

function Runs({ runs }: { runs: Run[] }) {
  return runs.map((r, i) => {
    let node: React.ReactNode = r.text;
    if (r.bold) node = <strong className="font-bold">{node}</strong>;
    if (r.italic) node = <em>{node}</em>;
    if (r.href) {
      node = (
        <a href={r.href} className="underline" target="_blank" rel="noopener noreferrer">
          {node}
        </a>
      );
    }
    return <span key={i}>{node}</span>;
  });
}

/** Полное описание события из Notion: абзацы и маркированные списки со жирным, курсивом и ссылками. */
export function EventDescription({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-4 text-body text-text-body">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className="whitespace-pre-line">
            <Runs runs={b.runs} />
          </p>
        ) : (
          <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
            {b.items.map((item, j) => (
              <li key={j}>
                <Runs runs={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
