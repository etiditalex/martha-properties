type JsonLdProps = {
  data: object;
};

/** Machine-readable structured data. The script is not shown on the page. */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
