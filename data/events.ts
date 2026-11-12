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
  mapsLink: string | null;
  registrationLink: string | null;
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
    "slug": "how-ai-is-changing-professions-and-recruiting",
    "title": "How AI Is Changing Professions and Recruiting",
    "titleRu": null,
    "start": "2026-09-26T10:30:00.000-07:00",
    "end": "2026-09-26T12:00:00.000-07:00",
    "language": "Russian",
    "format": "In person",
    "placeName": "Inkspire Print Studio",
    "address": "8275 166th Ave NE, suite 101 (1st floor)\nRedmond, WA 98052",
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=Inkspire+Print+Studio+8275+166th+Ave+NE+Redmond+WA+98052",
    "registrationLink": null,
    "recordingLink": null,
    "tags": [
      "Job Search",
      "Industry Insights"
    ],
    "short": "A discussion on how the AI-driven job market is changing recruiting, with speakers from Amazon.",
    "shortRu": null,
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
    "descriptionRu": [],
    "cover": null,
    "speakers": []
  },
  {
    "slug": "from-qa-automation-to-ai-engineer",
    "title": "From QA Automation to AI Engineer",
    "titleRu": null,
    "start": "2026-10-31T10:00:00.000-07:00",
    "end": "2026-10-31T12:00:00.000-07:00",
    "language": "Russian",
    "format": "In person",
    "placeName": "Inkspire Print Studio",
    "address": "8275 166th Ave NE, suite 101 (1st floor)\nRedmond, WA 98052",
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=Inkspire+Print+Studio+8275+166th+Ave+NE+Redmond+WA+98052",
    "registrationLink": "https://www.zeffy.com/ticketing/from-qa-automation-to-ai-engineer",
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
            "text": "К встрече также присоединится Natalya Masyago.\nНаталья только что сменила роль: из химика и программного менеджера в биотехе стала AI Builder в медицинском техе (healthcare tech).\nНаталья поделится:\n• как решила сменить карьеру;\n• что делала, чтобы перейти в AI Engineering;\n• как компании сейчас нанимают на такие роли."
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
      },
      {
        "type": "p",
        "runs": [
          {
            "text": "Пишите ваши вопросы для встречи по ссылке https://forms.gle/YsAktfUS5y2cxUwJ7"
          }
        ]
      }
    ],
    "cover": null,
    "speakers": []
  }
];
