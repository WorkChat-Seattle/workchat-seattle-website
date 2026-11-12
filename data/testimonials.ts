import type { StaticImageData } from "next/image";
import kristina from "@/public/images/home/testimonial-kristina.jpg";

/**
 * Отзывы на Home (Figma: testimonials `1088:1724`). Тексты — словарь: home.testimonials.<id>.title | text | name.
 * В таблице пока один отзыв (Кристина); слайдер рассчитан на несколько. Новые отзывы — только из таблицы.
 */
export const testimonials: { id: "kristina"; photo: StaticImageData }[] = [{ id: "kristina", photo: kristina }];
