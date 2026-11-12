import { FaqItem } from "@/components/ui/faq-item";
import { aboutFaq } from "@/data/faq";
import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import { autoLink } from "@/lib/rich";

/**
 * FAQ (Figma: faq `1088:1728`; tablet `1240:14933`, mobile `1113:11093`).
 * Заголовок: desktop от x=300, tablet со 2-й колонки, mobile от края; до списка 60 / 40 / 40. Список: desktop 900 от x=150,
 * сверху линия border/divider; первый вопрос открыт. Адреса и email в ответах — ссылками. Отступ сверху 160 / 120 / 80.
 */
export function AboutFaq({ t }: { t: Dictionary }) {
  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto mt-20 max-w-300 px-5 md:mt-30 md:px-10 xl:mt-40 xl:px-0"
    >
      <h2 id="faq-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
        {t["about.faq.title"]}
      </h2>
      <div className="mt-10 border-t border-border-divider xl:mt-15 xl:ml-37.5 xl:w-225">
        {aboutFaq.map((id, i) => (
          <FaqItem key={id} question={t[`about.faq.${id}.q` as TextKey]} defaultOpen={i === 0}>
            <p className="whitespace-pre-line xl:max-w-150">{autoLink(t[`about.faq.${id}.a` as TextKey])}</p>
          </FaqItem>
        ))}
      </div>
    </section>
  );
}
