import "server-only";
import type { MentorInput, SuggestEventInput, VolunteerInput } from "@/data/forms";

/**
 * Запись заявок в Notion (docs/forms-to-notion.md, «Сопоставление полей»). Заполняются только известные поля.
 * Notion-Version 2025-09-03: родитель страницы — data source (id из env NOTION_DS_*).
 */
const VERSION = "2025-09-03";

type Rich = { plain_text: string }[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>;
type Page = { id: string; url: string; properties: Props };

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Не задана переменная ${name}`);
  return v;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = { Authorization: `Bearer ${env("NOTION_TOKEN")}`, "Notion-Version": VERSION, "Content-Type": "application/json" };
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.notion.com/v1${path}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (res.status === 429 && attempt < 2) {
      await new Promise((r) => setTimeout(r, (Number(res.headers.get("retry-after")) || 1) * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`Notion ${init?.method ?? "GET"} ${path}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as T;
  }
}

/** Текст в Notion: один фрагмент — до 2000 знаков, длиннее режем на несколько. */
const rich = (text: string) => {
  const parts = text.match(/[\s\S]{1,2000}/g) ?? [];
  return { rich_text: parts.map((content) => ({ text: { content } })) };
};
const title = (text: string) => ({ title: [{ text: { content: text.slice(0, 2000) } }] });
const select = (name: string) => ({ select: { name } });
const multi = (names: string[]) => ({ multi_select: names.map((name) => ({ name })) });

const createPage = (ds: string, properties: Props) =>
  api<Page>("/pages", { method: "POST", body: JSON.stringify({ parent: { type: "data_source_id", data_source_id: env(ds) }, properties }) });
const updatePage = (id: string, properties: Props) => api<Page>(`/pages/${id}`, { method: "PATCH", body: JSON.stringify({ properties }) });

async function findVolunteer(email: string): Promise<Page | null> {
  const r = await api<{ results: Page[] }>(`/data_sources/${env("NOTION_DS_VOLUNTEERS")}/query`, {
    method: "POST",
    body: JSON.stringify({ page_size: 1, filter: { property: "Email", email: { equals: email } } }),
  });
  return r.results[0] ?? null;
}

const namesOf = (p: Props | undefined): string[] => ((p?.multi_select ?? []) as { name: string }[]).map((x) => x.name);
const relIds = (p: Props | undefined): string[] => ((p?.relation ?? []) as { id: string }[]).map((x) => x.id);
const plain = (p: Props | undefined): string => ((p?.rich_text ?? []) as Rich).map((t) => t.plain_text).join("");

export type Saved = { url: string };

/** Волонтёр по email: есть — добавляем Skills / Notes / связь и ничего не перезаписываем; нет — создаём. */
async function upsertVolunteer(
  v: { name: string; email: string; linkedin: string; skills: string[]; time?: string; notes?: string; mentorCardId?: string },
): Promise<Page> {
  const existing = await findVolunteer(v.email);
  if (existing) {
    const props: Props = {};
    const skills = [...new Set([...namesOf(existing.properties.Skills), ...v.skills])];
    props.Skills = multi(skills);
    if (v.notes) {
      const prev = plain(existing.properties.Notes);
      props.Notes = rich(prev ? `${prev}\n\n${v.notes}` : v.notes);
    }
    if (v.mentorCardId) props["Mentor card"] = { relation: [...new Set([...relIds(existing.properties["Mentor card"]), v.mentorCardId])].map((id) => ({ id })) };
    return updatePage(existing.id, props);
  }
  const props: Props = {
    Name: title(v.name),
    Email: { email: v.email },
    Skills: multi(v.skills),
    Status: select("New"),
    Source: select("Website form"),
  };
  if (v.linkedin) props.LinkedIn = { url: v.linkedin };
  if (v.time) props["Time per month"] = select(v.time);
  if (v.notes) props.Notes = rich(v.notes);
  if (v.mentorCardId) props["Mentor card"] = { relation: [{ id: v.mentorCardId }] };
  return createPage("NOTION_DS_VOLUNTEERS", props);
}

/** Become a mentor → Mentor cards (+ Volunteers). Успех — если создана карточка; сбой связки с Volunteers не отменяет заявку. */
export async function saveMentor(i: MentorInput): Promise<Saved> {
  const existing = await findVolunteer(i.email).catch(() => null);
  const props: Props = {
    Name: title(i.name),
    Email: { email: i.email },
    "Mentoring topics": multi(i.topics),
    "Time per month": select(i.time),
    "Meeting format": multi(i.meet),
    Source: select("Website form"),
    Status: { status: { name: "Draft" } },
  };
  if (i.linkedin) props.LinkedIn = { url: i.linkedin };
  if (i.otherTopic) props["Other topic"] = rich(i.otherTopic);
  if (existing) props.Volunteer = { relation: [{ id: existing.id }] };
  const card = await createPage("NOTION_DS_MENTOR_CARDS", props);

  try {
    const vol = await upsertVolunteer({ name: i.name, email: i.email, linkedin: i.linkedin, skills: ["Mentor"], time: i.time, mentorCardId: card.id });
    if (!existing) await updatePage(card.id, { Volunteer: { relation: [{ id: vol.id }] } });
  } catch (e) {
    console.error("[forms] mentor: карточка создана, связь с Volunteers не удалась", e);
  }
  return { url: card.url };
}

/** Volunteer → Volunteers. */
export async function saveVolunteer(i: VolunteerInput): Promise<Saved> {
  const page = await upsertVolunteer({ name: i.name, email: i.email, linkedin: i.linkedin, skills: i.help, time: i.time, notes: i.notes });
  return { url: page.url };
}

/** Suggestion — домен из Event link, иначе первые слова описания. */
function suggestionTitle(i: SuggestEventInput): string {
  if (i.link) {
    try {
      return new URL(i.link).hostname.replace(/^www\./, "");
    } catch {
      /* ссылка уже проверена, но на всякий случай */
    }
  }
  const words = i.about.split(/\s+/).slice(0, 8).join(" ");
  return words.length < i.about.length ? `${words}…` : words;
}

/** Suggest an event → Event suggestions. */
export async function saveSuggestion(i: SuggestEventInput): Promise<Saved> {
  const props: Props = {
    Suggestion: title(suggestionTitle(i)),
    About: rich(i.about),
    "Submitted by": rich(i.name),
    Email: { email: i.email },
    Status: select("New"),
    Source: select("Website form"),
  };
  if (i.link) props["Event link"] = { url: i.link };
  const page = await createPage("NOTION_DS_EVENT_SUGGESTIONS", props);
  return { url: page.url };
}
