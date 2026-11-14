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
 * Обязательность берётся из подписи в таблице текстов: у обязательных полей она заканчивается « *» (неразрывный пробел + звёздочка).
 * Возвращает подпись без звёздочки (для скринридера) и признак обязательности (`required` + `aria-required`).
 */
export function parseRequired(label: string): { text: string; required: boolean } {
  const m = label.match(/^([\s\S]*?)[\s\u00A0]*\*\s*$/);
  return m ? { text: m[1], required: true } : { text: label, required: false };
}

/** Видимая подпись-плейсхолдер: звёздочка в `aria-hidden` — скринридеру хватает атрибута `required`. */
export function PlaceholderText({ label }: { label: string }) {
  const { text, required } = parseRequired(label);
  return (
    <>
      {text}
      {required ? <span aria-hidden="true">{"\u00A0*"}</span> : null}
    </>
  );
}

/** Строка перед полями формы («* Fields marked with an asterisk are required»): ведущая звёздочка скрыта от скринридеров. */
export function RequiredNote({ children }: { children: string }) {
  const star = children.startsWith("*");
  return (
    <p className="text-body text-text-muted">
      {star ? <span aria-hidden="true">*</span> : null}
      {star ? children.slice(1) : children}
    </p>
  );
}

/**
 * Текстовое поле (Figma: form-field type=text `1017:1449`, option=white): высота 48, отступ 16, плейсхолдер = вопрос.
 * Видимая подпись — наш плейсхолдер (`aria-hidden`), для скринридера — `<label class="sr-only">` с тем же текстом без звёздочки;
 * обязательное поле (подпись заканчивается « *») получает `required` и `aria-required="true"`.
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
  const { text, required } = parseRequired(label);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {text}
      </label>
      <div className="relative">
        {/* плейсхолдер рисуем сами (placeholder=" " нужен для :placeholder-shown): так звёздочка может быть aria-hidden */}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${field} peer h-12`}
          {...rest}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 left-4.25 flex items-center text-body text-text-placeholder peer-not-placeholder-shown:hidden"
        >
          <span className="truncate">
            <PlaceholderText label={label} />
          </span>
        </span>
      </div>
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
  const { text, required } = parseRequired(label);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {text}
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          maxLength={maxLength}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${field} peer block min-h-30 resize-y py-3`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.25 right-4 left-4.25 text-body text-text-placeholder peer-not-placeholder-shown:hidden"
        >
          <PlaceholderText label={label} />
        </span>
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}
