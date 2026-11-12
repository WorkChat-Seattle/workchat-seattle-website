/**
 * Разовая выгрузка исходных картинок из Figma для загрузки в Notion: оригинал заливки узла (без обрезки под макет, максимальное
 * разрешение), JPG качества 95. Для людей — квадрат по обрезке, как в макете (аватар 1:1), из исходника в полном разрешении.
 * Папка design-assets/notion-upload/ в git не попадает (.gitignore). Запуск: npx tsx --env-file=.env.local scripts/export-notion-upload.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const KEY = "PRALafbEv1Nz9J0GRcw7sa";
const H = { "X-Figma-Token": process.env.FIGMA_TOKEN ?? "" };
const OUT = join(process.cwd(), "design-assets/notion-upload");
mkdirSync(OUT, { recursive: true });

// slug / имя → узел с заливкой; kind: cover — оригинал целиком, person — квадрат по обрезке макета
const items: { name: string; node: string; kind: "cover" | "person" }[] = [
  { name: "how-ai-is-changing-professions-and-recruiting", node: "1003:5185", kind: "cover" },
  { name: "from-qa-automation-to-ai-engineer", node: "1491:27744", kind: "cover" },
  { name: "workchat-community-meet-up", node: "1491:27991", kind: "cover" },
  { name: "career-longevity-navigating-stress", node: "1491:28238", kind: "cover" },
  { name: "iamremarkable-workshop", node: "1552:18467", kind: "cover" },
  { name: "margarita-kostikova", node: "I1047:7280;1010:1335;1009:1303", kind: "person" },
  { name: "natalia-vasileva", node: "I1047:7294;1010:1335;1009:1303", kind: "person" },
  { name: "elena-perfilyeva", node: "I1491:27753;1010:1335;1009:1303", kind: "person" },
  { name: "natalya-masyago", node: "I1552:18802;1010:1335;1009:1303", kind: "person" },
  { name: "liudmila-gishman", node: "I1491:28247;1010:1335;1009:1303", kind: "person" },
  { name: "tatyana-yakushev", node: "I1047:7123;1010:1311;1009:1303", kind: "person" },
];

async function main() {
  const urls = ((await (await fetch(`https://api.figma.com/v1/files/${KEY}/images`, { headers: H })).json()) as { meta: { images: Record<string, string> } }).meta.images;
  for (const it of items) {
    const r = await fetch(`https://api.figma.com/v1/files/${KEY}/nodes?ids=${encodeURIComponent(it.node)}&depth=1`, { headers: H });
    const doc = ((await r.json()) as { nodes: Record<string, { document: { fills?: { type: string; imageRef?: string; visible?: boolean; scaleMode?: string; imageTransform?: number[][] }[] } } | null> }).nodes[it.node]?.document;
    const fill = doc?.fills?.find((f) => f.type === "IMAGE" && f.visible !== false);
    if (!fill?.imageRef) {
      console.log(`✗ ${it.name}: у узла ${it.node} нет заливки-картинки`);
      continue;
    }
    const raw = Buffer.from(await (await fetch(urls[fill.imageRef])).arrayBuffer());
    const meta = await sharp(raw).metadata();
    const W = meta.width ?? 0;
    const Hh = meta.height ?? 0;
    let img = sharp(raw);
    let note = "оригинал";
    if (it.kind === "person") {
      const t = fill.scaleMode === "STRETCH" ? fill.imageTransform : undefined;
      let box = { left: 0, top: 0, width: W, height: Hh };
      if (t) box = { left: Math.round(t[0][2] * W), top: Math.round(t[1][2] * Hh), width: Math.round(t[0][0] * W), height: Math.round(t[1][1] * Hh) };
      // квадрат: меньшая сторона, по центру выбранной области
      const side = Math.min(box.width, box.height);
      box = { left: box.left + Math.round((box.width - side) / 2), top: box.top + Math.round((box.height - side) / 2), width: side, height: side };
      img = img.extract(box);
      note = `квадрат ${side}×${side} из исходника ${W}×${Hh}`;
    }
    const file = `${it.name}.jpg`;
    await img.jpeg({ quality: 95 }).toFile(join(OUT, file));
    const m = await sharp(join(OUT, file)).metadata();
    console.log(`✓ ${file}  ${m.width}×${m.height}  (${note})`);
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
