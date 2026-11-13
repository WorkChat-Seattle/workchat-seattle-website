/**
 * Перенос менторов из Notion (Mentor cards) в data/mentors.ts (docs/dynamic-content.md, «Менторы»).
 *
 *   npm run sync:mentors
 *
 * Берёт записи со статусом Ready или Published, только с галочкой Consent received; порядок — поле Order. Скачивает Photo в
 * public/images/mentors/ (ссылки Notion временные) и проверяет размер (нужно от 800×800, квадрат). Контакты из Volunteers не берём;
 * Email — из самой карточки (для «Get connected»). Сводка в конце: что пропущено и чего не хватает.
 * Результат — data/mentors.ts (коммитится, правится только этим скриптом). Токен и id баз — .env.local (NOTION_TOKEN, NOTION_DS_*).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const token = process.env.NOTION_TOKEN;
const MENTORS_DS = process.env.NOTION_DS_MENTOR_CARDS;
if (!token || !MENTORS_DS) {
  console.error("Нужны NOTION_TOKEN, NOTION_DS_MENTOR_CARDS (.env.local или окружение)");
  process.exit(1);
}
const H = { Authorization: `Bearer ${token}`, "Notion-Version": "2025-09-03", "Content-Type": "application/json" };
const IMG_DIR = join(root, "public/images/mentors");

type Rich = { plain_text: string }[];
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
const url = (p: Props | undefined): string => p?.url ?? "";
const names = (p: Props | undefined): string[] => ((p?.multi_select ?? []) as { name: string }[]).map((t) => t.name);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Размер изображения из заголовка PNG / JPEG / WebP (без зависимостей). */
function imageSize(b: Buffer): { w: number; h: number } | null {
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.readUInt16BE(0) === 0xffd8) {
    let o = 2;
    while (o < b.length) {
      if (b[o] !== 0xff) return null;
      const m = b[o + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) };
      o += 2 + b.readUInt16BE(o + 2);
    }
  }
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const k = b.toString("ascii", 12, 16);
    if (k === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (k === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

async function download(fileProp: Props | undefined, name: string, report: string[]): Promise<{ path: string; w: number; h: number } | null> {
  const f = fileProp?.files?.[0];
  const src: string | undefined = f?.file?.url ?? f?.external?.url;
  if (!src) return null;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Не скачалось фото ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = (extname(new URL(src).pathname) || ".jpg").toLowerCase();
  const file = `${name}${ext}`;
  mkdirSync(IMG_DIR, { recursive: true });
  writeFileSync(join(IMG_DIR, file), buf);
  const size = imageSize(buf);
  if (!size) report.push(`  ${name}: размер фото не определён`);
  else {
    if (size.w < 800 || size.h < 800) report.push(`  ${name}: фото ${size.w}×${size.h} — мало (нужно от 800×800 для 2×)`);
    if (Math.abs(size.w - size.h) > size.w * 0.02) report.push(`  ${name}: фото ${size.w}×${size.h} не квадратное — обрежется по центру`);
  }
  return { path: `/images/mentors/${file}`, w: size?.w ?? 0, h: size?.h ?? 0 };
}

async function main() {
  const report: string[] = [];
  const pages = await queryAll(MENTORS_DS!, {
    filter: { or: [{ property: "Status", status: { equals: "Ready" } }, { property: "Status", status: { equals: "Published" } }] },
    sorts: [{ property: "Order", direction: "ascending" }],
  });
  const drafts = (await queryAll(MENTORS_DS!, { filter: { property: "Status", status: { equals: "Draft" } } })).map((p) => text(p.properties.Name));
  if (drafts.length) report.push(`Пропущены (Draft): ${drafts.join("; ")}`);

  const mentors = [];
  for (const p of pages) {
    const pr = p.properties;
    const name = text(pr.Name);
    if (!pr["Consent received"]?.checkbox) {
      report.push(`✗ ${name}: нет Consent received — не публикуется`);
      continue;
    }
    const slug = text(pr.Slug) || slugify(name);
    if (!text(pr.Slug)) report.push(`  ${name}: Slug пуст — взят из имени (${slug})`);
    const photo = await download(pr.Photo, `mentor-${slug}`, report);
    if (!photo) report.push(`  ${name}: нет фото`);
    if (!text(pr.Bio)) report.push(`  ${name}: нет Bio`);
    if (!text(pr["Bio RU"])) report.push(`  ${name}: нет Bio RU — на /ru покажется английское`);
    if (!text(pr.Position)) report.push(`  ${name}: нет Position`);
    if (!url(pr.LinkedIn)) report.push(`  ${name}: нет LinkedIn`);
    if (pr.Order?.number == null) report.push(`  ${name}: Order не задан`);
    mentors.push({
      slug,
      name,
      position: text(pr.Position),
      company: text(pr.Company),
      industry: names(pr.Industry),
      expertise: names(pr.Expertise),
      bio: text(pr.Bio),
      bioRu: text(pr["Bio RU"]) || null,
      photo: photo?.path ?? null,
      linkedin: url(pr.LinkedIn) || null,
      facebook: url(pr.Facebook) || null,
      website: url(pr.Website) || null,
      email: (pr.Email?.email as string | null) ?? null,
      order: (pr.Order?.number as number | null) ?? 999,
    });
  }
  mentors.sort((a, b) => a.order - b.order);

  const out = `/**
 * Менторы (Notion → Mentor cards). ФАЙЛ СОБИРАЕТСЯ командой \`npm run sync:mentors\` (scripts/sync-mentors.ts) — руками не править.
 * Только записи со статусом Ready / Published и с Consent received; порядок — Order.
 */
export type Mentor = {
  slug: string;
  name: string;
  position: string;
  company: string;
  industry: string[];
  expertise: string[];
  bio: string;
  bioRu: string | null;
  photo: string | null;
  linkedin: string | null;
  facebook: string | null;
  website: string | null;
  email: string | null;
  order: number;
};

export const mentors: Mentor[] = ${JSON.stringify(mentors, null, 2)};
`;
  writeFileSync(join(root, "data/mentors.ts"), out);
  console.log(`Готово: ${mentors.length} менторов → data/mentors.ts`);
  if (report.length) console.log("\n" + report.join("\n"));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
