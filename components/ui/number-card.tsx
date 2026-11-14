export type NumberCardOption = "light" | "neutral" | "muted";

const option: Record<NumberCardOption, string> = {
  light: "bg-bg-card-light",
  neutral: "bg-bg-card-neutral",
  muted: "bg-bg-card-muted",
};

/**
 * Карточка с цифрой (Figma: number-card `1075:3170`, option light | neutral | muted — три близких тона).
 * desktop 300×210, padding 36; tablet 172×172 и mobile 175×175, padding 20. Число — стиль numbers, не переносится (пробел внутри — неразрывный),
 * подпись — caption (капслок); подпись прижата к низу.
 */
export function NumberCard({
  option: opt,
  value,
  label,
  className,
}: {
  option: NumberCardOption;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex aspect-square flex-col justify-between p-5 xl:aspect-auto xl:h-52.5 xl:p-9",
        option[opt],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-numbers whitespace-nowrap text-text-heading">{value.replace(/ /g, "\u00A0")}</p>
      <p className="text-caption text-text-body">{label}</p>
    </div>
  );
}
