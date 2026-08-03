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
      {/* Hero, zweispaltig: links die Ansage, rechts die Buehnenaufnahme.
          Der Grund ist derselbe dunkle Ton wie der Rest der Seite — kein
          Verlauf, keine Farbflaeche. Cyan kommt nur als Akzent vor.
          overflow-hidden ist Pflicht: das Bild ragt rechts bewusst ueber
          den Container hinaus und wuerde sonst die Seite scrollbar machen. */}
      <section className="overflow-hidden border-b border-line">
        <Container className="grid items-center gap-[clamp(32px,5vw,56px)] py-[clamp(48px,6vw,88px)] lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
          {/* Textspalte */}
          <div>
            <p className="eyebrow">buttje · Wien</p>

            {/* Umbruch nach "jemand" ist gesetzt, nicht zufaellig: die Pointe
                steht in der zweiten Zeile und soll dort auch anfangen. */}
            <h1 className="mt-5 text-[clamp(1.85rem,4.3vw,3.15rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]">
              Läuft, bis jemand
              <br />
              vergisst zu bestellen.
            </h1>

            {/* Zweite Zeile: klar kleiner als die H1, klar groesser als
                Fliesstext, volle Textfarbe statt Grau — sie wird im selben
                Blick mitgelesen. */}
            <p className="mt-6 max-w-[30ch] text-[clamp(1.1rem,2vw,1.7rem)] font-semibold leading-[1.25] tracking-[-0.01em] text-text">
              Müllsäcke, Papier, Chemie. Bevor jemand fragt, wo es ist.
            </p>

            <p className="mt-5 max-w-[44ch] text-[0.95rem] leading-relaxed text-text-soft">
              Verbrauchsgüter für Gewerbe. Nettopreise, Lieferung in ganz
              Österreich.
            </p>

            <div className="mt-9">
              <Link
                href="/produkte"
                className="inline-flex min-h-[48px] items-center border border-line-strong px-7 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent"
              >
                Zum Sortiment →
              </Link>
            </div>
          </div>

          {/* Bildspalte. Kein Rahmen, kein Kasten — die Aufnahme steht frei
              auf dem Grund. Auf Desktop laeuft sie rechts aus dem Container
              heraus und ist breiter als ihre Spalte; auf Mobil steht sie
              unter dem Text und deutlich kleiner. */}
          {/* KEIN w-full: Bei fester Breite 100 % wuerde der negative
              Aussenabstand die Spalte nicht mehr verbreitern, und das Bild
              bliebe brav im Raster stehen statt rechts anzuschneiden. */}
          <div className="order-last lg:-mr-[clamp(24px,7vw,130px)]">
            {/* Ausschnitt statt ganzem Hochformat: Die Buehnenaufnahme ist
                9:16 und haette den Hero sonst auf ueber 1200 px Hoehe
                getrieben. Der Ausschnitt sitzt eng auf der Rolle — das
                leere obere Drittel faellt weg, und die Beschriftung des
                Kartons rutscht so weit an den unteren Rand, dass sie nicht
                mehr mitgelesen wird. Der Hero zeigt das Produkt, nicht das
                Etikett. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kategorie/entsorgung.webp"
              alt="Blauer Abfallsack, 120 Liter, aus dem buttje-Sortiment"
              width={720}
              height={1280}
              /* Erstes Bild im Sichtfeld: bewusst NICHT lazy, sonst
                 flackert der Hero beim Laden nach. */
              fetchPriority="high"
              decoding="async"
              className="h-[clamp(230px,56vw,290px)] w-full object-cover object-[50%_62%] lg:h-[clamp(400px,40vw,520px)] lg:w-[152%] lg:max-w-none lg:object-[64%_52%]"
            />
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
