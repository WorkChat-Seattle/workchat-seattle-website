/**
 * События (Notion → Event listings, Speakers). ФАЙЛ СОБИРАЕТСЯ командой `npm run sync:events` (scripts/sync-events.ts) — руками не править.
 * Только записи со статусом Ready / Published; спикеры — только с Consent received. Время — ISO с поясом (America/Los_Angeles).
 */
export type Run = { text: string; bold?: boolean; italic?: boolean; href?: string };
export type Block = { type: "p"; runs: Run[] } | { type: "ul"; items: Run[][] };
export type Speaker = {
  id: string;
  name: string;
  position: string;
  company: string;
  bio: string;
  bioRu: string;
  photo: string | null;
  linkedin: string | null;
  website: string | null;
};
export type EventItem = {
  slug: string;
  title: string;
  titleRu: string | null;
  start: string;
  end: string | null;
  language: string;
  format: "In person" | "Online" | "Hybrid" | "";
  placeName: string | null;
  address: string | null;
  /** Координаты адреса для карты (считаются при sync, см. scripts/sync-events.ts). */
  lat: number | null;
  lng: number | null;
  mapsLink: string | null;
  registrationLink: string | null;
  /** Ссылка на подключение (Zoom и т. п.): есть — кнопка Join вместо Register. */
  joinLink: string | null;
  recordingLink: string | null;
  tags: string[];
  short: string;
  shortRu: string | null;
  description: Block[];
  descriptionRu: Block[];
  cover: string | null;
  speakers: Speaker[];
};

