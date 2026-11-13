/**
 * Менторы (Notion → Mentor cards). ФАЙЛ СОБИРАЕТСЯ командой `npm run sync:mentors` (scripts/sync-mentors.ts) — руками не править.
 * Только записи со статусом Ready / Published и с Consent received; порядок — Order.
 */
export type Mentor = {
  slug: string;
  name: string;
  position: string;
  company: string;
  industry: string[];
  expertise: string[];
  bio: string;
  bioRu: string | null;
  photo: string | null;
  linkedin: string | null;
  facebook: string | null;
  website: string | null;
  email: string | null;
  order: number;
};

export const mentors: Mentor[] = [
  {
    "slug": "liudmila-gishman",
    "name": "Liudmila Gishman",
    "position": "Senior Technical Program Manager",
    "company": "Google",
    "industry": [
      "Technology"
    ],
    "expertise": [
      "Burnout prevention",
      "Emotional regulation"
    ],
    "bio": "I am a Senior Technical Program Manager at Google and a coach for tech professionals who want to grow in their careers without burnout.\n\nWith 15 years in tech across program management and quality engineering, I’ve worked in diverse sectors including video calling, news regulation, travel, and e-commerce. My career has been built on collaborating with cross-functional teams across multiple continents and time zones, including navigating both role and team transitions during my time at Google.\n\nHere are the topics I can help you with:\n- Burnout Prevention & Stress Management\n- Career Clarity & Growth\n- Imposter Syndrome & Confidence\n- Sustainable Productivity & Energy Management\n- Habit Optimization to support your well-being",
    "bioRu": "Людмила Гишман —  Senior Technical Program Manager в Google, а также коуч для IT-специалистов, которые хотят расти в карьере без выгорания. За 15 лет в IT она работала в управлении программами и в QA, в самых разных направлениях: видеосвязь, регулирование новостного контента, путешествия и электронная коммерция. Её карьера построена на работе с кросс-функциональными командами на разных континентах и в разных часовых поясах. В Google ей довелось пройти и через смену роли, и через переход в другую команду.\n\nС чем Людмила может помочь:\n- профилактика выгорания и управление стрессом\n- ясность в карьере и профессиональный рост\n- синдром самозванца и уверенность в себе\n- продуктивность без перегрузки и управление энергией\n- полезные привычки для хорошего самочувствия",
    "photo": "/images/mentors/mentor-liudmila-gishman.jpg",
    "linkedin": "https://www.linkedin.com/in/liudmila-gishman/",
    "facebook": "https://www.facebook.com/ludmila.gisman",
    "website": null,
    "email": "mila.gishman@gmail.com",
    "order": 1
  },
  {
    "slug": "tatyana-yakushev",
    "name": "Tatyana Yakushev",
    "position": "Principal Software Architect",
    "company": "Microsoft",
    "industry": [
      "Technology"
    ],
    "expertise": [
      "Software Engineering"
    ],
    "bio": "I am a Principal Software Architect at Microsoft with deep expertise in data, AI, and large‑scale analytics systems. Previously I've worked at Amazon, Tableau and a startup. I've switched between software engineer and manager roles multiple times.\n\nBesides running \"Practicing AI Together\" group, I am starting a group mentoring sessions for experienced female software engineers focused on helping more women reach principal/staff level.",
    "bioRu": "Татьяна Якушева — ведущий архитектор программного обеспечения с более чем 25-летним опытом в разработке программных продуктов и управлении инженерными командами как в крупнейших технологических компаниях, так и в стартапах. Татьяна разрабатывает решения на основе искусственного интеллекта в команде Azure Data в Microsoft, помогая людям и компаниям раскрывать потенциал своих данных.\n\nТатьяна с удовольствием делится своим опытом, выступает в роли ментора и проводит практические воркшопы «Practicing AI Together», вдохновляя женщин осваивать техническую сферу и смелее ставить перед собой амбициозные карьерные цели.",
    "photo": "/images/mentors/mentor-tatyana-yakushev.jpg",
    "linkedin": "https://www.linkedin.com/in/tatyanay/",
    "facebook": "https://www.facebook.com/tatyana.yakushev",
    "website": null,
    "email": "mtanya@gmail.com",
    "order": 2
  }
];
