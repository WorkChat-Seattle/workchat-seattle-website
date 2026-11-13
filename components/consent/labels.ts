/** Тексты cookie-баннера и окна настроек (подмножество словаря для клиента; вызывать на сервере). */
export type ConsentLabels = Record<string, string>;

export function consentLabels(t: Record<string, string>): ConsentLabels {
  return Object.fromEntries(Object.entries(t).filter(([k]) => k.startsWith("cookie.") || k === "btn.close" || k === "a11y.newTab"));
}
