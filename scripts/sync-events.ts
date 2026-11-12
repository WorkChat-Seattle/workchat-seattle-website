/**
 * Перенос событий и спикеров из Notion в data/events.ts (docs/dynamic-content.md).
 *
 *   npm run sync:events
 *
 * Берёт записи Event listings со статусом Ready или Published (Draft пропускается), связанных спикеров из Speakers только
 * с галочкой Consent received (без согласия спикер не публикуется — событие остаётся без него), собирает описание из тела
 * страницы (абзацы, маркированные списки, жирный, курсив, ссылки; всё после первого разделителя — служебное, пропускается),
 * скачивает Cover photo и фото спикеров в public/images/events/ (ссылки Notion временные). Сводка в конце: что пропущено и чего не хватает.
 * Результат — data/events.ts (коммитится, правится только этим скриптом). Токен и id баз — .env.local (NOTION_TOKEN, NOTION_DS_*).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const token = process.env.NOTION_TOKEN;
const EVENTS_DS = process.env.NOTION_DS_EVENT_LISTINGS;
const SPEAKERS_DS = process.env.NOTION_DS_SPEAKERS;
if (!token || !EVENTS_DS || !SPEAKERS_DS) {
  console.error("Нужны NOTION_TOKEN, NOTION_DS_EVENT_LISTINGS, NOTION_DS_SPEAKERS (.env.local или окружение)");
  process.exit(1);
}
const H = { Authorization: `Bearer ${token}`, "Notion-Version": "2025-09-03", "Content-Type": "application/json" };
const IMG_DIR = join(root, "public/images/events");

type Rich = { plain_text: string; href: string | null; annotations: { bold: boolean; italic: boolean } }[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>;
type Page = { id: string; properties: Props };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.notion.com/v1${path}`, { ...init, headers: H });
    if (res.status === 429 && attempt < 5) {
      await new Promise((r) => setTimeout(r, (Number(res.headers.get("retry-after")) || 2 ** attempt) * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`Notion ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as T;
  }
}

async function queryAll(ds: string, body: object = {}): Promise<Page[]> {
  const out: Page[] = [];
  let cursor: string | undefined;
  do {
    const r = await api<{ results: Page[]; has_more: boolean; next_cursor: string | null }>(`/data_sources/${ds}/query`, {
      method: "POST",
      body: JSON.stringify({ page_size: 100, ...body, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    out.push(...r.results);
    cursor = r.has_more ? (r.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return out;
}

const text = (p: Props | undefined): string => {
  if (!p) return "";
  const arr: Rich = p.title ?? p.rich_text ?? [];
  return arr.map((t) => t.plain_text).join("").trim();
};
const sel = (p: Props | undefined): string => p?.select?.name ?? p?.status?.name ?? "";
const url = (p: Props | undefined): string => p?.url ?? "";

/** Run: текст с оформлением. */
export type Run = { text: string; bold?: boolean; italic?: boolean; href?: string };
export type Block = { type: "p"; runs: Run[] } | { type: "ul"; items: Run[][] };

const runs = (rt: Rich): Run[] =>
  rt
    .map((t) => ({
      text: t.plain_text,
      ...(t.annotations.bold ? { bold: true } : {}),
      ...(t.annotations.italic ? { italic: true } : {}),
      ...(t.href ? { href: t.href } : {}),
    }))
    .filter((r) => r.text);

async function body(pageId: string): Promise<Block[]> {
  const r = await api<{ results: { type: string; [k: string]: unknown }[] }>(`/blocks/${pageId}/children?page_size=100`);
  const blocks: Block[] = [];
  for (const b of r.results) {
    if (b.type === "divider") break; // дальше — служебное (callout с заметками команды)
    const rt = (b[b.type] as { rich_text?: Rich } | undefined)?.rich_text;
    if (b.type === "paragraph") {
      const rr = runs(rt ?? []);
      if (rr.length) blocks.push({ type: "p", runs: rr });
    } else if (b.type === "bulleted_list_item") {
      const item = runs(rt ?? []);
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    }
  }
  return blocks;
}

/** Абзацы из простого текста (поля Full description RU / Short description RU): пустая строка — граница. */
const paragraphs = (s: string): Block[] =>
  s
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => ({ type: "p" as const, runs: [{ text: x }] }));

