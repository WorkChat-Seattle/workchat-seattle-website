import type { InputHTMLAttributes } from "react";

const field =
  "w-full border border-transparent bg-bg-input px-4 text-body text-text-heading outline-none placeholder:text-text-placeholder hover:border-border-input-hover focus:border-border-input-focus aria-[invalid=true]:border-status-error";

/** Сообщение об ошибке под полем — в потоке, не налезает на следующее поле (CLAUDE.md, «Состояния отправки форм»). */
export function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-body text-status-error">
      {children}
    </p>
  );
}

type Common = { id: string; label: string; error?: string };

/**
 * Текстовое поле (Figma: form-field type=text `1017:1449`, option=white): высота 48, отступ 16, плейсхолдер = вопрос.
 * Видимая подпись — плейсхолдер, для скринридера — `<label class="sr-only">` с тем же текстом.
 * Состояния: hover / focus — обводка border/input-hover / input-focus, error — status/error + текст ниже.
 */
export function TextField({
  id,
  label,
  error,
  value,
  onChange,
  ...rest
}: Common & { value: string; onChange: (v: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${field} h-12`}
        {...rest}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

/** Многострочное поле (Figma: form-textarea `1017:1470`): высота 120, отступы 16 / 12. */
export function TextArea({
  id,
  label,
  error,
  value,
  onChange,
  maxLength,
}: Common & { value: string; onChange: (v: string) => void; maxLength?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${field} block min-h-30 resize-y py-3`}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}
