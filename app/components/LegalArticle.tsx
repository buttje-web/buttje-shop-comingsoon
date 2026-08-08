import Container from "./Container";

// Gemeinsame Huelle fuer Rechts-/Pflichtseiten: Eyebrow, Titel, lesbarer
// Fliesstext (.legal) und optional ein Stand-Datum.

export default function LegalArticle({
  eyebrow,
  title,
  titleSize,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  /*
    Schriftgroessen-Klasse der Ueberschrift, falls die Standardgroesse
    nicht passt. Anlass (Entscheidung Rami, 09.08.2026, Loesung a):
    DATENSCHUTZERKLAERUNG ist bei der Standard-Untergrenze von 2rem
    breiter als schmale Bildschirme und wurde rechts abgeschnitten -
    Ueberschriften brechen hier bewusst nur an Wortgrenzen und werden
    nie automatisch getrennt (globals.css). Die Seite /datenschutz
    reicht deshalb eine kleinere UNTERGRENZE herein; ab mittlerer
    Breite aendert sich nichts.
  */
  titleSize?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1
        className={`mb-8 ${titleSize ?? "text-[clamp(2rem,5vw,3.5rem)]"} font-black uppercase tracking-[-0.03em]`}
      >
        {title}
      </h1>
      <article className="legal">{children}</article>
      {updated && <p className="legal meta mt-10">Stand: {updated}</p>}
    </Container>
  );
}
