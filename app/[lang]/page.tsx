import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Временная страница шага 2: проверка словаря и маршрутизации. Home — шаг 5.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <div className="min-h-100 px-5">
      <h1 className="text-h1 whitespace-pre-line">{t["home.hero.title"]}</h1>
    </div>
  );
}
