/**
 * Выгрузка картинок из Figma через REST API (CLAUDE.md, «Правила вёрстки», п. 6).
 *
 *   npm run export:figma              — всё из scripts/figma-assets.ts
 *   npm run export:figma -- logo icon — только перечисленные name
 *
 * Узлы рендерятся как в макете (с обрезкой и фильтрами). Оригиналы —
 * design-assets/<dir>/<name>.<ext> (вне public, в git); для сайта копия —
 * public/images/<dir>/<name>.<ext> (svg прогоняется через SVGO). Повторный
 * запуск перезаписывает файлы. Токен — FIGMA_TOKEN в .env.local (в логи не
 * попадает).
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { optimize, type Config } from "svgo";
import { figmaAssets, type FigmaAsset } from "./figma-assets";

const FILE_KEY = "PRALafbEv1Nz9J0GRcw7sa";
const API = "https://api.figma.com/v1";
const BATCH = 20; // узлов в одном запросе
const MAX_RETRIES = 6;

const root = process.cwd();
if (existsSync(join(root, ".env.local"))) process.loadEnvFile(join(root, ".env.local"));
const token = process.env.FIGMA_TOKEN?.trim();
if (!token) {
  console.error("FIGMA_TOKEN не задан: добавьте его в .env.local");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** fetch с повтором при 429 (ждём Retry-After, иначе растущая пауза). */
async function request(url: string, auth: boolean): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, auth ? { headers: { "X-Figma-Token": token! } } : undefined);
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;
    const retry = Number(res.headers.get("retry-after"));
    const wait = (Number.isFinite(retry) && retry > 0 ? retry : 2 ** attempt * 5) * 1000;
    console.warn(`429 — жду ${Math.round(wait / 1000)} с и повторяю`);
    await sleep(wait);
  }
}

async function renderUrls(group: FigmaAsset[]): Promise<Map<string, string | null>> {
  const { format, scale, keepIds } = group[0];
  const out = new Map<string, string | null>();
  for (let i = 0; i < group.length; i += BATCH) {
    const chunk = group.slice(i, i + BATCH);
    const ids = chunk.map((a) => a.nodeId).join(",");
    const params = new URLSearchParams({ ids, format, scale: String(scale) });
    if (format === "svg") {
      params.set("svg_include_id", keepIds ? "true" : "false");
      params.set("svg_outline_text", "true");
    }
    const res = await request(`${API}/images/${FILE_KEY}?${params}`, true);
    if (res.status === 403) throw new Error("Figma ответил 403: токен неверный или без права file_content:read");
    if (!res.ok) throw new Error(`Figma /images: ${res.status} ${res.statusText}`);
    const body = (await res.json()) as { err?: string | null; images: Record<string, string | null> };
    if (body.err) throw new Error(`Figma /images: ${body.err}`);
    for (const a of chunk) out.set(a.nodeId, body.images[a.nodeId] ?? null);
  }
  return out;
}

function write(path: string, data: string | Buffer) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
}

function svgForSite(svg: string, a: FigmaAsset): string {
  const plugins: NonNullable<Config["plugins"]> = [
    a.keepIds
      ? { name: "preset-default", params: { overrides: { mergePaths: false, cleanupIds: false } } }
      : "preset-default", // viewBox в SVGO 4 по умолчанию сохраняется
  ];
  if (a.currentColor) plugins.push({ name: "convertColors", params: { currentColor: true } });
  return optimize(svg, { multipass: true, plugins }).data;
}

async function main() {
  const only = process.argv.slice(2);
  const wanted = only.length ? figmaAssets.filter((a) => only.includes(a.name)) : figmaAssets;
  if (!wanted.length) {
    console.error("Нет картинок для выгрузки (проверьте имена).");
    process.exit(1);
  }

  // группируем по формату и масштабу — это параметры запроса
  const groups = new Map<string, FigmaAsset[]>();
  for (const a of wanted) {
    const k = `${a.format}@${a.scale}@${a.keepIds ? "ids" : ""}`;
    groups.set(k, [...(groups.get(k) ?? []), a]);
  }

  let failed = 0;
  for (const group of groups.values()) {
    const urls = await renderUrls(group);
    for (const a of group) {
      const url = urls.get(a.nodeId);
      if (!url) {
        console.error(`✗ ${a.dir}/${a.name}: Figma не отрисовал узел ${a.nodeId}`);
        failed++;
        continue;
      }
      const res = await request(url, false);
      if (!res.ok) {
        console.error(`✗ ${a.dir}/${a.name}: загрузка ${res.status}`);
        failed++;
        continue;
      }
      const file = `${a.name}.${a.format}`;
      const original = join(root, "design-assets", a.dir, file);
      if (a.format === "svg") {
        const svg = await res.text();
        write(original, svg);
        if (a.publish !== false) write(join(root, "public/images", a.dir, file), svgForSite(svg, a));
      } else {
        const buf = Buffer.from(await res.arrayBuffer());
        write(original, buf);
        if (a.publish !== false) write(join(root, "public/images", a.dir, file), buf);
      }
      console.log(`✓ ${a.dir}/${file}${a.publish === false ? " (только оригинал)" : ""}`);
    }
  }
  if (failed) {
    console.error(`Не выгружено: ${failed}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
