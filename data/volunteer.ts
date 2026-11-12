import type { StaticImageData } from "next/image";
import p1d from "@/public/images/volunteer/volunteer-photo-1-desktop.jpg";
import p1t from "@/public/images/volunteer/volunteer-photo-1-tablet.jpg";
import p1m from "@/public/images/volunteer/volunteer-photo-1-mobile.jpg";
import p2d from "@/public/images/volunteer/volunteer-photo-2-desktop.jpg";
import p2t from "@/public/images/volunteer/volunteer-photo-2-tablet.jpg";
import p2m from "@/public/images/volunteer/volunteer-photo-2-mobile.jpg";
import p3d from "@/public/images/volunteer/volunteer-photo-3-desktop.jpg";
import p3t from "@/public/images/volunteer/volunteer-photo-3-tablet.jpg";
import p3m from "@/public/images/volunteer/volunteer-photo-3-mobile.jpg";
import p4d from "@/public/images/volunteer/volunteer-photo-4-desktop.jpg";
import p4t from "@/public/images/volunteer/volunteer-photo-4-tablet.jpg";
import p4m from "@/public/images/volunteer/volunteer-photo-4-mobile.jpg";

/**
 * Волонтёрские роли (Volunteer, volunteer-roles `1088:1733`): 8 карточек-ролей (тексты — словарь volunteer.roles.<id>.title | text) и
 * 4 фото. В HTML порядок как на mobile; на tablet и desktop он меняется стилями (components/volunteer/roles.module.css).
 * `tone` — фон карточки (neutral → bg/card-neutral, dark → bg/card-dark).
 */
export type Role = { kind: "role"; id: string; tone: "neutral" | "dark" };
export type Photo = {
  kind: "photo";
  id: string;
  images: { mobile: StaticImageData; tablet: StaticImageData; desktop: StaticImageData };
};

const photo = (n: number, mobile: StaticImageData, tablet: StaticImageData, desktop: StaticImageData): Photo => ({
  kind: "photo",
  id: `photo${n}`,
  images: { mobile, tablet, desktop },
});

export const volunteerTiles: (Role | Photo)[] = [
  photo(1, p1m, p1t, p1d),
  { kind: "role", id: "speak", tone: "dark" },
  { kind: "role", id: "events", tone: "neutral" },
  { kind: "role", id: "operations", tone: "neutral" },
  { kind: "role", id: "resources", tone: "neutral" },
  { kind: "role", id: "connect", tone: "dark" },
  photo(2, p2m, p2t, p2d),
  { kind: "role", id: "programs", tone: "dark" },
  photo(3, p3m, p3t, p3d),
  { kind: "role", id: "mentor", tone: "dark" },
  { kind: "role", id: "stories", tone: "neutral" },
  photo(4, p4m, p4t, p4d),
];
