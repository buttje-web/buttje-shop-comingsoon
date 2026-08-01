import type { Metadata } from "next";
import Link from "next/link";
import Container from "./components/Container";
import OptInForm from "./components/OptInForm";
import FilmSektion from "./components/FilmSektion";
import { CATEGORIES } from "./categories";
import { KAUFBAR } from "./lib/shop-mode";

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
// uebernommen aus der Coming-Soon-Platzhalterseite. Neutrale Platzhaltertexte.

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
            Verbrauchsgüter mit Haltung: handgefüllt, nummeriert, ernst gemeint.
            {KAUFBAR
              ? " Jetzt für Geschäftskunden bestellbar."
              : " Das Sortiment wird gerade vorbereitet."}
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

      {/* Platzhalter-Wertversprechen (dunkler Abschnitt unter dem Hero) */}
      <section className="border-t border-line">
        <Container>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {[
              ["Handgefüllt", "Jedes Produkt mit Sorgfalt ausgewählt."],
              ["Nummeriert", "Klare Herkunft, klare Verantwortung."],
              ["Ernst gemeint", "Verbrauchsgüter, die ihren Zweck erfüllen."],
            ].map(([title, desc], i) => (
              <div
                key={title}
                className={`flex flex-col gap-2 py-[clamp(28px,5vw,48px)] md:pr-10 ${
                  i < 2 ? "md:border-r md:border-line" : ""
                } border-t border-line md:border-t-0`}
              >
                <span className="eyebrow">{`0${i + 1}`}</span>
                <h2 className="text-[clamp(1.1rem,2.4vw,1.5rem)] font-extrabold uppercase tracking-[-0.01em]">
                  {title}
                </h2>
                <p className="max-w-[40ch] text-[0.92rem] text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Film. Bewusst am Ende der Seite: schwerstes Element, rein optional.
          Bis zum Klick laedt nur das Posterbild (preload="none"). */}
      <section className="border-t border-line">
        <Container className="py-[clamp(40px,7vw,80px)]">
          <p className="eyebrow mb-3">Film</p>
          <h2 className="max-w-[20ch] text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase leading-[1.05] tracking-[-0.02em]">
            Jeder hat etwas <span className="grad-text">zu verbergen.</span>
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.95rem] text-muted">
            Ein Kurzfilm über reißfeste Müllsäcke und die Dinge, die niemand
            sehen soll. 48 Sekunden, Ton an.
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
          Zwei Zustaende: vor der Eroeffnung wird die Eroeffnung angekuendigt,
          danach geht es um neue Produkte und Angebote. Formular, Checkbox und
          Datenschutz-Zeile sind in beiden Zustaenden identisch. */}
      <section id="newsletter" className="border-t border-line">
        <Container className="py-[clamp(40px,7vw,80px)]">
          <p className="eyebrow mb-3">Newsletter</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase tracking-[-0.02em]">
            {KAUFBAR ? (
              <>
                Neues zuerst. <span className="grad-text">Direkt ins Postfach.</span>
              </>
            ) : (
              <>
                Wir eröffnen bald. <span className="grad-text">Zuerst erfahren.</span>
              </>
            )}
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.95rem] text-muted">
            {KAUFBAR
              ? "Tragen Sie sich ein und erfahren Sie als Erste von neuen Produkten und Angeboten für Geschäftskunden."
              : "Tragen Sie sich ein und erfahren Sie als Erste, wenn der Shop für Geschäftskunden öffnet."}
          </p>
          <div className="mt-7">
            <OptInForm variant="full" />
          </div>
        </Container>
      </section>

    </>
  );
}
