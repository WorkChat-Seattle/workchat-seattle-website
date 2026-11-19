import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { datePath, locationPath, timePath } from "@/components/ui/glyphs";
import { events } from "@/data/events";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cityOf, eventShort, eventTitle, formatDate, formatTime, getEvent } from "@/lib/events";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.flatMap((lang) => events.map((e) => ({ lang, slug: e.slug })));
}

const dataUri = (path: string, mime: string) => `data:${mime};base64,${readFileSync(join(/*turbopackIgnore: true*/ process.cwd(), path)).toString("base64")}`;

const MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };
const imageMime = (path: string) => MIME[path.split(".").pop()?.toLowerCase() ?? ""] ?? "image/jpeg";

/** CSS `text-transform: capitalize` для английского названия (Title Case, как на сайте). */
const titleCase = (s: string) => s.replace(/(^|\s)(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());

/** Грубая оценка числа строк в колонке шириной `width` (средняя ширина знака Google Sans ≈ 0,52 кегля). */
const lines = (text: string, size: number, width = 480) => Math.max(1, Math.ceil((text.length * 0.52 * size) / width));

function Row({ path, text }: { path: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="30" height="30" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#4a4a4a" />
        <path d={path} fill="#ffffff" />
      </svg>
      <div style={{ fontSize: 22, lineHeight: 1.3, color: "#4a4a4a" }}>{text}</div>
    </div>
  );
}

/**
 * Превью события 1200×630 (docs/social-previews.md, og-event): слева текст на bg/card-neutral, справа обложка 600×630.
 * Колонка текста 480 от x=60, прижата к низу (низ 570), верх не выше 140. Не помещается — сначала название 44, затем описание 20.
 * Генерируется при сборке (force-static); шрифт — подмножество Google Sans Regular (app/fonts, OFL).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const event = getEvent(slug);
  if (!hasLocale(lang) || !event) return new Response("Not found", { status: 404 });
  const t = await getDictionary(lang);

  const title = lang === "en" ? titleCase(eventTitle(event, lang)) : eventTitle(event, lang);
  const description = eventShort(event, lang);
  const time = formatTime(event.start, event.end, lang);
  const place = event.format === "Online" || !event.address ? (event.placeName ?? t["format.Online"]) : (event.placeName ?? cityOf(event.address) ?? t["format.Online"]);

  // 430 = от верха 140 до низа 570; детали 3×30 + 2×12 = 114 (без строки времени — 2×30 + 12 = 72); отступы 20 и 40
  const details = time ? 114 : 72;
  const height = (titleSize: number, descSize: number) =>
    lines(title, titleSize) * titleSize * 0.9 + 20 + lines(description, descSize) * descSize * 1.3 + 40 + details;
  let titleSize = 56;
  let descSize = 22;
  if (height(titleSize, descSize) > 430) titleSize = 44;
  if (height(titleSize, descSize) > 430) descSize = 20;

  const font = readFileSync(join(process.cwd(), "app/fonts/GoogleSans-Regular-og.ttf"));
  const logo = readFileSync(join(process.cwd(), "public/images/ui/logo.svg"), "utf8").replaceAll("currentColor", "#323232");
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  // тип — по расширению: обложки бывают и JPG, и PNG (PNG под видом JPEG ломает сборку: RangeError в DataView)
  const cover = event.cover ? dataUri(`public${event.cover}`, imageMime(event.cover)) : null;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", fontFamily: "Google Sans", background: "#f5f3f1" }}>
        <div style={{ width: 600, height: 630, position: "relative", display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={183} height={60} alt="" style={{ position: "absolute", left: 60, top: 60 }} />
          <div style={{ position: "absolute", left: 60, bottom: 60, width: 480, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: titleSize, lineHeight: 0.9, letterSpacing: -0.03 * titleSize, color: "#323232" }}>{title}</div>
            <div style={{ marginTop: 20, fontSize: descSize, lineHeight: 1.3, color: "#4a4a4a" }}>{description}</div>
            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
              <Row path={datePath} text={formatDate(event.start, lang)} />
              {time ? <Row path={timePath} text={time} /> : null}
              <Row path={locationPath} text={place} />
            </div>
          </div>
        </div>
        <div style={{ width: 600, height: 630, display: "flex", background: "#edeae6" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {cover ? <img src={cover} width={600} height={630} alt="" style={{ objectFit: "cover" }} /> : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Google Sans", data: font, weight: 400, style: "normal" }] },
  );
}
