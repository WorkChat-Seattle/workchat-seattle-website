import type { AnchorHTMLAttributes } from "react";
import { emailPath, facebookPath, linkedinPath } from "./glyphs";

export type Network = "linkedin" | "facebook" | "email";

const paths: Record<Network, string> = {
  linkedin: linkedinPath,
  facebook: facebookPath,
  email: emailPath,
};

/**
 * Круглая кнопка-ссылка на соцсеть (Figma: button-social `1003:8087`, 50×50).
 * Тёмный круг, светлый глиф. Hover / focus: цвета не меняются (в макете hover = default), только увеличение scale(1.1)
 * за 350 ms (`--social-scale`); при prefers-reduced-motion — без анимации.
 * linkedin / facebook — внешние ссылки в новой вкладке; `label` — подпись для скринридера (a11y.linkedin / a11y.facebook), к ней добавляется `newTabLabel` (a11y.newTab).
 * email — `mailto:` в той же вкладке, без `newTabLabel`; подпись — a11y.emailUs.
 */
export function ButtonSocial({
  network,
  href,
  label,
  newTabLabel,
  className,
  ...rest
}: {
  network: Network;
  href: string;
  label: string;
  /** a11y.newTab — добавляется к подписи (ссылка открывается в новой вкладке). */
  newTabLabel?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const external = network !== "email";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={external && newTabLabel ? `${label} ${newTabLabel}` : label}
      className={["inline-flex shrink-0 rounded-full transition-transform duration-(--duration-card-scale) ease-card motion-reduce:transition-none motion-safe:hover:scale-(--social-scale) motion-safe:focus-visible:scale-(--social-scale)", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <svg className="size-12.5" viewBox="0 0 50 50" aria-hidden="true">
        <circle
          cx="25"
          cy="25"
          r="25"
          className="fill-button-dark"
        />
        <path
          d={paths[network]}
          transform={network === "email" ? "translate(16 17.8)" : undefined}
          className="fill-button-text-light"
        />
      </svg>
    </a>
  );
}
