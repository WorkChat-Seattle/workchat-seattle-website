import { FaqItem } from "@/components/ui/faq-item";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import { autoLink } from "@/lib/rich";

/**
 * Секция FAQ (About `1088:1728`, Mentorship `1088:1739`): заголовок и список faq-item. Вопросы и ответы — словарь:
 * `<prefix>.<id>.q` и `<prefix>.<id>.a`, порядок — по `ids`; заголовок — `<prefix>.title`.
 * Заголовок: desktop от x=300, tablet со 2-й колонки, mobile от края; до списка 60 / 40 / 40. Список: desktop 900 от x=150,
 * сверху линия border/divider; первый вопрос открыт. Адреса и email в ответах — ссылками. Отступ сверху 160 / 120 / 80.
 */
export function FaqSection({
  t,
  prefix,
  ids,
}: {
  t: Dictionary;
  prefix: "about.faq" | "mentorship.faq";
  ids: readonly string[];
}) {
  const titleId = `${prefix.replace(".", "-")}-title`;
  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <h2 data-reveal id={titleId} className="text-h2 text-text-heading md:pl-43 xl:pl-75">
        {t[`${prefix}.title` as TextKey]}
      </h2>
      <div className="mt-10 border-t border-border-divider xl:mt-15 xl:ml-37.5 xl:w-225">
        {ids.map((id, i) => (
          <FaqItem key={id} question={t[`${prefix}.${id}.q` as TextKey]} defaultOpen={i === 0}>
            <p className="whitespace-pre-line xl:max-w-150">{autoLink(t[`${prefix}.${id}.a` as TextKey], undefined, t["a11y.newTab"])}</p>
          </FaqItem>
        ))}
      </div>
    </section>
  );
}
