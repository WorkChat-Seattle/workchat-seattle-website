import "server-only";
import type { EventItem } from "@/data/events";
import type { Mentor } from "@/data/mentors";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { FACEBOOK_URL, FORMS_TO_EMAIL, LINKEDIN_URL } from "./constants";
import { eventShort, eventTitle, isPast } from "./events";
import { mentorBio } from "./mentors";
import { ORG_ID, SITE_NAME, SITE_URL, WEBSITE_ID, absoluteUrl, assetUrl } from "./seo";

/** Organization (NGO) + WebSite — в корневом layout, на всех страницах (п. 6.1). */
export function organizationGraph(t: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo.png`,
        description: t["seo.home.description"],
        email: FORMS_TO_EMAIL,
        foundingDate: "2018",
        nonprofitStatus: "https://schema.org/Nonprofit501c3",
        areaServed: { "@type": "Place", name: "Seattle metropolitan area, Washington, USA" },
        sameAs: [FACEBOOK_URL, LINKEDIN_URL],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: ["en", "ru"],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

const LANGUAGE_CODES: Record<string, string> = { English: "en", Russian: "ru" };

/** Адрес из Notion («улица, suite…\nГород, ШТ ZIP») → PostalAddress. */
function postalAddress(address: string) {
  const lines = address.split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines.length > 1 ? lines[lines.length - 1] : "";
  const m = last.match(/^(.+?),\s*([A-Z]{2})\s*(\d{5})?/);
  return {
    "@type": "PostalAddress",
    streetAddress: (m ? lines.slice(0, -1) : lines).join(", "),
    ...(m ? { addressLocality: m[1], addressRegion: m[2], ...(m[3] ? { postalCode: m[3] } : {}) } : {}),
    addressCountry: "US",
  };
}

const noMs = (iso: string) => iso.replace(/\.\d+/, "");

/** Event (п. 6.2). Прошедшие размечаем так же, но без offers. */
export function eventJsonLd(e: EventItem, lang: Locale) {
  const url = absoluteUrl(lang, `/events/${e.slug}`);
  const online = e.format === "Online" || !e.address;
  const virtual = { "@type": "VirtualLocation", url };
  const place = e.address
    ? {
        "@type": "Place",
        name: e.placeName ?? undefined,
        address: postalAddress(e.address),
        ...(e.lat !== null && e.lng !== null ? { geo: { "@type": "GeoCoordinates", latitude: e.lat, longitude: e.lng } } : {}),
      }
    : null;
  const past = isPast(e);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventTitle(e, lang),
    description: eventShort(e, lang),
    url,
    ...(e.cover ? { image: [assetUrl(e.cover)] } : {}),
    startDate: noMs(e.start),
    ...(e.end ? { endDate: noMs(e.end) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      e.format === "Hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : online
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location: e.format === "Hybrid" && place ? [place, virtual] : online ? virtual : place,
    organizer: { "@id": ORG_ID },
    ...(e.speakers.length
      ? {
          performer: e.speakers.map((s) => ({
            "@type": "Person",
            name: s.name,
            ...(s.linkedin ? { sameAs: s.linkedin } : {}),
          })),
        }
      : {}),
    ...(!past && e.registrationLink
      ? { offers: { "@type": "Offer", url: e.registrationLink, availability: "https://schema.org/InStock" } }
      : {}),
    ...(LANGUAGE_CODES[e.language] ? { inLanguage: LANGUAGE_CODES[e.language] } : {}),
  };
}

/** ProfilePage с Person (п. 6.3). */
export function mentorJsonLd(m: Mentor, lang: Locale) {
  const url = absoluteUrl(lang, `/mentors/${m.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    inLanguage: lang,
    mainEntity: {
      "@type": "Person",
      name: m.name,
      description: mentorBio(m, lang),
      ...(m.position ? { jobTitle: m.position } : {}),
      ...(m.company ? { worksFor: { "@type": "Organization", name: m.company } } : {}),
      ...(m.photo ? { image: assetUrl(m.photo) } : {}),
      ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
    },
  };
}
