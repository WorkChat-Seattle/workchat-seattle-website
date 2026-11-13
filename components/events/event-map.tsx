"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveConsent, useConsent } from "@/lib/consent";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** Минимум типов Google Maps JS API (пакет @types/google.maps не ставим). */
type MapsApi = {
  importLibrary(name: "maps"): Promise<{ Map: new (el: HTMLElement, o: object) => unknown }>;
  importLibrary(name: "marker"): Promise<{ Marker: new (o: object) => unknown }>;
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
 * Координаты приходят с событием (считаются при `npm run sync:events`), в браузере нужен только Maps JavaScript API.
 * - HTML с сервера и до решения по cookies — статичная картинка (без запросов к Google).
 * - Embedded content включён, есть ключ и координаты — поверх картинки интерактивная карта с маркером.
 * - Embedded content выключен (или GPC) и карту вообще можно показать — картинка (или нейтральный фон) + заглушка и «Show map».
 * - Карту показать нельзя (нет ключа или координат) и нет картинки — блока нет: адрес и ссылка «Open in Google Maps» уже в колонке рядом.
 * - Нет ключа или координат, но есть картинка — только картинка, без заглушки (кнопка ничего бы не включила).
 */
export function EventMap({
  image,
  lat,
  lng,
  name,
  lang,
  labels,
}: {
  image: StaticImageData | null;
  lat: number | null;
  lng: number | null;
  name: string;
  lang: string;
  labels: { text: string; button: string };
}) {
  const { ready, choice } = useConsent();
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const canLoad = Boolean(MAPS_KEY) && lat !== null && lng !== null;
  const wantsLive = ready && choice.embedded && canLoad && !failed;

  useEffect(() => {
    if (!wantsLive || !MAPS_KEY || !ref.current || lat === null || lng === null) return;
    let cancelled = false;
    const el = ref.current;
    (async () => {
      try {
        const g = await loadMaps(MAPS_KEY, lang);
        const [{ Map }, { Marker }] = await Promise.all([g.importLibrary("maps"), g.importLibrary("marker")]);
        if (cancelled) return;
        const position = { lat, lng };
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
        if (!cancelled) setFailed(true); // карта не загрузилась — статичная картинка или пустое место
      }
    })();
    return () => {
      cancelled = true;
      setLive(false);
      el.replaceChildren();
    };
  }, [wantsLive, lat, lng, name, lang]);

  // нечего показывать: нет картинки, и интерактивная карта невозможна (нет ключа / координат / не загрузилась)
  if (!image && (!canLoad || failed)) return null;
  const showConsent = ready && !choice.embedded && canLoad;

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-bg-card-muted md:w-76 xl:w-75">
      {image ? (
        <Image src={image} alt="" sizes="(min-width: 768px) 304px, 350px" className="absolute inset-0 size-full object-cover" />
      ) : null}
      <div ref={ref} role="region" aria-label={name} className={`absolute inset-0 ${live ? "" : "invisible"}`} />
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