export const events: EventItem[] = [
  {
    "slug": "career-proof-yourself-linkedin-positioning",
    "title": "Career-Proof Yourself: LinkedIn Positioning",
    "titleRu": "Позиционирование в LinkedIn",
    "start": "2026-06-01T20:00:00.000+00:00",
    "end": "2026-06-01T21:30:00.000+00:00",
    "language": "Russian",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": null,
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Personal Brand",
      "Job Search"
    ],
    "short": "Learn how to position yourself on LinkedIn to future-proof your career",
    "shortRu": "Узнайте, как позиционировать себя в LinkedIn, чтобы ваша карьера выдержала любые перемены.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "A free 90-minute live session to help job seekers, career changers, and business owners show up on LinkedIn in a way that actually attracts the right opportunities. Hosted by career strategist Oksana Willeke."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "What you'll take away:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "the VALUE LinkedIn headline formula — the framework Oksana uses with clients that doubles their profile search results — plus an AI prompt to tailor it to your role;"
            }
          ],
          [
            {
              "text": "a stronger headline, optimized live during the session;"
            }
          ],
          [
            {
              "text": "outreach templates that work;"
            }
          ],
          [
            {
              "text": "a career resilience strategy designed for today's unpredictable market;"
            }
          ],
          [
            {
              "text": "honest, encouraging feedback from peers and from Oksana;"
            }
          ],
          [
            {
              "text": "new connections made in breakout rooms."
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Whether you're actively job searching, pivoting careers, or building a business, you'll leave with something tangible to act on immediately. Come as you are, with your LinkedIn profile link and resume handy."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Бесплатная 90-минутная онлайн-встреча для тех, кто ищет работу, меняет карьеру или развивает бизнес: как представить себя в LinkedIn так, чтобы возможности приходили к вам сами. Ведущая — карьерный стратег Оксана Виллеке."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Что вы унесёте с собой:\n• формулу заголовка LinkedIn VALUE. Оксана работает по этой методике с клиентами, и их профили вдвое чаще показываются в поиске. Вы получите AI-промпт, чтобы адаптировать формулу под вашу роль;\n• свой, более сильный заголовок, доработанный прямо на встрече;\n• проверенные шаблоны сообщений для нетворкинга;\n• стратегию карьерной устойчивости для сегодняшнего непредсказуемого рынка;\n• честную и поддерживающую обратную связь от участников и от Оксаны;\n• новые знакомства в небольшой группе."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Вы уйдёте с конкретными применимыми шагами по позиционированию в LinkedIn. Специальной подготовки не нужно — вам понадобится только ссылка на ваш профиль LinkedIn и резюме."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-career-proof-yourself-linkedin-positioning.jpg",
    "speakers": [
      {
        "id": "oxana-willeke",
        "name": "Oxana Willeke",
        "position": "Founder & Executive Career Coach",
        "company": "Oxana Willeke Coaching",
        "bio": "Oxana Willeke is the founder of Oxana Willeke Coaching and an executive career strategist and communication coach for senior tech, corporate and international professionals, named Influence Digest's Top Career Coach in Seattle for 2025. She brings 8+ years in partner and project management, 12+ years of public speaking and 3 years of recruiting to her work on LinkedIn optimization, resumes, interview preparation, job search strategy and AI-powered job search tools.",
        "bioRu": "Оксана Виллеке — основательница Oxana Willeke Coaching, карьерный стратег и коуч по коммуникации для руководителей и специалистов из IT и корпораций, в том числе международных; лучший карьерный коуч Сиэтла 2025 года по версии Influence Digest. Опирается на более чем 8 лет в управлении партнёрствами и проектами, более 12 лет публичных выступлений и 3 года в рекрутинге: оптимизация LinkedIn, резюме, подготовка к интервью, стратегия поиска работы и AI-инструменты для поиска работы.",
        "photo": "/images/events/speaker-oxana-willeke.jpg",
        "linkedin": "https://www.linkedin.com/in/oksanawilleke/",
        "website": "https://oxanawillekecoaching.com"
      }
    ]
  },
  {
    "slug": "ai-for-non-techies-yuliana-loginova",
    "title": "AI for Non-Techies",
    "titleRu": "AI для гуманитариев",
    "start": "2026-06-14T16:30:00.000+00:00",
    "end": "2026-06-14T18:00:00.000+00:00",
    "language": "Russian",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": null,
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Hands-on AI"
    ],
    "short": "AI for the rest of us: a conversation with Yuliana Loginova on using AI in marketing, communications, and other non-technical roles",
    "shortRu": "Обсуждение искусственного интеллекта для гуманитариев с Юлианой Логиновой.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "An online discussion of how to use AI if you're “not a software engineer at all.”"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Our guest, Yuliana Loginova (Moscow), is a former TNT producer and CMO with about 100 launches behind her, and has run her own agency since 2018. Marketers used to cost her agency 120–150 thousand rubles a month for analytics, ideas, content, and project management. Today, AI handles part of that work for about $100 a month."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Join us to learn how modern AI tools can be useful in the humanities, discuss practical examples, and ask the expert your questions."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Онлайн-встреча о том, как использовать AI, если вы «совсем не программист»."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Гостья — Юлиана Логинова (Москва): экс-продюсер ТНТ, CMO, около 100 запусков, владелица собственного агентства с 2018 года. Раньше маркетологи обходились её агентству в 120–150 тысяч рублей в месяц — аналитика, идеи, контент и ведение проектов. Сейчас часть этих задач выполняет ИИ за $100 в месяц."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Присоединяйтесь, чтобы узнать, как современные технологии искусственного интеллекта могут быть полезны в гуманитарной сфере, обсудить практические примеры и задать вопросы эксперту."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-ai-for-non-techies-yuliana-loginova.jpg",
    "speakers": [
      {
        "id": "yuliana-loginova",
        "name": "Yuliana Loginova",
        "position": "CMO, Agency Owner",
        "company": "",
        "bio": "Yuliana Loginova is a former TNT producer and CMO with about 100 launches behind her. Based in Moscow, she has run her own marketing agency since 2018.",
        "bioRu": "Юлиана Логинова — экс-продюсер ТНТ и CMO, около 100 запусков. Живёт в Москве, с 2018 года владеет собственным маркетинговым агентством.",
        "photo": "/images/events/speaker-yuliana-loginova.jpg",
        "linkedin": null,
        "website": "https://juliana-loginova.ru/"
      }
    ]
  },
  {
    "slug": "career-longevity-navigating-stress",
    "title": "Career Longevity: Navigating Stress in the Corporate World",
    "titleRu": "Карьерное долголетие и стресс",
    "start": "2026-07-08T18:30:00.000-07:00",
    "end": "2026-07-08T20:00:00.000-07:00",
    "language": "English",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": null,
    "joinLink": null,
    "recordingLink": "https://www.facebook.com/share/v/18t97DM18F/",
    "tags": [
      "Well-Being"
    ],
    "short": "A one-hour webinar on managing workplace stress and preventing burnout. Identify your key stressors and discover strategies to protect your energy.",
    "shortRu": "Часовой вебинар о том, как справляться со стрессом на работе и не доводить себя до выгорания.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Today's corporate landscape demands non-stop adaptation, driving unprecedented levels of mental fatigue and exhaustion. In the long term, such an environment is a direct precursor to burnout, which is simply an expected biological reaction to a continuous sprint."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "To achieve true career longevity, we have to look past generic advice and understand the actual architecture of our own nervous system. Join us for an exclusive, science-backed 1-hour webinar designed specifically for those who want to regain control of their energy, protect their mental clarity, and design a sustainable path forward."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Inside the session:"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "We are skipping the generic \"drink more water and meditate\" advice (though it's still useful, so please keep doing it!). Instead, we will analyze stress through a data-driven, strategic lens:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "The Neurobiology of Stress: exactly what happens in your brain and body when stressors appear, and why you can't just \"think\" your way out of physical exhaustion."
            }
          ],
          [
            {
              "text": "The Corporate Stress Assessment: a proprietary framework and assessment tool to help you precisely measure the psychological factors driving your current stress levels at work."
            }
          ],
          [
            {
              "text": "Strategic Brainstorming: a collaborative session where we will map out actionable, real-world tactics to minimize workplace stress and protect your mental bandwidth."
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Zoom live webinar. Please turn on your camera and take part in the discussion — we want to hear from you! Duration: 1 hour + 30 minutes of open Q&A."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Will this webinar be helpful if I don't work in a corporation? Yes — we will be talking about the science of stress, and it applies to every human being."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Давайте честно: современная работа устроена так, что расслабиться в ней некогда. Всё постоянно меняется — задачи, команды, инструменты, правила игры. И мы всё время подстраиваемся, перестраиваемся, догоняем. Неудивительно, что к вечеру голова гудит, а к пятнице хочется лечь и не вставать."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Если так жить долго, рано или поздно случается выгорание. И это не слабость и не «что-то со мной не так». Это нормальная реакция живого организма на ненормальные условия. Нельзя бежать спринт годами — даже очень тренированный бегун однажды упадёт."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Чтобы работать долго и не сгореть, мало знать общие правила. Нужно понимать, как устроена наша собственная нервная система — что её истощает и что помогает восстановиться. Об этом и поговорим на часовом вебинаре. Без эзотерики, с опорой на науку. Он для тех, кто хочет вернуть себе силы, сохранить ясную голову и найти такой ритм, в котором можно жить, а не выживать."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "О чём будем говорить"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Советов «пейте воду и медитируйте» не будет. Хотя они правда полезные, так что пейте и медитируйте, пожалуйста! Но мы пойдём дальше и посмотрим на стресс практично:"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "- Что происходит с нами при стрессе. Как реагируют мозг и тело, когда на нас что-то наваливается. И почему с физическим истощением не справиться усилием воли — уговорить себя «не уставать» просто не получится.\n- Откуда берётся ваш стресс. Я поделюсь авторской методикой и инструментом, которые помогут разобраться, что именно в вашей работе выматывает вас сильнее всего.\n- Что с этим делать. Вместе подумаем и соберём конкретные, рабочие способы снизить стресс и сберечь силы — то, что можно начать применять уже завтра."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Язык встречи — английский."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-career-longevity-navigating-stress.jpg",
    "speakers": [
      {
        "id": "liudmila-gishman",
        "name": "Liudmila Gishman",
        "position": "Senior Technical Program Manager",
        "company": "Google",
        "bio": "I am a Senior Technical Program Manager at Google and a coach for tech professionals who want to grow in their careers without burnout.\n\nWith 15 years in tech across program management and quality engineering, I’ve worked in diverse sectors including video calling, news regulation, travel, and e-commerce. My career has been built on collaborating with cross-functional teams across multiple continents and time zones, including navigating both role and team transitions during my time at Google.",
        "bioRu": "Людмила Гишман —  Senior Technical Program Manager в Google, а также коуч для IT-специалистов, которые хотят расти в карьере без выгорания. За 15 лет в IT она работала в управлении программами и в QA, в самых разных направлениях: видеосвязь, регулирование новостного контента, путешествия и электронная коммерция. Её карьера построена на работе с кросс-функциональными командами на разных континентах и в разных часовых поясах. В Google ей довелось пройти и через смену роли, и через переход в другую команду.",
        "photo": "/images/events/speaker-liudmila-gishman.jpg",
        "linkedin": "https://www.linkedin.com/in/liudmila-gishman/",
        "website": null
      }
    ]
  },
  {
    "slug": "workchat-community-meet-up",
    "title": "WorkChat community meet-up",
    "titleRu": "Встреча группы",
    "start": "2026-09-05T11:00:00.000-07:00",
    "end": "2026-09-05T13:00:00.000-07:00",
    "language": "Russian",
    "format": "In person",
    "placeName": "Plaza at North Creek",
    "address": "19015 N Creek Pkwy, Ste 105\nBothell, WA 98011",
    "lat": 47.7654183,
    "lng": -122.1856664,
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=19015+N+Creek+Pkwy+Ste+105+Bothell+WA+98011",
    "registrationLink": null,
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Networking"
    ],
    "short": "Join us for an in-person meetup focused on work, careers, and professional growth.",
    "shortRu": "Приходите на живую встречу с уклоном в работу, карьеру и профессиональное развитие.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Come to an in-person meetup focused on work, careers, and professional growth."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Let's talk about what you do, share experiences, hear interesting stories, and maybe discuss new opportunities."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "If you'd like to speak and share your experience — about your profession, your business, or your career path — please send the organizer a direct message."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "The meetup is a potluck: feel free to bring something tasty and non-alcoholic drinks. We'll chat, get to know each other, and enjoy a warm, friendly atmosphere."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "See you there!"
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Приходите на живую встречу с уклоном в работу, карьеру и профессиональное развитие. Хочется поговорить о том, чем вы занимаетесь, обменяться опытом, познакомиться с интересными историями и, возможно, обсудить новые возможности."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Формат встречи — Potluck: можете принести с собой что-нибудь вкусное и безалкогольные напитки. Будем общаться, знакомиться и наслаждаться приятной атмосферой. До встречи!"
          }
        ]
      }
    ],
    "cover": "/images/events/cover-workchat-community-meet-up.jpg",
    "speakers": []
  },
  {
    "slug": "how-ai-is-changing-professions-and-recruiting",
    "title": "How AI Is Changing Professions and Recruiting",
    "titleRu": "Как AI меняет профессии и рекрутинг?",
    "start": "2026-09-26T10:30:00.000-07:00",
    "end": "2026-09-26T12:00:00.000-07:00",
    "language": "Russian",
    "format": "In person",
    "placeName": "Inkspire Print Studio",
    "address": "8275 166th Ave NE, suite 101 (1st floor)\nRedmond, WA 98052",
    "lat": 47.6764855,
    "lng": -122.1194204,
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=Inkspire+Print+Studio+8275+166th+Ave+NE+Redmond+WA+98052",
    "registrationLink": null,
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Job Search",
      "Industry Insights"
    ],
    "short": "A discussion on how the AI-driven job market is changing recruiting, with speakers from Amazon.",
    "shortRu": "Дискуссия с участием спикеров из Amazon о том, как ИИ меняет рынок труда и рекрутинг",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Let’s meet on Saturday, September 26, at 10:30 a.m. to talk about how AI is changing the job market! We’ll be joined by Margarita Kostikova and Natalia Vasileva, who both work at Amazon and bring insights into AI development and recruiting."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "After the meetup, you’ll:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "Understand which of the three levels of AI use you’re at today and how to move to the next."
            }
          ],
          [
            {
              "text": "Discover, through real stories from Amazon, how AI is changing tasks, processes, roles, and entire teams."
            }
          ],
          [
            {
              "text": "Learn which human skills are becoming more valuable as AI evolves."
            }
          ],
          [
            {
              "text": "Learn how to anticipate the AI skills and specialists employers will need three to four months from now."
            }
          ],
          [
            {
              "text": "Get insights into interviewing in the AI era: what has changed in Amazon’s hiring process and what has stayed the same."
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "See you there!"
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Давайте соберёмся в субботу, 26 сентября в 10:30 утра и поговорим о том, как меняется рынок с приходом AI. К нам присоединятся Маргарита Костикова и Наташа Васильева, они обе работают в Амазон и участвуют в развитии AI и рекрутинге."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Маргарита - специалист в области AI и международных медиа с опытом более семи лет. В настоящее время она определяет стандарты качества для передовых AI-технологий в Amazon и развивает их. До Amazon"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Маргарита работала журналистом, окончила МГИМО и более пяти лет проработала на телевидении, управляя контент-стратегией для телеканалов Disney, Fox и National Geographic в 14 регионах. Переехав в США в 2023 году,"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Маргарита увидела, что с приходом AI мир уже не будет прежним, и выстроила новый карьерный вектор, чтобы перейти из медиа в AI и обладать уникальной экспертизой даже на кризисном рынке труда. Маргарита хочет поделиться своим реальным опытом: как сделать себя незаменимым в эпоху AI, опередить спрос и даже освоить новую профессию, сохраняя основную экспертизу."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Наташа начинала карьеру финансовым аналитиком в хедж-фондах. После переезда в Америку она за пять лет успела поработать в Amazon финансовым аналитиком, нетехническим и техническим продактом. С 2023 по 2025 год Наташа вела YouTube-канал о поиске работы и карьере после иммиграции. Сейчас она работает Senior Product Manager Technical над внутренним продуктом для управления эффективностью сотрудников и проходит обучение по программе Amazon Bar Raiser."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "На встрече Наташа расскажет, как уже сейчас меняются рынок труда и рекрутинг, поделится историями изнутри Amazon и практическими советами для тех, кто ищет работу. Она уже много раз была нашим спикером, и я очень рада что она снова к нам придёт!"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "После встречи вы:\n* поймёте, на каком из трёх уровней вы используете AI сейчас и как перейти на следующий;\n* увидите на реальных историях из Amazon, как AI меняет задачи, процессы, роли и целые команды;\n* разберётесь, какие человеческие навыки становятся ценнее с развитием AI;\n* научитесь прогнозировать на 3–4 месяца вперёд, какие AI-навыки и специалисты понадобятся работодателям;\n* узнаете, как проходить интервью в мире AI: что изменилось, а что осталось прежним в найме Amazon."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "До встречи!"
          }
        ]
      }
    ],
    "cover": "/images/events/cover-how-ai-is-changing-professions-and-recruiting.jpg",
    "speakers": [
      {
        "id": "margarita-kostikova",
        "name": "Margarita Kostikova",
        "position": "Senior Quality Auditor, Frontier AI Assets",
        "company": "Amazon",
        "bio": "Margarita is an AI and international media professional with more than seven years of experience. She currently helps define and advance quality standards for cutting-edge AI technologies at Amazon. Before joining Amazon, Margarita worked as a journalist. A graduate of MGIMO University, she spent more than five years in television, managing content strategy for Disney, Fox, and National Geographic channels across 14 regions. After moving to the U.S. in 2023, Margarita realized that AI was changing the world for good. She charted a new career path, transitioning from media into AI and building a distinctive skill set to stand out even in a challenging job market.",
        "bioRu": "Маргарита — специалист в области ИИ и международных медиа с опытом более семи лет. В Amazon она помогает формировать и развивать стандарты качества для передовых ИИ-технологий. До Amazon Маргарита работала журналистом. После выпуска из МГИМО более пяти лет она проработала на телевидении, где отвечала за контент-стратегию каналов Disney, Fox и National Geographic в 14 регионах. Переехав в США в 2023 году, Маргарита поняла, что ИИ меняет мир безвозвратно. Она выбрала новый карьерный путь — перешла из медиа в ИИ, собрав уникальный набор навыков, который помогает выделиться даже на непростом рынке труда.",
        "photo": "/images/events/speaker-margarita-kostikova.jpg",
        "linkedin": "https://www.linkedin.com/in/margaritakostikova/",
        "website": null
      },
      {
        "id": "natalia-vasileva",
        "name": "Natalia Vasileva",
        "position": "Senior Product Manager–Technical",
        "company": "Amazon",
        "bio": "Natalia began her career as a financial analyst at hedge funds. After moving to the U.S., she spent five years at Amazon working as a financial analyst and in both non-technical and technical product management roles. From 2023 to 2025, she ran a YouTube channel about job hunting and building a career after immigration. She is now a Senior Product Manager–Technical, working on an internal employee performance management product, and is training to become an Amazon Bar Raiser.",
        "bioRu": "Наталья начинала карьеру финансовым аналитиком в хедж-фондах. После переезда в США она пять лет проработала в Amazon — сначала финансовым аналитиком, а затем продакт-менеджером, как на нетехнических, так и на технических позициях. С 2023 по 2025 год вела YouTube-канал о поиске работы и построении карьеры после эмиграции. Сейчас Наталья — Senior Product Manager–Technical: она отвечает за внутренний продукт для управления эффективностью сотрудников, а также проходит подготовку, чтобы стать Bar Raiser — интервьюером Amazon, который следит за высокой планкой при найме.",
        "photo": "/images/events/speaker-natalia-vasileva.jpg",
        "linkedin": "https://www.linkedin.com/in/natalia-vasileva-35223355/",
        "website": null
      }
    ]
  },
  {
    "slug": "from-qa-automation-to-ai-engineer",
    "title": "From QA Automation to AI Engineer",
    "titleRu": "Из QA Automation в AI Engineer",
    "start": "2026-10-31T10:00:00.000-07:00",
    "end": "2026-10-31T12:00:00.000-07:00",
    "language": "Russian",
    "format": "In person",
    "placeName": "Inkspire Print Studio",
    "address": "8275 166th Ave NE, suite 101 (1st floor)\nRedmond, WA 98052",
    "lat": 47.6764855,
    "lng": -122.1194204,
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=Inkspire+Print+Studio+8275+166th+Ave+NE+Redmond+WA+98052",
    "registrationLink": "https://www.zeffy.com/ticketing/from-qa-automation-to-ai-engineer",
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Career Growth",
      "Industry Insights"
    ],
    "short": "Join us for a firsthand look at the transition from QA Automation to AI Engineering.",
    "shortRu": "Узнайте из первых рук, как проходит переход из QA Automation в AI Engineering.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "From QA Automation to AI Engineer: how Elena switched roles and what came of it."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Elena Perfilyeva is an AI Engineer at Expeditors, with 8 years in QA Automation and 10 years in the US."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Elena started her career as a QA engineer in Novosibirsk and continued as a QA Automation Engineer in the US. In early 2026, she moved into AI Engineering within Expeditors. Today she makes sure AI works reliably and safely at a large company:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "internal data doesn't leave the company through AI;"
            }
          ],
          [
            {
              "text": "the company can see what AI is doing and can allow or block specific AI actions;"
            }
          ],
          [
            {
              "text": "AI's access to data stays under control."
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Natalya Masyago will also join the meetup. Natalya has just changed roles: from chemist and program manager in biotech to AI Builder in healthcare tech. Natalya will share:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "how she decided to change careers;"
            }
          ],
          [
            {
              "text": "what she did to move into AI Engineering;"
            }
          ],
          [
            {
              "text": "how companies are hiring for these roles today."
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Join us to learn:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "how the move from QA Automation to AI Engineer went"
            }
          ],
          [
            {
              "text": "what an AI Engineer actually does"
            }
          ],
          [
            {
              "text": "which QA skills help in AI"
            }
          ],
          [
            {
              "text": "where to start if you're thinking about making the switch too"
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Send us your questions for the meetup: "
          },
          {
            "text": "https://forms.gle/YsAktfUS5y2cxUwJ7",
            "href": "https://forms.gle/YsAktfUS5y2cxUwJ7"
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Из QA Automation в AI Engineer: как Елена сменила роль и что из этого вышло?"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Елена Перфильева — AI Engineer в Expeditors, 8 лет в QA Automation, 10 лет в США."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Елена начинала QA-инженером в Новосибирске, в США продолжила как QA Automation Engineer. В начале 2026 года перешла в AI Engineering внутри Expeditors. Теперь она отвечает за то, чтобы AI в большой компании работал надёжно и безопасно:\n• внутренние данные не уходили через AI за пределы компании;\n• компания видела, что делает AI и могла разрешать или запрещать AI определённые действия;\n• доступ AI к данным был под контролем."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "К встрече также присоединится Наталья Масяго. Наталья только что сменила роль: из химика и программного менеджера в биотехе стала AI Builder в медтехе (healthcare tech)."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Наталья поделится:\n• как решила сменить карьеру;\n• что делала, чтобы перейти в AI Engineering;\n• как компании сейчас нанимают на такие роли."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Присоединяйтесь, чтобы узнать:\n• как проходил переход из QA Automation в AI Engineer\n• чем на самом деле занимается AI Engineer\n• какие навыки из QA помогают в AI\n• с чего начать, если вы тоже думаете о переходе."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-from-qa-automation-to-ai-engineer.jpg",
    "speakers": [
      {
        "id": "elena-perfilyeva",
        "name": "Elena Perfilyeva",
        "position": "AI Engineer III",
        "company": "Expeditors",
        "bio": "Elena Perfilyeva is an AI Engineer at Expeditors with 8 years in QA Automation and 10 years in the US. She started as a QA engineer in Novosibirsk, continued as a QA Automation Engineer in the US, and in early 2026 moved into AI Engineering, where she works on MCP adoption and governance, AI observability, and making enterprise AI reliable and secure.",
        "bioRu": "Елена Перфильева — AI-инженер в компании Expeditors. За её плечами 8 лет в автоматизации тестирования и 10 лет жизни в США. Она начинала QA-инженером в Новосибирске, затем работала инженером по автоматизации тестирования в США, а в начале 2026 года перешла в AI-инженерию. Сейчас она занимается внедрением MCP и правилами его использования, наблюдаемостью (observability) ИИ-систем, а также тем, чтобы корпоративный ИИ работал надёжно и безопасно.",
        "photo": "/images/events/speaker-elena-perfilyeva.jpg",
        "linkedin": "https://www.linkedin.com/in/elena-perfilyeva/",
        "website": null
      },
      {
        "id": "natalya-masyago",
        "name": "Natalya Masyago",
        "position": "AI Engineer",
        "company": "Validor",
        "bio": "Natalya Masyago is an AI Engineer at Validor, where she builds healthcare AI applications: LLM-powered services, RAG pipelines, and governed AI workflows. Before moving into AI engineering, she spent ten years as an analytical chemist and technical program manager in biotech and medical devices.",
        "bioRu": "Наталья Масяго — AI-инженер в компании Validor, где она разрабатывает ИИ-решения для здравоохранения: сервисы на основе LLM, RAG-пайплайны и контролируемые ИИ-процессы. До перехода в AI-инженерию она десять лет работала химиком-аналитиком и техническим руководителем программ в сфере биотехнологий и медицинских изделий.",
        "photo": "/images/events/speaker-natalya-masyago.jpg",
        "linkedin": "https://www.linkedin.com/in/masyago/",
        "website": null
      }
    ]
  },
  {
    "slug": "iamremarkable-workshop",
    "title": "#IAmRemarkable Workshop",
    "titleRu": "Воркшоп #IAmRemarkable",
    "start": "2026-11-18T18:30:00.000-08:00",
    "end": "2026-11-18T20:30:00.000-08:00",
    "language": "Russian",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": "https://www.zeffy.com/ticketing/iamremarkable-workshop",
    "joinLink": null,
    "recordingLink": null,
    "tags": [
      "Personal Brand",
      "Career Growth"
    ],
    "short": "A hands-on workshop created at Google: learn to talk about your achievements without embarrassment or shame.",
    "shortRu": "Для тех, кто в детстве слышал, что хвастаться некрасиво, а «я» — это последняя буква алфавита: учимся говорить о себе спокойно и без неловкости на воркшопе #IAmRemarkable (создан в Google).",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "#IAmRemarkable is a hands-on workshop created at Google: we learn to talk about our achievements without embarrassment or shame."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "The workshop is led by Liudmila Gishman:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "She has led 14 #IamRemarkable workshops for 151 participants, with an average rating of 4.8 out of 5"
            }
          ],
          [
            {
              "text": "Senior Technical Program Manager at Google"
            }
          ],
          [
            {
              "text": "15 years in the tech industry"
            }
          ],
          [
            {
              "text": "Coach for overwhelmed tech professionals who want to feel confident at work and still have energy left for life"
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "To take part in the #IAmRemarkable workshop, you'll need to keep your camera on and share your thoughts out loud. Listening in the background while walking or doing chores won't work. The session will not be recorded, so everyone can feel comfortable sharing. The workshop will be held in Russian."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "#IamRemarkable — практический воркшоп, созданный в Google: учимся говорить о своих достижениях без смущения и стыда."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Ведущая воркшопа — Людмила Гишман:\n• провела 14 воркшопов #IAmRemarkable для 151 участника, средняя оценка 4,8 из 5\n• Technical Program Manager в Google\n• 15 лет в технологической индустрии\n• коуч для перегруженных специалистов из технологической сферы, которые хотят чувствовать себя уверенно на работе и сохранять силы на жизнь"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Для участия в воркшопе #IamRemarkable у Вас должна быть возможность быть с включенной камерой и голосом делиться мыслями. Просто послушать на фоне во время прогулки или домашних дел — не получится. Записи не будет, чтобы было комфортно делиться своими мыслями. Язык мероприятия — русский."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-iamremarkable-workshop.jpg",
    "speakers": [
      {
        "id": "liudmila-gishman",
        "name": "Liudmila Gishman",
        "position": "Senior Technical Program Manager",
        "company": "Google",
        "bio": "I am a Senior Technical Program Manager at Google and a coach for tech professionals who want to grow in their careers without burnout.\n\nWith 15 years in tech across program management and quality engineering, I’ve worked in diverse sectors including video calling, news regulation, travel, and e-commerce. My career has been built on collaborating with cross-functional teams across multiple continents and time zones, including navigating both role and team transitions during my time at Google.",
        "bioRu": "Людмила Гишман —  Senior Technical Program Manager в Google, а также коуч для IT-специалистов, которые хотят расти в карьере без выгорания. За 15 лет в IT она работала в управлении программами и в QA, в самых разных направлениях: видеосвязь, регулирование новостного контента, путешествия и электронная коммерция. Её карьера построена на работе с кросс-функциональными командами на разных континентах и в разных часовых поясах. В Google ей довелось пройти и через смену роли, и через переход в другую команду.",
        "photo": "/images/events/speaker-liudmila-gishman.jpg",
        "linkedin": "https://www.linkedin.com/in/liudmila-gishman/",
        "website": null
      }
    ]
  },
  {
    "slug": "practicing-ai-together-2026-11-20",
    "title": "Practicing AI Together",
    "titleRu": "Практикуем AI вместе",
    "start": "2026-11-20T12:00:00.000-08:00",
    "end": "2026-11-20T13:00:00.000-08:00",
    "language": "English",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": null,
    "joinLink": "https://us02web.zoom.us/j/86550601333?pwd=KlvdJiyBs99AmUWaWlbSPmbvbOMjF7.1",
    "recordingLink": null,
    "tags": [
      "Hands-on AI"
    ],
    "short": "A relaxed, hands-on online meetup where we try AI tools on real tasks, compare notes, and learn from each other's experiments. New people welcome.",
    "shortRu": "Пробуем AI-инструменты на реальных задачах, сравниваем результаты и учимся на опыте друг друга. Новички приветствуются.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Tatyana Yakushev works in data and analytics and has been spending a lot of time figuring out how AI fits into real work. She has learned the most by practicing with other people, so she hosts a series of sessions built around exactly that."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "What it is: a relaxed, hands-on meetup where we try AI tools on real tasks, compare notes, and learn from each other's experiments. Whether you're just getting started or already use AI daily, you'll fit in. You don't need to have attended before to join."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "The sessions run every other week. Areas we could dig into:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "Using AI as a thinking partner for planning, decisions, and problem-solving"
            }
          ],
          [
            {
              "text": "Building repeatable AI workflows for the work you do every week"
            }
          ],
          [
            {
              "text": "Judging AI output: when to trust it, how to check it, and how to improve it"
            }
          ],
          [
            {
              "text": "AI for data and analysis: getting from raw information to insight"
            }
          ],
          [
            {
              "text": "What's new in AI and which developments matter for your job"
            }
          ],
          [
            {
              "text": "Where AI is taking careers and how to stay ahead"
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "What would you most like to learn? Share your topics or challenges, and upcoming sessions will be built around what people want."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Неформальная встреча-практикум, где мы пробуем AI-инструменты на реальных задачах, сравниваем результаты и учимся на экспериментах друг друга. Подойдёт и тем, кто только начинает, и тем, кто пользуется AI каждый день. Если вы пропустили предыдущие встречи - ничего страшного, присоединяйтесь сейчас!"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Встречи проходят раз в две недели. Темы, которые можно разобрать:\n- AI как партнёр для размышлений: планирование, решения, поиск выходов из сложных ситуаций;\n- повторяемые AI-процессы для задач, которые вы делаете каждую неделю;\n- как оценивать ответы AI: когда им доверять, как их проверять и улучшать;\n- AI для работы с данными и аналитики: от сырой информации к выводам;\n- что нового в AI и какие изменения важны для вашей работы;\n- в каком направлении AI двигает рынок труда и как оставаться на шаг впереди."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Что вам интересно? Предлагайте темы и задачи — следующие встречи соберём вокруг них."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-practicing-ai-together-2026-11-20.jpg",
    "speakers": [
      {
        "id": "tatyana-yakushev",
        "name": "Tatyana Yakushev",
        "position": "Principal Software Architect",
        "company": "Microsoft",
        "bio": "Tatyana Yakushev is a Principal Software Architect at Microsoft with more than 25 years of experience in product development and team leadership at major tech companies and startups. In Microsoft's Azure Data team she builds AI-powered solutions and works deeply with data, AI, and large-scale analytics systems. Before Microsoft, she worked at Amazon, Tableau, and a startup, and has switched between software engineer and manager roles several times.\n\nTatyana runs the \"Practicing AI Together\" workshop series and is starting group mentoring sessions for experienced women software engineers, aimed at helping more women reach the principal and staff level.",
        "bioRu": "Татьяна Якушева — ведущий архитектор программного обеспечения (Principal Software Architect) в Microsoft с более чем 25-летним опытом в разработке продуктов и управлении командами в крупных технологических компаниях и стартапах. В команде Azure Data она разрабатывает решения на основе искусственного интеллекта и глубоко работает с данными, AI и системами аналитики больших масштабов. До Microsoft работала в Amazon, Tableau и стартапе, не раз переходила с позиции инженера на позицию менеджера и обратно.\n\nТатьяна ведёт встречи-практикумы «Practicing AI Together» и групповые менторские встречи для опытных инженеров-разработчиц с целью помочь большему числу женщин выйти на уровень principal и staff.",
        "photo": "/images/events/speaker-tatyana-yakushev.jpg",
        "linkedin": "https://www.linkedin.com/in/tatyanay/",
        "website": null
      }
    ]
  },
  {
    "slug": "practicing-ai-together-2026-12-04",
    "title": "Practicing AI Together",
    "titleRu": "Практикуем AI вместе",
    "start": "2026-12-04T20:00:00.000+00:00",
    "end": "2026-12-04T21:00:00.000+00:00",
    "language": "English",
    "format": "Online",
    "placeName": null,
    "address": null,
    "lat": null,
    "lng": null,
    "mapsLink": null,
    "registrationLink": null,
    "joinLink": "https://us02web.zoom.us/j/86550601333?pwd=KlvdJiyBs99AmUWaWlbSPmbvbOMjF7.1",
    "recordingLink": null,
    "tags": [
      "Hands-on AI"
    ],
    "short": "A relaxed, hands-on online meetup where we try AI tools on real tasks, compare notes, and learn from each other's experiments. New people welcome.",
    "shortRu": "Пробуем AI-инструменты на реальных задачах, сравниваем результаты и учимся на опыте друг друга. Новички приветствуются.",
    "description": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Tatyana Yakushev works in data and analytics and has been spending a lot of time figuring out how AI fits into real work. She has learned the most by practicing with other people, so she hosts a series of sessions built around exactly that."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "What it is: a relaxed, hands-on meetup where we try AI tools on real tasks, compare notes, and learn from each other's experiments. Whether you're just getting started or already use AI daily, you'll fit in. You don't need to have attended before to join."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "The sessions run every other week. Areas we could dig into:"
          }
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "Using AI as a thinking partner for planning, decisions, and problem-solving"
            }
          ],
          [
            {
              "text": "Building repeatable AI workflows for the work you do every week"
            }
          ],
          [
            {
              "text": "Judging AI output: when to trust it, how to check it, and how to improve it"
            }
          ],
          [
            {
              "text": "AI for data and analysis: getting from raw information to insight"
            }
          ],
          [
            {
              "text": "What's new in AI and which developments matter for your job"
            }
          ],
          [
            {
              "text": "Where AI is taking careers and how to stay ahead"
            }
          ]
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "What would you most like to learn? Share your topics or challenges, and upcoming sessions will be built around what people want."
          }
        ]
      }
    ],
    "descriptionRu": [
      {
        "type": "p",
        "runs": [
          {
            "text": "Неформальная встреча-практикум, где мы пробуем AI-инструменты на реальных задачах, сравниваем результаты и учимся на экспериментах друг друга. Подойдёт и тем, кто только начинает, и тем, кто пользуется AI каждый день. Если вы пропустили предыдущие встречи - ничего страшного, присоединяйтесь сейчас!"
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Встречи проходят раз в две недели. Темы, которые можно разобрать:\n- AI как партнёр для размышлений: планирование, решения, поиск выходов из сложных ситуаций;\n- повторяемые AI-процессы для задач, которые вы делаете каждую неделю;\n- как оценивать ответы AI: когда им доверять, как их проверять и улучшать;\n- AI для работы с данными и аналитики: от сырой информации к выводам;\n- что нового в AI и какие изменения важны для вашей работы;\n- в каком направлении AI двигает рынок труда и как оставаться на шаг впереди."
          }
        ]
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Что вам интересно? Предлагайте темы и задачи — следующие встречи соберём вокруг них."
          }
        ]
      }
    ],
    "cover": "/images/events/cover-practicing-ai-together-2026-12-04.jpg",
    "speakers": [
      {
        "id": "tatyana-yakushev",
        "name": "Tatyana Yakushev",
        "position": "Principal Software Architect",
        "company": "Microsoft",
        "bio": "Tatyana Yakushev is a Principal Software Architect at Microsoft with more than 25 years of experience in product development and team leadership at major tech companies and startups. In Microsoft's Azure Data team she builds AI-powered solutions and works deeply with data, AI, and large-scale analytics systems. Before Microsoft, she worked at Amazon, Tableau, and a startup, and has switched between software engineer and manager roles several times.\n\nTatyana runs the \"Practicing AI Together\" workshop series and is starting group mentoring sessions for experienced women software engineers, aimed at helping more women reach the principal and staff level.",
        "bioRu": "Татьяна Якушева — ведущий архитектор программного обеспечения (Principal Software Architect) в Microsoft с более чем 25-летним опытом в разработке продуктов и управлении командами в крупных технологических компаниях и стартапах. В команде Azure Data она разрабатывает решения на основе искусственного интеллекта и глубоко работает с данными, AI и системами аналитики больших масштабов. До Microsoft работала в Amazon, Tableau и стартапе, не раз переходила с позиции инженера на позицию менеджера и обратно.\n\nТатьяна ведёт встречи-практикумы «Practicing AI Together» и групповые менторские встречи для опытных инженеров-разработчиц с целью помочь большему числу женщин выйти на уровень principal и staff.",
        "photo": "/images/events/speaker-tatyana-yakushev.jpg",
        "linkedin": "https://www.linkedin.com/in/tatyanay/",
        "website": null
      }
    ]
  }
];
