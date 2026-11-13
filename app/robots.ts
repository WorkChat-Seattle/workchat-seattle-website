import type { MetadataRoute } from "next";
import { SITE_URL, isProduction } from "@/lib/seo";

/**
 * robots.txt (docs/seo-ai-visibility.md, п. 2): на боевом деплое пускаем всех ботов, включая ботов для обучения моделей
 * (решение 11.11), кроме /api/; на превью-деплоях индексация запрещена.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
