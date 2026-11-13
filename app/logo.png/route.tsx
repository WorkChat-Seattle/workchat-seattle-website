import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/**
 * Квадратный логотип 512×512 для JSON-LD Organization (`logo`, docs/seo-ai-visibility.md, п. 6.1; Google просит от 112×112):
 * логотип из public/images/ui/logo.svg на фоне bg/page.
 */
export function GET() {
  const svg = readFileSync(join(process.cwd(), "public/images/ui/logo.svg"), "utf8").replaceAll("currentColor", "#323232");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#edeae6" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={400} height={131} alt="" />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
