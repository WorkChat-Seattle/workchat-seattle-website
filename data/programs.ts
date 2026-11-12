import type { StaticImageData } from "next/image";
import adplist from "@/public/images/mentorship/logo-adplist.png";
import upwardly from "@/public/images/mentorship/logo-upwardly-global.svg";

/**
 * Внешние программы менторства (Mentorship, programs `1088:1740`). Тексты — словарь: mentorship.programs.<id>.tags | text | price.
 * `name` — название организации (имя собственное, подпись логотипа); `href` — сайт программы (кнопка «Explore program»).
 * Адреса — официальные сайты организаций; подтвердить перед запуском.
 */
export const programs: { id: "upwardly" | "adplist"; name: string; logo: StaticImageData; href: string }[] = [
  { id: "upwardly", name: "Upwardly Global", logo: upwardly, href: "https://upwardlyglobal.org/" },
  { id: "adplist", name: "ADPList", logo: adplist, href: "https://adplist.org/" },
];
