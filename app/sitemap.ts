import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { allMentors } from "@/lib/mentors";
import { alternates } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo";
import { locales } from "@/i18n/config";

/**
 * Карта сайта (docs/seo-ai-visibility.md, п. 3): каждая страница в EN и RU с hreflang; Privacy Policy — только EN.
 * События (все, и предстоящие, и прошедшие) и менторы с согласием — из файлов данных (они уже отфильтрованы sync-скриптами).
 * lastModified у статичных страниц — дата сборки; у событий и менторов не указываем: времени изменения записи в данных нет.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const paths = ["/", "/about", "/mentorship", "/volunteer", "/events"];
  const entry = (path: string, lastModified?: Date) =>
    locales.map((lang) => ({
      url: absoluteUrl(lang, path),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages: alternates(lang, path).languages as Record<string, string> },
    }));

  return [
    ...paths.flatMap((p) => entry(p, built)),
    { url: absoluteUrl("en", "/privacy-policy"), lastModified: built },
    ...events.flatMap((e) => entry(`/events/${e.slug}`)),
    ...allMentors().flatMap((m) => entry(`/mentors/${m.slug}`)),
  ];
}
