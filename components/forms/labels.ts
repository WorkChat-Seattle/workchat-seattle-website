/** Тексты формы (подмножество словаря: форма — клиентский компонент, весь словарь в браузер не отправляем). */
export type Labels = Record<string, string>;

const PREFIXES = ["form.", "modal.", "btn.", "topic.", "time.", "meet.", "help.", "mentorship.form.", "volunteer.form.", "events.suggest.", "a11y.newTab", "a11y.required"];

/** Выбирает из словаря строки, нужные формам (вызывается на сервере). */
export function formLabels(t: Record<string, string>): Labels {
  return Object.fromEntries(Object.entries(t).filter(([k]) => PREFIXES.some((p) => k.startsWith(p))));
}
