/**
 * Favicon для сайта из оригиналов design-assets/favicon/ (выгрузка `npm run export:figma`,
 * секция Figma «Favicon» 1474:27269). Запуск: `npm run favicon:build`.
 *
 * Собирает (Next.js подключает файлы из app/ сам, <link> вручную не нужен):
 *  - app/favicon.ico  — PNG 16, 32, 48 внутри одного ICO (старые браузеры, Google в выдаче);
 *  - app/icon.svg     — тёмная иконка; в тёмной теме браузера — светлая (как favicon-32-dark);
 *  - app/apple-icon.png — 180×180 на фоне bg/page (экран «Домой» на iPhone).
 * Без зависимостей: ICO с PNG внутри — заголовок + каталог + PNG как есть.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const src = (f: string) => join(root, "design-assets/favicon", f);
const out = (f: string) => join(root, "app", f);

// --- favicon.ico ---
const sizes = [16, 32, 48];
const pngs = sizes.map((s) => readFileSync(src(`favicon-${s}.png`)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);
const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + dir.length;
pngs.forEach((png, i) => {
  const s = sizes[i];
  const e = i * 16;
  dir.writeUInt8(s >= 256 ? 0 : s, e); // width
  dir.writeUInt8(s >= 256 ? 0 : s, e + 1); // height
  dir.writeUInt8(0, e + 2); // palette
  dir.writeUInt8(0, e + 3); // reserved
  dir.writeUInt16LE(1, e + 4); // color planes
  dir.writeUInt16LE(32, e + 6); // bits per pixel
  dir.writeUInt32LE(png.length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(out("favicon.ico"), Buffer.concat([header, dir, ...pngs]));

// --- icon.svg: цвет из favicon-32 (тёмный) и favicon-32-dark (светлый) ---
const light = readFileSync(src("favicon-32.svg"), "utf8");
const darkFill = readFileSync(src("favicon-32-dark.svg"), "utf8").match(/fill="(#[0-9a-fA-F]{6})"/g)?.pop()?.slice(6, -1);
const lightFill = light.match(/fill="(#[0-9a-fA-F]{6})"/g)?.pop()?.slice(6, -1);
if (!lightFill || !darkFill) throw new Error("favicon-32(.dark).svg: не найден цвет заливки");
const svg = light
  .replace(/<g clip-path="[^"]*">|<\/g>|<defs>[\s\S]*?<\/defs>/g, "")
  .replace(new RegExp(`fill="${lightFill}"`, "g"), 'class="mark"')
  .replace(
    /(<svg[^>]*>)/,
    `$1\n<style>.mark{fill:${lightFill}}@media (prefers-color-scheme:dark){.mark{fill:${darkFill}}}</style>`,
  )
  .replace(/\n\s*\n/g, "\n");
writeFileSync(out("icon.svg"), svg);

// --- apple-icon.png ---
writeFileSync(out("apple-icon.png"), readFileSync(src("apple-icon-180.png")));

console.log("✓ app/favicon.ico (16, 32, 48), app/icon.svg, app/apple-icon.png");
