"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveConsent, useConsent } from "@/lib/consent";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** Минимум типов Google Maps JS API (пакет @types/google.maps не ставим). */
type LatLng = { lat(): number; lng(): number };
type MapsApi = {
  importLibrary(name: "maps"): Promise<{ Map: new (el: HTMLElement, o: object) => { setCenter(c: LatLng): void } }>;
  importLibrary(name: "marker"): Promise<{ Marker: new (o: object) => unknown }>;
  importLibrary(name: "geocoding"): Promise<{
    Geocoder: new () => { geocode(r: { address: string }): Promise<{ results: { geometry: { location: LatLng } }[] }> };
  }>;
};
type GoogleWindow = Window & { google?: { maps?: MapsApi }; __wcMapsReady?: () => void };

let loader: Promise<MapsApi> | null = null;
function loadMaps(key: string, lang: string): Promise<MapsApi> {
  if (loader) return loader;
  loader = new Promise<MapsApi>((resolve, reject) => {
    const w = window as GoogleWindow;
    w.__wcMapsReady = () => (w.google?.maps ? resolve(w.google.maps) : reject(new Error("maps")));
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&language=${lang}&loading=async&callback=__wcMapsReady`;
    s.async = true;
    s.onerror = () => reject(new Error("maps"));
    document.head.appendChild(s);
  });
  loader.catch(() => {
    loader = null;
  });
  return loader;
}

/**
 * Карта события (Figma: map-embed `1457:23600`; 300 desktop, 304 tablet, 350 mobile — по ширине колонки).
 * - HTML с сервера и до решения по cookies — статичная картинка (без запросов к Google).
 * - Embedded content включён и есть ключ — поверх картинки интерактивная Google Maps (JS API), адрес ищется Geocoder-ом.
 * - Embedded content выключен (или GPC) — картинка + заглушка «The map is provided by Google…» и «Show map»,
 *   кнопка включает Embedded content.
 * - Нет ключа Google Maps (заглушка до запуска) — только картинка.
 */
export function EventMap({
  image,
  address,
  name,
  lang,
  labels,
}: {
  image: StaticImageData | null;
  address: string;
  name: string;
  lang: string;
  labels: { text: string; button: string };
}) {
  const { ready, choice } = useConsent();
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const wantsLive = ready && choice.embedded && Boolean(MAPS_KEY);

  useEffect(() => {
    if (!wantsLive || !MAPS_KEY || !ref.current) return;
    let cancelled = false;
    const el = ref.current;
    (async () => {
      try {
        const g = await loadMaps(MAPS_KEY, lang);
        const [{ Map }, { Marker }, { Geocoder }] = await Promise.all([
          g.importLibrary("maps"),
          g.importLibrary("marker"),
          g.importLibrary("geocoding"),
        ]);
        const { results } = await new Geocoder().geocode({ address: address.replace(/\s*\n\s*/g, ", ") });
        if (cancelled || !results[0]) return;
        const position = results[0].geometry.location;
        const map = new Map(el, {
          center: position,
          zoom: 15,
          gestureHandling: "cooperative",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        new Marker({ map, position, title: name });
        setLive(true);
      } catch {
        // карта не загрузилась — остаётся статичная картинка
      }
    })();
    return () => {
      cancelled = true;
      setLive(false);
      el.replaceChildren();
    };
  }, [wantsLive, address, name, lang]);

  const showConsent = ready && !choice.embedded;

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-bg-card-muted md:w-76 xl:w-75">
      {image ? (
        <Image src={image} alt="" sizes="(min-width: 768px) 304px, 350px" className="absolute inset-0 size-full object-cover" />
      ) : null}
      <div
        ref={ref}
        role="region"
        aria-label={name}
        className={`absolute inset-0 ${live ? "" : "invisible"}`}
      />
      {showConsent ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 bg-bg-glass p-5">
          <p className="text-body text-text-body">{labels.text}</p>
          <Button option="dark" onClick={() => saveConsent({ ...choice, embedded: true })} className="w-full">
            {labels.button}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
