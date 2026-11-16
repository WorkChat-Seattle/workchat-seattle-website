import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, isIndexableHost } from "@/lib/seo";

/**
 * robots.txt (docs/seo-ai-visibility.md, п. 2): всех ботов, включая ботов для обучения моделей (решение 11.11), пускаем,
 * кроме /api/, только когда сайт открыт на workchatseattle.org (решено 16.11); на *.vercel.app и любых других адресах — запрет.
 * Решение по заголовку Host на каждый запрос (маршрут динамический); для страниц то же делает proxy.ts (X-Robots-Tag).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  if (!isIndexableHost(h.get("x-forwarded-host") ?? h.get("host"))) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
