import type { AnchorHTMLAttributes } from "react";
import { facebookPath, linkedinPath } from "./glyphs";

export type Network = "linkedin" | "facebook";

const paths: Record<Network, string> = {
  linkedin: linkedinPath,
  facebook: facebookPath,
};

/**
 * Круглая кнопка-ссылка на соцсеть (Figma: button-social `1003:8087`, 50×50).
 * Default: тёмный круг, светлый глиф. Hover: белый круг, тёмный глиф.
 * Открывается в новой вкладке; `label` — подпись для скринридера.
 */
export function ButtonSocial({
  network,
  href,
  label,
  className,
  ...rest
}: {
  network: Network;
  href: string;
  label: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={["group inline-flex shrink-0 rounded-full", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <svg className="size-12.5" viewBox="0 0 50 50" aria-hidden="true">
        <circle
          cx="25"
          cy="25"
          r="25"
          className="fill-button-dark group-hover:fill-button-white group-focus-visible:fill-button-white"
        />
        <path
          d={paths[network]}
          className="fill-button-text-light group-hover:fill-button-dark group-focus-visible:fill-button-dark"
        />
      </svg>
    </a>
  );
}
