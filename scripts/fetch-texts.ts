/**
 * Загрузка текстов из Google-таблицы «WorkChat — тексты сайта EN/RU» в content/texts/*.csv.
 *
 *   npm run texts          — скачать все вкладки и пересобрать словари (scripts/build-texts.ts)
 *   npm run texts -- home  — только перечисленные файлы (имя без .csv)
 *
 * Таблица опубликована как CSV (автопубликация включена); каждая вкладка — по своей ссылке
 * (gid). Google обновляет опубликованную версию с задержкой до нескольких минут.
 * Файл НЕ перезаписывается, если: скачивание не удалось, пришёл не CSV с нужными колонками,
 * или в новой версии пропал ключ, который используется в коде. Пропавшие ключи, которых в коде
 * нет, выводятся предупреждением. Остальные вкладки при этом обновляются; при любой отмене
 * команда завершается с ошибкой (код 1) и словари не пересобираются.
 * CSV руками не править (content/texts/README.md).
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";

const PUB = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR626r4-HsC98B-BgoLzf7ApJqraHMvY8s18BnsPaEIDdJP-rPPjDaFSUqWA6O4vaBowWRpaKgAb7hK/pub";

const TABS = [
  { file: "common", tab: "Общее", gid: 0 },
  { file: "home", tab: "Home", gid: 1 },
  { file: "about", tab: "About", gid: 2 },
  { file: "events", tab: "Events", gid: 3 },
  { file: "event-page", tab: "Event page", gid: 4 },
  { file: "mentorship", tab: "Mentorship", gid: 5 },
  { file: "mentor-info", tab: "Mentor info", gid: 6 },
  { file: "volunteer", tab: "Volunteer", gid: 7 },
  { file: "not-found", tab: "404", gid: 8 },
  { file: "seo", tab: "SEO", gid: 9 },
];

const DIR = join(process.cwd(), "content/texts");
const REQUIRED = ["Ключ", "EN", "RU", "Статус"];

/** Исходники, в которых ищем используемые ключи. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "dictionaries", "design-assets", "public", "content", "docs"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.(tsx?|css|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

const keysOf = (csv: string): string[] =>
  (parse(csv, { columns: true, skip_empty_lines: true, bom: true, relax_column_count: true }) as Record<string, string>[])
    .map((r) => (r["Ключ"] ?? "").trim())
    .filter((k) => k && k !== "—");

async function download(gid: number): Promise<string> {
  const url = `${PUB}?gid=${gid}&single=true&output=csv`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.text()).replace(/^﻿/, "");
}

async function main() {
  const only = process.argv.slice(2);
  const tabs = only.length ? TABS.filter((t) => only.includes(t.file)) : TABS;
  if (!tabs.length) {
    console.error("Нет такой вкладки. Доступны: " + TABS.map((t) => t.file).join(", "));
    process.exit(1);
  }

  const code = sourceFiles(process.cwd()).map((f) => readFileSync(f, "utf8")).join("\n");
  const usedInCode = (key: string) => code.includes(`"${key}"`) || code.includes(`'${key}'`) || code.includes(`\`${key}`);

  let refused = 0;
  for (const { file, tab, gid } of tabs) {
    const path = join(DIR, `${file}.csv`);
    const label = `${file}.csv (вкладка «${tab}»)`;
    let next: string;
    try {
      next = await download(gid);
    } catch (e) {
      console.error(`✗ ${label}: не скачалось (${e instanceof Error ? e.message : e}) — файл не тронут`);
      refused++;
      continue;
    }
    // должен быть CSV с нашими колонками, а не HTML-страница Google
    let nextKeys: string[];
    try {
      const header = (parse(next, { to_line: 1, bom: true, relax_column_count: true })[0] ?? []) as string[];
      const missing = REQUIRED.filter((c) => !header.includes(c));
      if (missing.length) throw new Error(`нет колонок: ${missing.join(", ")}`);
      nextKeys = keysOf(next);
      if (!nextKeys.length) throw new Error("нет ни одного ключа");
    } catch (e) {
      console.error(`✗ ${label}: пришёл не тот CSV (${e instanceof Error ? e.message : e}) — файл не тронут`);
      refused++;
      continue;
    }

    const prev = readFileSync(path, "utf8");
    const nextSet = new Set(nextKeys);
    const gone = keysOf(prev).filter((k) => !nextSet.has(k));
    const goneUsed = gone.filter(usedInCode);
    if (goneUsed.length) {
      console.error(`✗ ${label}: пропали ключи, которые используются в коде — файл не тронут:\n    ${goneUsed.join("\n    ")}`);
      refused++;
      continue;
    }
    const prevSet = new Set(keysOf(prev));
    const added = nextKeys.filter((k) => !prevSet.has(k));
    writeFileSync(path, next); // как скачано, без правок: в git diff только реальные изменения
    console.log(`✓ ${label}${prev === next || prev === next + "\n" ? " — без изменений" : ""}`);
    if (added.length) console.log(`    новые ключи: ${added.join(", ")}`);
    if (gone.length) console.warn(`    ⚠ пропали (в коде не используются): ${gone.join(", ")}`);
  }

  if (refused) {
    console.error(`\nНе обновлено вкладок: ${refused}. Словари не пересобраны.`);
    process.exit(1);
  }

  // Словари пересобираются только после полностью успешной загрузки.
  execFileSync("npx", ["tsx", "scripts/build-texts.ts"], { stdio: "inherit" });
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
