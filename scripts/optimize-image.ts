/**
 * Оптимизация картинок событий и спикеров при `npm run sync:events` (решено 24.11).
 * Оригиналы в Notion бывают тяжёлыми (PNG 1600×1200 ≈ 2.4 МБ), а в public/images должно лежать то, что идёт на сайт:
 * фото — JPG (CLAUDE.md, «Правила вёрстки», п. 6), не шире 2048 px (2× от самой широкой карточки с запасом; самая широкая из прежних обложек — 2048).
 * - JPG до 2048 px по ширине и до 600 КБ — как есть (байт в байт; так лежат все прежние обложки);
 * - остальное без заметной прозрачности — JPG, ширина до 2048 px, качество 85 (mozjpeg, прогрессивный), без метаданных;
 * - с заметной прозрачностью (> 1 % пикселей не полностью непрозрачны) — PNG той же ширины, остальное заливается белым (решено 24.11).
 * Дальше сжимает next/image (WebP/AVIF). Результат детерминирован: тот же файл в Notion — те же байты, без лишних изменений в git.
 */
import sharp from "sharp";

export const MAX_WIDTH = 2048;
const KEEP_JPEG_BYTES = 600 * 1024;
const JPEG_QUALITY = 85;
const MAX_ALPHA_SHARE = 0.01;

/** Доля пикселей с альфой < 255. */
async function alphaShare(input: Buffer): Promise<number> {
  const alpha = await sharp(input, { failOn: "none" }).ensureAlpha().extractChannel("alpha").raw().toBuffer();
  let translucent = 0;
  for (const a of alpha) if (a < 255) translucent++;
  return alpha.length ? translucent / alpha.length : 0;
}

export async function optimizeImage(input: Buffer, srcExt: string): Promise<{ data: Buffer; ext: string }> {
  const img = sharp(input, { failOn: "none" });
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  if (meta.format === "jpeg" && width <= MAX_WIDTH && input.length <= KEEP_JPEG_BYTES) {
    return { data: input, ext: srcExt === ".jpeg" ? ".jpeg" : ".jpg" };
  }
  if (meta.format === "svg" || meta.format === "gif") return { data: input, ext: srcExt };
  const opaque = !meta.hasAlpha || (await alphaShare(input)) <= MAX_ALPHA_SHARE;
  const resized = sharp(input, { failOn: "none" }).autoOrient().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (opaque) {
    const data = await resized.flatten({ background: "#ffffff" }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    return { data, ext: ".jpg" };
  }
  const data = await resized.png({ compressionLevel: 9 }).toBuffer();
  return { data, ext: ".png" };
}
