/**
 * Renders a schema.org JSON-LD block (contract §18). `data` always comes
 * from our own server-side builders (src/lib/seo/json-ld.ts), never from
 * unsanitized user input - the `<` escape is still applied defensively so
 * a stray value can never prematurely close the script tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
