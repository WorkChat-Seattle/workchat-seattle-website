import Image from "next/image";
import type { ReactNode } from "react";
import checked from "@/public/images/forms/checkbox-checked.svg";

/**
 * Чекбокс (Figma: checkbox-consent `1442:22081`): нативный `<input type="checkbox">` с `<label>`; рамка 20×20 button/outline,
 * в отмеченном состоянии — квадрат button/dark с галочкой (SVG из Figma). Подпись 16 / 130%, отступ 20. Фокус с клавиатуры виден обводкой.
 * `ariaDisabled` — вариант без `disabled`: остаётся в порядке табуляции, но не переключается (лимит 5 тем).
 * Клик по ссылке внутри подписи открывает ссылку и не переключает чекбокс.
 */
export function Checkbox({
  id,
  name,
  checked: isChecked,
  onChange,
  ariaDisabled,
  invalid,
  required,
  describedBy,
  className,
  children,
}: {
  id: string;
  name?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaDisabled?: boolean;
  invalid?: boolean;
  /** Обязательный (согласие): `required` + `aria-required`. */
  required?: boolean;
  describedBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={[
        "flex items-start gap-5 text-body text-text-body",
        ariaDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative size-5 shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={isChecked}
          aria-disabled={ariaDisabled || undefined}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            if (!ariaDisabled) onChange(e.target.checked);
          }}
          className="peer absolute inset-0 size-full cursor-[inherit] opacity-0"
        />
        <span
          aria-hidden="true"
          className={[
            "absolute inset-0 border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-decor-accent",
            invalid ? "border-status-error" : "border-button-outline",
          ].join(" ")}
        />
        <Image src={checked} alt="" width={20} height={20} className="pointer-events-none absolute inset-0 hidden peer-checked:block" />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}
