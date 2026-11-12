/**
 * Разбор текста Privacy Policy: content/texts/privacy-policy.md (выгрузка Google Doc в Markdown, источник
 * истины) → data/privacy-policy.ts.
 *
 *   npm run privacy:build
 *
 * Структура документа: **название документа** (на странице не используется — h1 «Privacy Policy» задан в PAGE_TITLE), «Effective date: …», вводный абзац, затем разделы **N\. Название**
 * с абзацами; раздел 14 («Organization Information and Contact Details») — блок контактов вне списка.
 * Экранирование Markdown (`\.`, `\:`) снимается, жёсткие переносы (два пробела) становятся «\n».
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Заголовок h1 страницы — постоянное значение (как в Figma); название документа в Google Doc («WorkChat Seattle Privacy Policy») не используется. */
const PAGE_TITLE = "Privacy Policy";

const root = process.cwd();
const md = readFileSync(join(root, "content/texts/privacy-policy.md"), "utf8");

const unescape = (s: string) => s.replace(/\\(.)/g, "$1");
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Section = { n: number; title: string; body: string[] };
let effectiveDate = "";
let intro = "";
const sections: Section[] = [];
let cur: Section | null = null;

for (const raw of md.trim().split(/\n\s*\n/)) {
  const block = raw.trim();
  const bold = block.match(/^\*\*([\s\S]+?)\*\*$/);
  if (bold) {
    const text = unescape(bold[1]).trim();
    const num = text.match(/^(\d+)\.\s+(.*)$/);
    if (num) {
      cur = { n: Number(num[1]), title: num[2], body: [] };
      sections.push(cur);
    }
    // иначе — название документа (первая строка), заменено на PAGE_TITLE
    continue;
  }
  const text = unescape(block.replace(/ {2}\n/g, "\n"));
  if (!effectiveDate && text.startsWith("Effective date")) effectiveDate = text;
  else if (!cur) intro = text;
  else cur.body.push(text);
}

const list = sections.filter((s) => s.n <= 13);
const contact = sections.find((s) => s.n === 14);
if (!effectiveDate || !intro || list.length !== 13 || !contact) {
  console.error("Разбор не удался: ожидались заголовок, дата, вводный абзац, 13 разделов и раздел 14.");
  process.exit(1);
}

const json = (v: unknown, pad: string) => JSON.stringify(v, null, 2).replace(/\n/g, `\n${pad}`);
const out = `/**
 * Privacy Policy (страница \`/privacy-policy\`, только на английском). ФАЙЛ СОБИРАЕТСЯ из
 * \`content/texts/privacy-policy.md\` (выгрузка Google Doc, источник истины) командой \`npm run privacy:build\`
 * (scripts/build-privacy.ts) — руками не править. Состав: заголовок, строка «Effective date», вводный абзац,
 * 13 разделов и блок контактов (раздел 14). Номера «1.» … «13.» — как в документе; ссылки (https://…, email)
 * оформляются при выводе.
 */
export type PolicySection = { id: string; title: string; body: string[] };

export const privacyPolicy: {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: PolicySection[];
  contact: { title: string; body: string[] };
} = {
  title: ${JSON.stringify(PAGE_TITLE)},
  effectiveDate: ${JSON.stringify(effectiveDate)},
  intro: ${JSON.stringify(intro)},
  sections: ${json(
    list.map((s) => ({ id: slug(s.title), title: `${s.n}. ${s.title}`, body: s.body })),
    "  ",
  )},
  contact: ${json({ title: contact.title, body: contact.body }, "  ")},
};
`;
writeFileSync(join(root, "data/privacy-policy.ts"), out);
console.log(`Готово: ${list.length} разделов + контакты → data/privacy-policy.ts`);
