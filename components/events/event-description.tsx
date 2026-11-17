import { SmartLink } from "@/components/ui/smart-link";
import type { Block, Run } from "@/data/events";

function Runs({ runs, newTabLabel }: { runs: Run[]; newTabLabel?: string }) {
  return runs.map((r, i) => {
    let node: React.ReactNode = r.text;
    if (r.bold) node = <strong className="font-bold">{node}</strong>;
    if (r.italic) node = <em>{node}</em>;
    if (r.href) {
      node = (
        <SmartLink href={r.href} className="underline" newTabLabel={newTabLabel}>
          {node}
        </SmartLink>
      );
    }
    return <span key={i}>{node}</span>;
  });
}

/** Полное описание события из Notion: абзацы и маркированные списки со жирным, курсивом и ссылками. */
export function EventDescription({ blocks, newTabLabel }: { blocks: Block[]; newTabLabel?: string }) {
  return (
    <div className="flex flex-col gap-4 text-body text-text-body">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className="whitespace-pre-line">
            <Runs runs={b.runs} newTabLabel={newTabLabel} />
          </p>
        ) : (
          <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
            {b.items.map((item, j) => (
              <li key={j}>
                <Runs runs={item} newTabLabel={newTabLabel} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
