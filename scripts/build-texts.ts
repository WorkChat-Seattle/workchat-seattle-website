/**
 * Сборка словарей en / ru из выгрузки таблицы текстов (content/texts/*.csv).
 *
 *   npm run texts:build
 *
 * Правила — content/texts/README.md:
 *  - строки с ключом «—» (пояснения: текст из Notion или другой вкладки) пропускаются;
 *  - строки «Не переводить здесь» пропускаются;
 *  - «Черновик» (и «Проверить») попадают в словарь, но выводятся списком;
 *  - пустое RU → подставляется EN (ru-version.md), тоже выводится списком;
 *  - повтор ключа в разных файлах — ошибка.
 * Результат — плоские словари i18n/dictionaries/{en,ru}.json (коммитятся, чтобы
 * правки текстов были видны в git diff). Файлы руками не править.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";

const SRC = join(process.cwd(), "content/texts");
const OUT = join(process.cwd(), "i18n/dictionaries");

const SKIP_KEY = "—";
const SKIP_STATUS = "Не переводить здесь";
const UNFINISHED = new Set(["Черновик", "Проверить"]);

type Row = {
  Ключ: string;
  EN: string;
  RU: string;
  Статус: string;
};

const norm = (s: string | undefined) => (s ?? "").replace(/\r\n?/g, "\n").trim();

const en: Record<string, string> = {};
const ru: Record<string, string> = {};
const origin: Record<string, string> = {};
const drafts: string[] = [];
const ruFallback: string[] = [];
const errors: string[] = [];

const files = readdirSync(SRC)
  .filter((f) => f.endsWith(".csv"))
  .sort();

for (const file of files) {
  const rows: Row[] = parse(readFileSync(join(SRC, file), "utf8"), {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    relax_column_count: false,
  });

  for (const row of rows) {
    const key = norm(row.Ключ);
    const status = norm(row.Статус);
    if (!key || key === SKIP_KEY || status === SKIP_STATUS) continue;

    if (key in origin) {
      errors.push(`Повтор ключа «${key}»: ${origin[key]} и ${file}`);
      continue;
    }
    origin[key] = file;

    const enText = norm(row.EN);
    let ruText = norm(row.RU);
    if (!enText) errors.push(`Нет EN-текста: ${file} → ${key}`);
    if (!ruText) {
      ruText = enText;
      ruFallback.push(`${file} → ${key}`);
    }
    if (UNFINISHED.has(status)) drafts.push(`${file} → ${key} (${status})`);

    en[key] = enText;
    ru[key] = ruText;
  }
}

if (errors.length) {
  console.error("Ошибки:\n  " + errors.join("\n  "));
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const dump = (obj: Record<string, string>) => JSON.stringify(obj, null, 2) + "\n";
writeFileSync(join(OUT, "en.json"), dump(en));
writeFileSync(join(OUT, "ru.json"), dump(ru));

console.log(`Готово: ${Object.keys(en).length} ключей из ${files.length} файлов → i18n/dictionaries/{en,ru}.json`);
if (drafts.length) console.log(`\nЕщё не вычитано (${drafts.length}):\n  ${drafts.join("\n  ")}`);
if (ruFallback.length) console.log(`\nRU пустой, взят EN (${ruFallback.length}):\n  ${ruFallback.join("\n  ")}`);
