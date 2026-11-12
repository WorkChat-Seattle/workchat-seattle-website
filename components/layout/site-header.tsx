"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { IconMenu } from "@/components/ui/icon-menu";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { Logo } from "@/components/ui/logo";
import { MenuButton } from "@/components/ui/menu-button";
import { type Locale, localePath } from "@/i18n/config";
import { DONATE_URL, SITE_NAME } from "@/lib/constants";

export type HeaderLabels = {
  about: string;
  events: string;
  mentorship: string;
  volunteer: string;
  donate: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  /** a11y.navMain — подпись <nav aria-label={labels.navMain}>. */
  navMain: string;
  /** a11y.newTab — пометка у внешней ссылки Donate. */
  newTab: string;
};

/** Путь без языкового префикса: «/ru/events» → «/events», «/ru» → «/». */
function stripLocale(pathname: string): string {
  const rest = pathname.replace(/^\/ru(?=\/|$)/, "");
  return rest === "" ? "/" : rest;
}

const isSection = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

/**
 * Шапка (Figma: header `1084:10369`) и открытое мобильное меню (mobile-menu `1298:12443`).
 * Бургер на mobile и tablet, десктопная шапка — с 1280. Меню — полноэкранный слой под
 * шапкой: тот же бургер превращается в крестик. Фокус не покидает шапку и меню,
 * прокрутка страницы заблокирована, закрытие — Esc, повторное нажатие, переход по ссылке
 * или рост окна до 1280; после закрытия фокус на бургере.
 * Если позже на шапку добавится backdrop-filter (animations.md, п. 6), размытие делать
 * на отдельном слое-подложке, иначе fixed-меню станет «приклеено» к шапке.
 */
export function SiteHeader({
  lang,
  labels,
  switchPath,
}: {
  lang: Locale;
  labels: HeaderLabels;
  /** Куда ведёт переключатель EN / RU; по умолчанию — та же страница (на 404 — главная). */
  switchPath?: string;
}) {
  const pathname = usePathname();
  const path = stripLocale(pathname);
  // Меню открыто, пока страница та же, на которой его открыли: переход по ссылке закрывает его.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (value: boolean) => setOpenedAt(value ? pathname : null);
  const menuId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const items = [
    { href: "/about", label: labels.about, current: isSection(path, "/about") },
    { href: "/events", label: labels.events, current: isSection(path, "/events") },
    {
      href: "/mentorship",
      label: labels.mentorship,
      current: isSection(path, "/mentorship") || isSection(path, "/mentors"),
    },
  ];

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) burgerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenedAt(null);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const focusable = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpenedAt(null);
    mq.addEventListener("change", onChange);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header ref={rootRef} className="sticky top-0 z-50">
      <div className="mx-auto flex max-w-300 items-center justify-between px-5 pt-5 md:px-10 xl:px-0 xl:pb-5">
        <Link href={localePath(lang, "/")} aria-label={SITE_NAME} className="shrink-0">
          <Logo title={SITE_NAME} />
        </Link>

        {/* Desktop */}
        <div className="hidden w-225 items-center justify-between xl:flex">
          <nav aria-label={labels.navMain}>
            <ul className="flex items-center gap-12">
              {items.map((item) => (
                <li key={item.href} className="flex">
                  <MenuButton href={localePath(lang, item.href)} current={item.current}>
                    {item.label}
                  </MenuButton>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitch current={lang} path={switchPath ?? path} label={labels.language} />
          <div className="flex items-center gap-2.5">
            <ButtonLink option="white" href={localePath(lang, "/volunteer")}>
              {labels.volunteer}
            </ButtonLink>
            <ButtonLink option="dark" href={DONATE_URL} newTabLabel={labels.newTab}>
              {labels.donate}
            </ButtonLink>
          </div>
        </div>

        {/* Mobile / tablet */}
        <IconMenu
          ref={burgerRef}
          expanded={open}
          controls={menuId}
          label={open ? labels.closeMenu : labels.openMenu}
          onClick={() => setOpen(!open)}
          className="xl:hidden"
        />
      </div>

      <div
        id={menuId}
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close(true);
        }}
        className="fixed inset-0 -z-10 overflow-y-auto bg-bg-page px-5 pt-16.25 md:px-10 xl:hidden"
      >
        <div className="flex flex-col gap-10 pt-10 pb-5 md:gap-15 md:pb-10">
          <nav aria-label={labels.navMain}>
            <ul className="flex flex-col gap-1.5">
              {items.map((item) => (
                <li key={item.href} className="flex">
                  <MenuButton href={localePath(lang, item.href)} current={item.current} size="large">
                    {item.label}
                  </MenuButton>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-5 py-10 md:py-5">
            <ButtonLink option="white" href={localePath(lang, "/volunteer")} className="w-full md:w-60">
              {labels.volunteer}
            </ButtonLink>
            <ButtonLink option="dark" href={DONATE_URL} newTabLabel={labels.newTab} className="w-full md:w-60">
              {labels.donate}
            </ButtonLink>
          </div>
          <LanguageSwitch current={lang} path={switchPath ?? path} label={labels.language} />
        </div>
      </div>
    </header>
  );
}
