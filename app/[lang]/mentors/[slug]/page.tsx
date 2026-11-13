import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MentorProfile } from "@/components/mentorship/mentor-profile";
import { GetInvolved } from "@/components/sections/get-involved";
import { Subscribe } from "@/components/sections/subscribe";
import { ButtonLink } from "@/components/ui/button";
import { hasLocale, locales, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { allMentors, getMentor, mentorBio, mentorRole } from "@/lib/mentors";

export function generateStaticParams() {
  return locales.flatMap((lang) => allMentors().map((m) => ({ lang, slug: m.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/mentors/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const mentor = getMentor(slug);
  if (!hasLocale(lang) || !mentor) return {};
  // Заглушка: настоящие title / description / превью и JSON-LD ProfilePage — шаг 10.
  return { title: `${mentor.name} — WorkChat Seattle`, description: `${mentorRole(mentor)}. ${mentorBio(mentor, lang)}`.slice(0, 200) };
}

/**
 * Mentor info (Figma: 390 `1145:11990`, 768 `1240:15965`, 1440 `1003:4640`): header → профиль → «Back to all mentors» → подписка → «Как помочь».
 * Профиль сверху 40 / 60 / как у других страниц (после шапки); до «Back» 80 (desktop) / 40; кнопка по центру (desktop 300, tablet по тексту, mobile на всю ширину).
 * Данные — только из карточки ментора (data/mentors.ts); у кого нет Consent received, страницы нет (404).
 */
export default async function Page({ params }: PageProps<"/[lang]/mentors/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const mentor = getMentor(slug);
  if (!mentor) notFound();
  const t = await getDictionary(lang);

  return (
    <>
      <section className="mx-auto mt-10 max-w-300 px-5 md:mt-15 md:px-10 xl:px-0">
        <MentorProfile mentor={mentor} lang={lang} t={t} />
        <div className="mt-10 flex flex-col md:items-center xl:mt-20">
          <ButtonLink href={localePath(lang, "/mentorship")} option="dark" className="w-full md:w-fit xl:w-75">
            {t["mentorInfo.back"]}
          </ButtonLink>
        </div>
      </section>
      <div className="mt-20 md:mt-30 xl:mt-40">
        <Subscribe lang={lang} t={t} />
      </div>
      <GetInvolved lang={lang} t={t} />
    </>
  );
}
