import type { Dictionary, TextKey } from "@/i18n/dictionaries";
import { testimonials } from "@/data/testimonials";
import { TestimonialSlider } from "./testimonial-slider";

/**
 * Testimonials / «Our Stories» (Figma: testimonials `1088:1724`; tablet `1203:14497`, mobile `1110:10777`).
 * Заголовок: desktop от x=300, tablet со 2-й колонки, mobile от края; до ленты 60 / 40 / 40.
 * Отступ сверху между секциями 160 / 120 / 80. Лента выходит за правый край — секция обрезает по горизонтали.
 */
export function Testimonials({ t }: { t: Dictionary }) {
  const items = testimonials.map(({ id, photo }) => ({
    id,
    photo,
    lead: t[`home.testimonials.${id}.title` as TextKey],
    text: t[`home.testimonials.${id}.text` as TextKey],
    name: t[`home.testimonials.${id}.name` as TextKey],
  }));
  return (
    <section
      aria-labelledby="testimonials-title"
      className="mt-20 overflow-x-clip md:mt-30 xl:mt-40"
    >
      <div className="mx-auto max-w-300 px-5 md:px-10 xl:px-0">
        <h2 data-reveal id="testimonials-title" className="text-h2 text-text-heading md:pl-43 xl:pl-75">
          {t["home.testimonials.title"]}
        </h2>
        <div data-reveal className="mt-10 xl:mt-15">
          <TestimonialSlider
            items={items}
            readMore={t["home.testimonials.readMore"]}
            labels={{
              prev: t["a11y.prevSlide"],
              next: t["a11y.nextSlide"],
              slideN: t["a11y.slideN"],
            }}
          />
        </div>
      </div>
    </section>
  );
}
