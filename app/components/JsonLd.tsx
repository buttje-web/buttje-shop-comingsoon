// Rendert ein JSON-LD-Script (strukturierte Daten fuer Google + KI-Suchen).

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