async function download(fileProp: Props | undefined, name: string): Promise<string | null> {
  const f = fileProp?.files?.[0];
  const src: string | undefined = f?.file?.url ?? f?.external?.url;
  if (!src) return null;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Не скачалось фото ${name}: ${res.status}`);
  const ext = (extname(new URL(src).pathname) || ".jpg").toLowerCase();
  const file = `${name}${ext}`;
  mkdirSync(IMG_DIR, { recursive: true });
  writeFileSync(join(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
  return `/images/events/${file}`;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  const report: string[] = [];
  const pages = await queryAll(EVENTS_DS!, {
    filter: { or: [{ property: "Status", status: { equals: "Ready" } }, { property: "Status", status: { equals: "Published" } }] },
  });
  const skipped = (await queryAll(EVENTS_DS!, { filter: { property: "Status", status: { equals: "Draft" } } })).map((p) => text(p.properties.Title));
  if (skipped.length) report.push(`Пропущены (Draft): ${skipped.join("; ")}`);

  const speakerCache = new Map<string, Page>();
  const events = [];
  for (const p of pages) {
    const pr = p.properties;
    const title = text(pr.Title);
    const slug = text(pr.Slug) || slugify(title);
    const date = pr.Date?.date as { start: string; end: string | null } | null;
    if (!date?.start) {
      report.push(`✗ ${title}: нет даты — пропущено`);
      continue;
    }
    const speakers = [];
    for (const rel of (pr.Speakers?.relation ?? []) as { id: string }[]) {
      let sp = speakerCache.get(rel.id);
      if (!sp) {
        sp = await api<Page>(`/pages/${rel.id}`);
        speakerCache.set(rel.id, sp);
      }
      const sprops = sp.properties;
      const name = text(sprops.Name);
      if (!sprops["Consent received"]?.checkbox) {
        report.push(`  ${title}: спикер «${name}» без Consent received — не публикуется`);
        continue;
      }
      const photo = await download(sprops.Photo, `speaker-${slugify(name)}`);
      if (!photo) report.push(`  ${title}: у спикера «${name}» нет фото`);
      speakers.push({
        id: slugify(name),
        name,
        position: text(sprops.Position),
        company: text(sprops.Company),
        bio: text(sprops.Bio),
        bioRu: text(sprops["Bio RU"]),
        photo,
        linkedin: url(sprops.LinkedIn) || null,
        website: url(sprops.Website) || null,
      });
    }
    const cover = await download(pr["Cover photo"], `cover-${slug}`);
    if (!cover) report.push(`  ${title}: нет Cover photo`);
    const format = sel(pr.Format) as "In person" | "Online" | "Hybrid" | "";
    events.push({
      slug,
      title,
      titleRu: text(pr["Title RU"]) || null,
      start: date.start,
      end: date.end,
      language: sel(pr.Language),
      format,
      placeName: text(pr["Place name"]) || null,
      address: text(pr.Address) || null,
      mapsLink: url(pr["Google Maps link"]) || null,
      registrationLink: url(pr["Registration link"]) || null,
      recordingLink: url(pr["Recording link"]) || null,
      tags: ((pr.Tags?.multi_select ?? []) as { name: string }[]).map((t) => t.name),
      short: text(pr["Short description"]),
      shortRu: text(pr["Short description RU"]) || null,
      description: await body(p.id),
      descriptionRu: paragraphs(text(pr["Full description RU"])),
      cover,
      speakers,
    });
  }

  events.sort((a, b) => a.start.localeCompare(b.start));
  const out = `/**
 * События (Notion → Event listings, Speakers). ФАЙЛ СОБИРАЕТСЯ командой \`npm run sync:events\` (scripts/sync-events.ts) — руками не править.
 * Только записи со статусом Ready / Published; спикеры — только с Consent received. Время — ISO с поясом (America/Los_Angeles).
 */
export type Run = { text: string; bold?: boolean; italic?: boolean; href?: string };
export type Block = { type: "p"; runs: Run[] } | { type: "ul"; items: Run[][] };
export type Speaker = {
  id: string;
  name: string;
  position: string;
  company: string;
  bio: string;
  bioRu: string;
  photo: string | null;
  linkedin: string | null;
  website: string | null;
};
export type EventItem = {
  slug: string;
  title: string;
  titleRu: string | null;
  start: string;
  end: string | null;
  language: string;
  format: "In person" | "Online" | "Hybrid" | "";
  placeName: string | null;
  address: string | null;
  mapsLink: string | null;
  registrationLink: string | null;
  recordingLink: string | null;
  tags: string[];
  short: string;
  shortRu: string | null;
  description: Block[];
  descriptionRu: Block[];
  cover: string | null;
  speakers: Speaker[];
};

export const events: EventItem[] = ${JSON.stringify(events, null, 2)};
`;
  writeFileSync(join(root, "data/events.ts"), out);
  console.log(`Готово: ${events.length} событий → data/events.ts`);
  if (report.length) console.log("\n" + report.join("\n"));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
