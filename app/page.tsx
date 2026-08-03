import type { Metadata } from "next";
import Link from "next/link";
import Container from "./components/Container";
import OptInForm from "./components/OptInForm";
import FilmSektion from "./components/FilmSektion";
import { CATEGORIES } from "./categories";

// Kachel-Halbsaetze im buttje-Ton (kompakter als die Kategorie-Headlines).
const KACHEL_TEASER: Record<string, string> = {
  entsorgung: "Für alles, was wegmuss — in jeder Stärke.",
  papier: "Von grau-günstig bis vierlagig hochweiß.",
  chemie: "Kein Wundermittel. Nur Zeug, das funktioniert.",
  seifen: "Für Hände, die den ganzen Tag arbeiten.",
  handschuhe: "Einweg oder unkaputtbar — du entscheidest.",
  zubehoer: "Der Rest, der den Unterschied macht.",
};

export const metadata: Metadata = {
  title: { absolute: "buttje Shop — Verbrauchsgüter & Hygienebedarf für Gewerbe" },
  description:
    "buttje Shop, Wien. Verbrauchsgüter und Hygienebedarf für Gewerbe: Müllsäcke, Papier, Seifen, Handschuhe, Chemie und Zubehör. Nettopreise, Lieferung innerhalb Österreichs.",
  alternates: { canonical: "/" },
};

// Startseite. Hero im bewegten buttje-Look (animierter Verlauf + Glitch),
// uebernommen aus der Coming-Soon-Platzhalterseite.
//
// BEWUSST OHNE KAUFBAR-Verzweigung: Hero-Unterzeile und Newsletter-Block
// standen frueher in zwei Fassungen ("Das Sortiment wird gerade vorbereitet",
// "Wir eroeffnen bald"). Ohne gesetztes SHOP_KAUFBAR zieht das Layout keinen
// Warenkorb und damit kein cookies() — die Startseite wird dann statisch
// vorgerendert und friert diese Texte im ausgelieferten HTML ein. Genau so
// kam die Vor-Livegang-Fassung zu Crawlern. Der Shop ist offen, die Texte
// sind jetzt zustandsunabhaengig und koennen nicht mehr falsch einfrieren.
// Preise, Sackerl und Kassa haengen weiterhin am Schalter (fail closed).

export default function HomePage() {
  return (
    <>
      {/* Hero: bewegter Holo-Verlauf, dunkle Schrift mit leichtem Glitch/Pink-Blitzen */}
      <section className="hero-grad relative flex min-h-[70vh] items-center">
        <Container className="relative z-[2] py-[clamp(80px,12vw,140px)]">
          <p className="mb-[18px] text-[0.68rem] font-extrabold uppercase tracking-[0.3em] text-near-black">
            buttje · Wien
          </p>
          <h1 className="hero-title text-[clamp(2.6rem,11vw,8.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">
            Der Shop.
          </h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(0.85rem,1.4vw,1.05rem)] font-semibold text-[rgba(14,14,18,0.74)]">
            Verbrauchsgüter mit Haltung: ausgewählt, geliefert, ernst gemeint.
            {" "}Jetzt für Geschäftskunden bestellbar.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/produkte"
              className="border border-[rgba(14,14,18,0.34)] px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-near-black transition-colors hover:border-near-black"
            >
              Zum Sortiment →
            </Link>
          </div>
        </Container>
      </section>

      {/* Sortiment: 6 klickbare Kategorie-Kacheln (dunkle Flaeche, Name gross,
          Teaser-Halbsatz — kein Produktfoto) */}
      <section className="border-t border-line">
        <Container className="py-[clamp(40px,7vw,80px)]">
          <p className="eyebrow mb-6">Sortiment</p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kategorie/${c.slug}`}
                  className="group flex min-h-[150px] flex-col justify-between border border-line bg-[rgba(244,244,246,0.03)] p-6 transition-colors hover:border-line-strong hover:bg-[rgba(244,244,246,0.06)]"
                >
                  <span className="text-[clamp(1.3rem,2.6vw,1.8rem)] font-extrabold uppercase tracking-[-0.01em]">
                    {c.label}
                  </span>
                  <span className="mt-3 text-[0.88rem] leading-snug text-muted">
                    {KACHEL_TEASER[c.slug]}
                  </span>
                  <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-text transition-colors group-hover:text-accent">
                    Ansehen →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Film. Bewusst am Ende der Seite: schwerstes Element, rein optional.
          Bis zum Klick laedt nur das Posterbild (preload="none"). */}
      <section className="border-t border-line">
        <Container className="py-[clamp(40px,7vw,80px)]">
          <h2 className="max-w-[20ch] text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase leading-[1.05] tracking-[-0.02em]">
            Jeder hat etwas <span className="grad-text">zu verbergen.</span>
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.95rem] text-muted">
            Wir beraten gern. Und schweigen besser.
          </p>
          <div className="mt-8">
            <FilmSektion
              src="/video/entsorgung-full.mp4"
              poster="/video/poster-entsorgung.webp"
              titel="buttje Kurzfilm: Jeder hat etwas zu verbergen"
            />
          </div>
        </Container>
      </section>

      {/* Newsletter-Opt-in (Anker fuer "Neu eintragen" auf /bestaetigen).
          Der Shop ist offen — die Ankuendigung der Eroeffnung ist entfernt,
          es geht hier nur noch um neue Produkte und Angebote. */}
      <section id="newsletter" className="border-t border-line">
        <Container className="py-[clamp(40px,7vw,80px)]">
          <p className="eyebrow mb-3">Newsletter</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase tracking-[-0.02em]">
            Neues zuerst. <span className="grad-text">Direkt ins Postfach.</span>
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.95rem] text-muted">
            Tragen Sie sich ein und erfahren Sie als Erste von neuen Produkten und
            Angeboten für Geschäftskunden.
          </p>
          <div className="mt-7">
            <OptInForm variant="full" />
          </div>
        </Container>
      </section>

    </>
  );
}
