import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Секция формы волонтёра (Figma: volunteer-form `1088:1734`; tablet `1240:15726`, mobile `1145:11841`). id="volunteer-form".
 * Карточка bg/card-neutral: desktop 1200 по контейнеру, содержимое 600 по центру; tablet и mobile — на всю ширину.
 * Отступ сверху 160 / 120 / 80. СЕЙЧАС тут только заголовок и подпись: поля, согласие и кнопка (шаг 8 «Формы») встанут на место `children`.
 */
export function VolunteerFormSection({ t, children }: { t: Dictionary; children?: React.ReactNode }) {
  return (
    <section
      id="volunteer-form"
      aria-labelledby="volunteer-form-title"
      className="mt-20 scroll-mt-22 md:mt-30 xl:mx-auto xl:mt-40 xl:max-w-300"
    >
      <div className="bg-bg-card-neutral px-5 py-20 md:px-10 md:py-30 xl:px-75">
        <div className="flex flex-col gap-5 md:pl-43 xl:max-w-130 xl:pl-0">
          <h2 data-reveal id="volunteer-form-title" className="text-h2 text-text-heading">
            {t["volunteer.form.title"]}
          </h2>
          <p data-reveal className="text-body text-text-body">{t["volunteer.form.text"]}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
