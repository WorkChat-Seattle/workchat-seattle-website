import { FaqItem } from "@/components/ui/faq-item";
import { privacyPolicy } from "@/data/privacy-policy";
import { autoLink } from "@/lib/rich";

/**
 * Privacy Policy (Figma: кадры `1457:23154` mobile, `1457:23047` tablet, `1457:22619` desktop).
 * header → intro → 13 разделов на faq-item (первый открыт, остальные закрыты, независимо) → контакты
 * (раздел 14, всегда виден) → footer. Тексты — data/privacy-policy.ts (из Google Doc).
 * Колонка заголовка, вводного текста и контактов: desktop от x=300 (ширина 600), tablet со 2-й колонки
 * (172, ширина 516), mobile на всю ширину. Список: desktop 900 от x=150, tablet и mobile на всю ширину.
 * Отступы: сверху 60 / 60 / 40 после шапки, заголовок→текст 40 / 20 / 20, intro→список 40, список→контакты 80
 * (40 + padding контактов 40), снизу 160 / 120 / 80.
 */
export function PrivacyPolicy() {
  const { title, effectiveDate, intro, sections, contact } = privacyPolicy;
  const column = "md:pl-43 xl:pl-75";
  return (
    <section className="mx-auto mt-10 mb-20 flex max-w-300 flex-col gap-10 px-5 md:mt-15 md:mb-30 md:px-10 xl:mb-40 xl:px-0">
      <div className={column}>
        <div className="xl:max-w-150">
          <h1 data-reveal="now" className="text-h2 text-text-heading">{title}</h1>
          <div data-reveal="now" className="mt-5 xl:mt-10">
            <p className="text-caption text-text-body">{effectiveDate}</p>
            <p className="text-body mt-5 text-text-body">{intro}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border-divider xl:ml-37.5 xl:w-225">
        {sections.map((s, i) => (
          <FaqItem key={s.id} question={s.title} defaultOpen={i === 0}>
            {s.body.map((p, j) => (
              <p key={j} className="whitespace-pre-line xl:max-w-150">
                {autoLink(p)}
              </p>
            ))}
          </FaqItem>
        ))}
      </div>

      <div data-reveal className={`${column} mt-10`}>
        <div className="xl:max-w-150">
          <h2 className="text-h3 text-text-heading">{contact.title}</h2>
          <div className="mt-5 flex flex-col gap-5 text-body text-text-body xl:mt-10">
            {contact.body.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {autoLink(p)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
