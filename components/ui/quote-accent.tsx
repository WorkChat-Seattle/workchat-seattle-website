/**
 * Акцентная цитата (Figma: quote-accent `1084:10527`): вертикальная планка 20 + текст h3, зазор 20.
 * Ширина задаётся снаружи: desktop 300, tablet 276, mobile 316.
 */
export function QuoteAccent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <blockquote className={["flex items-stretch gap-5", className].filter(Boolean).join(" ")}>
      <span aria-hidden="true" className="w-5 shrink-0 bg-decor-accent" />
      <p className="text-h3 min-w-0 text-text-heading">{children}</p>
    </blockquote>
  );
}
