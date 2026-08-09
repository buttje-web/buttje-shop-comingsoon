import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";
import JsonLd from "../components/JsonLd";
import { FAQ_TEILE, type FaqFrage } from "./faq-daten";
import { ORG_ID } from "../lib/seo";

/*
  FAQ, Fassung vom 08.08.2026 (59 Fragen in sieben Teilen). Ersetzt die
  bisherigen sechs Fragen vollstaendig - Auftrag Rami, 09.08.2026.

  - Der Wortlaut kommt zeichengenau aus app/faq/faq-daten.ts (generiert
    aus Ramis Quelldatei, echte Umlaute und scharfes s unveraendert).
  - Jeder Teil ist ein h2, jede Frage ein h3 mit eigenem Anker - einzelne
    Fragen sind damit direkt verlinkbar (/faq#wer-kann-bei-buttje-bestellen).
  - KEINE Klapp-Elemente: Der vollstaendige Text steht im ausgelieferten
    HTML (Vorgabe aus den Umsetzungshinweisen; Aufklappen waere erlaubt,
    noetig ist es nicht).
  - FAQPage-Auszeichnung nach schema.org: jede Frage als Question, jede
    Antwort als acceptedAnswer. Der Biozid-Pflichtsatz gehoert dort zum
    Antworttext, auf der Seite steht er hervorgehoben (Pflicht aus
    Art. 72 Abs. 1 der Verordnung 528/2012 - Wortlaut fixiert).
  - Fachantworten (Teile B bis F) verlinken je einmal auf die passende
    Kategorie. Teil A ist Bestellabwicklung, Teil G hat keine passende
    Kategorie - dort steht bewusst kein Link (nichts erfinden, melden).
*/

export const metadata: Metadata = {
  // Titel und Beschreibung woertlich aus den Umsetzungshinweisen.
  title: {
    absolute: "Häufige Fragen zu Verbrauchsgütern für Gewerbe | buttje Wien",
  },
  description:
    "Antworten zu Müllsäcken, Papier, Reinigungschemie, Seifen und Handschuhen für Betriebe. Bestellung, Versand und Fachwissen für Gewerbekunden in Österreich.",
  alternates: { canonical: "/faq" },
};

// Antworttext fuer die strukturierten Daten: alle Absaetze einer Antwort,
// inklusive Biozid-Pflichtsatz, mit Leerzeichen verbunden.
function antwortText(f: FaqFrage): string {
  return f.absaetze.map((a) => a.text).join(" ");
}

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    // Herausgeber-Verweis auf den Organization-Block aus app/layout.tsx
    // (per @id, der Block selbst steht auf jeder Seite genau einmal).
    publisher: { "@id": ORG_ID },
    mainEntity: FAQ_TEILE.flatMap((t) =>
      t.fragen.map((f) => ({
        "@type": "Question",
        name: f.frage,
        acceptedAnswer: { "@type": "Answer", text: antwortText(f) },
      }))
    ),
  };

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <JsonLd data={faqLd} />
      <p className="eyebrow mb-3">Service</p>
      <h1 className="mb-8 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Häufige Fragen
      </h1>

      {/* Sprungliste: sieben Teile, bei 59 Fragen der schnellste Weg. */}
      <nav aria-label="Themenbereiche" className="mb-10 max-w-[72ch]">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {FAQ_TEILE.map((t) => (
            <li key={t.anker}>
              <a
                href={`#${t.anker}`}
                className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted underline-offset-4 transition-colors hover:text-accent"
              >
                {t.titel}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="legal">
        {FAQ_TEILE.map((t) => (
          <section key={t.anker} id={t.anker}>
            <h2>{t.titel}</h2>
            {t.fragen.map((f) => (
              <section key={f.anker} id={f.anker}>
                <h3>{f.frage}</h3>
                {f.absaetze.map((a, i) =>
                  a.art === "biozid" ? (
                    /* Biozid-Pflichtsatz (Art. 72 Abs. 1 VO 528/2012):
                       Wortlaut gesetzlich fixiert, muss sich deutlich
                       abheben und gut lesbar sein. Voller Textton statt
                       text-soft, Akzentbalken, eigener Kasten. */
                    <p
                      key={i}
                      className="border-l-4 border-accent bg-[rgba(244,244,246,0.05)] px-4 py-3 font-semibold !text-text"
                    >
                      {a.text}
                    </p>
                  ) : (
                    <p key={i}>{a.text}</p>
                  )
                )}
                {t.kategorie && (
                  /* Ein Link je Fachantwort auf die passende Kategorie -
                     als eigene Zeile UNTER der Antwort, damit der
                     Antwortwortlaut unangetastet bleibt. */
                  <p className="!mb-6 text-[0.8rem]">
                    <Link href={`/kategorie/${t.kategorie.slug}`}>
                      Zur Kategorie: {t.kategorie.label}
                    </Link>
                  </p>
                )}
              </section>
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
