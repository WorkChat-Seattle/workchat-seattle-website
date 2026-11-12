import type { StaticImageData } from "next/image";
import kristina from "@/public/images/home/testimonial-kristina.jpg";
import natalia from "@/public/images/home/testimonial-natalia.jpg";
import yana from "@/public/images/home/testimonial-yana.jpg";

/**
 * Отзывы на Home (Figma: testimonials `1088:1724`, остальные карточки — секция `1819:24757`).
 * Тексты — словарь: home.testimonials.<id>.title | text | name. Порядок: Кристина, Наталья, Яна.
 * Новые отзывы — только из таблицы.
 */
export const testimonials: { id: "kristina" | "natalia" | "yana"; photo: StaticImageData }[] = [
  { id: "kristina", photo: kristina },
  { id: "natalia", photo: natalia },
  { id: "yana", photo: yana },
];
