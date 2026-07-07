import Container from "./Container";

// Gemeinsames Geruest fuer die Pflichtseiten. Nur Struktur - Inhalt folgt.

export default function PlaceholderPage({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="mb-6 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        {title}
      </h1>
      <div className="max-w-[60ch] border border-line px-6 py-12">
        <p className="eyebrow mb-3">In Vorbereitung</p>
        <p className="text-muted">
          {note ?? "Der Inhalt dieser Seite wird vor dem Verkaufsstart ergänzt."}
        </p>
      </div>
    </Container>
  );
}
