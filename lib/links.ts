/**
 * Правило сайта (CLAUDE.md, «Правила вёрстки», п. 4): внешние http(s)-ссылки (не наш домен) и все `mailto:` открываются
 * в новой вкладке — `target="_blank" rel="noopener noreferrer"`; внутренние (`/…`, `/ru/…`, `#якорь`, наш домен) — в той же.
 * Любую ссылку на адрес из данных / текстов рендерить через `SmartLink` (components/ui/smart-link.tsx) или, если у ссылки
 * своя разметка, брать `externalProps(href)`, а не писать `target` руками.
 */
const OWN_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://workchatseattle.org").replace(/\/$/, "");

/** Ссылка на другой сайт: http(s) не с нашего домена. */
export function isExternalHttp(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).origin !== new URL(OWN_ORIGIN).origin;
  } catch {
    return true;
  }
}

export const isMailto = (href: string): boolean => /^mailto:/i.test(href);

/** Нужна ли новая вкладка: внешний http(s) или mailto. */
export const opensInNewTab = (href: string): boolean => isExternalHttp(href) || isMailto(href);

/** Подпись a11y.newTab нужна только у внешних http(s): у mailto вкладка может не открыться (почта в приложении). */
export const needsNewTabLabel = (href: string): boolean => isExternalHttp(href);

/** Атрибуты для `<a>` по адресу; у внутренних ссылок — пустой объект. */
export function externalProps(href: string): { target?: "_blank"; rel?: string } {
  return opensInNewTab(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/** Не относится к внутренним переходам next/link: http(s), mailto, tel. */
export const isPlainAnchor = (href: string): boolean => /^(https?:|mailto:|tel:)/i.test(href);
