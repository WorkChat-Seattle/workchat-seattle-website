"use client";

import type { ReactNode } from "react";
import { MenuAction } from "@/components/ui/menu-button";
import { openCookieSettings } from "@/lib/consent";

/** «Cookie Settings» в футере: открывает окно настроек (docs/cookie-consent.md). */
export function CookieSettingsButton({ children }: { children: ReactNode }) {
  return <MenuAction onClick={openCookieSettings}>{children}</MenuAction>;
}
