import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Секция «Become a mentor» (Figma: mentor-form `1088:1738`; tablet `1240:15237`, mobile `1135:11418`). id="mentor-form" —
 * на неё ведут кнопки «Become a mentor» / «Share your expertise»; `scroll-mt` под шапку.
 * Карточка bg/card-neutral: desktop 1200 по контейнеру, содержимое 600 по центру (отступы 120 сверху / снизу), tablet и mobile —
 * на всю ширину экрана, содержимое с полями 40 / 20. Заголовок: tablet со 2-й колонки. Отступ сверху 160 / 120 / 80.
 * СЕЙЧАС тут только заголовок и текст: поля, согласие и кнопка (шаг 8 «Формы») встанут на место `children`.
 */
export function MentorFormSection({ t, children }: { t: Dictionary; children?: React.ReactNode }) {
  return (
    <section
      id="mentor-form"
      aria-labelledby="mentor-form-title"
      className="mt-20 scroll-mt-22 xl:scroll-mt-20 md:mt-30 xl:mx-auto xl:mt-40 xl:max-w-300"
    >
      <div className="bg-bg-card-neutral px-5 py-20 md:px-10 md:py-30 xl:px-75">
        <div className="flex flex-col gap-5 md:pl-43 xl:max-w-150 xl:pl-0">
          <h2 data-reveal id="mentor-form-title" className="text-h2 whitespace-pre-line text-text-heading">
            {t["mentorship.form.title"]}
          </h2>
          <p data-reveal className="text-body text-text-body">{t["mentorship.form.text"]}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
