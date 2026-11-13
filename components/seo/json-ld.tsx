/** `<script type="application/ld+json">`; «<» экранируется, чтобы данные не закрыли тег (docs/seo-ai-visibility.md, п. 6). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
