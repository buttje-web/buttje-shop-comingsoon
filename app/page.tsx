import type { Metadata } from "next";
import Link from "next/link";
import Container from "./components/Container";
import OptInForm from "./components/OptInForm";
import FilmSektion from "./components/FilmSektion";
import { CATEGORIES } from "./categories";

// Kachel-Halbsaetze im buttje-Ton (kompakter als die Kategorie-Headlines).
const KACHEL_TEASER: Record<string, string> = {
  entsorgung: "Für alles, was wegmuss. In jeder Stärke.",
  papier: "Von grau-günstig bis vierlagig hochweiß.",
  chemie: "Kein Wundermittel. Nur Zeug, das funktioniert.",
  seifen: "Für Hände, die den ganzen Tag arbeiten.",
  handschuhe: "Einweg oder unkaputtbar. Sie entscheiden.",
  zubehoer: "Der Rest, der den Unterschied macht.",
};

export const metadata: Metadata = {
  title: { absolute: "buttje Shop - Verbrauchsgüter & Hygienebedarf für Gewerbe" },
  description:
    "buttje Shop, Wien. Verbrauchsgüter und Hygienebedarf für Gewerbe: Müllsäcke, Papier, Seifen, Handschuhe, Chemie und Zubehör. Nettopreise, Lieferung innerhalb Österreichs.",
  alternates: { canonical: "/" },
};

// Startseite. Hero mit dem freigegebenen Motiv, uebernommen aus
// /vorschau-hero. Der animierte Verlauf und die Riesen-H1 "DER SHOP." der
// alten Coming-Soon-Platzhalterseite sind schon frueher entfallen; die
// Vorgaengerfassung dieses Heros war zweispaltig mit einer Produktaufnahme.
//
// BEWUSST OHNE KAUFBAR-Verzweigung: Hero-Unterzeile und Newsletter-Block
// standen frueher in zwei Fassungen ("Das Sortiment wird gerade vorbereitet",
// "Wir eroeffnen bald"). Ohne gesetztes SHOP_KAUFBAR zieht das Layout keinen
// Warenkorb und damit kein cookies() - die Startseite wird dann statisch
// vorgerendert und friert diese Texte im ausgelieferten HTML ein. Genau so
// kam die Vor-Livegang-Fassung zu Crawlern. Der Shop ist offen, die Texte
// sind jetzt zustandsunabhaengig und koennen nicht mehr falsch einfrieren.
// Preise, Sackerl und Kassa haengen weiterhin am Schalter (fail closed).

export default function HomePage() {
  return (
    <>
      {/* HERO - uebernommen aus /vorschau-hero, dort freigegeben.
          Bild, Verlauf, Texte, Ausschnitt und Verhalten in allen Breiten
          sind mit der Vorschau identisch.

          ZWEI ANORDNUNGEN, geteilt bei 768 px (Tailwind md):
          - unter 768: Bild oben als eigener Block, Text darunter auf dem
            Seitenhintergrund. Kein Text ueber dem Motiv.
          - ab 768: Bild als Flaeche hinter dem Text, darueber ein
            Verlauf, der die linke Haelfte beruhigt.
          overflow-hidden verhindert, dass der Ueberstand des Bildes
          waagrechtes Scrollen ausloest. */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Bildebene. Mobil im Fluss mit eigener Hoehe, ab md absolut
            hinter dem Text. Kein aria-hidden: Das Motiv traegt einen
            Alt-Text mit KI-Kennzeichnung und gehoert in den Vorlesefluss.

            AB 1280 (xl) ANDERE MASSGABE FUER DIE BILDGROESSE.
            Bis 1024 fuellt das Bild die Sektion und wird von object-cover
            beschnitten. Das geht auf, solange Sektionsbreite zu -hoehe
            ungefaehr dem Seitenverhaeltnis des Motivs entspricht (1,79).
            Die Hoehe kommt aber vom Text und waechst kaum mit, die Breite
            schon: bei 1440 stand ein Kasten von 1440x625, also 2,30 -
            object-cover hat das Motiv auf Breite gezogen und oben wie
            unten je 90 px abgeschnitten. Genau daher fehlten die Fuesse,
            und genau daher standen die Kartons vergroessert unter dem Text.

            Ab xl haengt die Bildbreite deshalb nicht mehr an der
            Fensterbreite, sondern an der Bildhoehe: aspect-[1678/937] bei
            fester Ober- und Unterkante ergibt genau die Breite, bei der
            nichts mehr beschnitten wird. Das Bild sitzt rechts, links
            bleibt freier Seitengrund fuer die Textspalte - und weil der
            Bildgrund exakt derselbe Ton ist (#0e0e12), ist die Kante
            zwischen beiden nicht zu sehen.

            bottom-8: Abstand unter den Fuessen.
            right-[-8%]: Rechts im Motiv stehen rund 17 Prozent leerer
            Grund. Den schiebt der negative Wert ueber die Fensterkante
            hinaus. Die Warengruppe rueckt dadurch von der Textspalte weg,
            OHNE dass das Bild kleiner wird und ohne dass von der Frau
            etwas verloren geht - ihre rechte Kante liegt bei 81 Prozent
            der Bildbreite und bleibt damit im Fenster. */}
        <div className="relative h-[clamp(200px,44vw,290px)] md:absolute md:inset-0 md:h-auto xl:bottom-8 xl:left-auto xl:right-[-8%] xl:aspect-[1678/937]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-final-v2.png"
            /* Drei WebP-Breiten, dazu die PNG-Fassung als Rueckfall fuer
               Browser ohne WebP. 1920 und 2560 gibt es bewusst nicht: das
               Motiv ist 1678 px breit, alles darueber waere hochgerechnet
               und damit groesser UND schlechter als das Original. */
            srcSet="/hero/hero-final-768.webp 768w, /hero/hero-final-1280.webp 1280w, /hero/hero-final-1678.webp 1678w"
            sizes="100vw"
            alt="Mit KI erzeugtes Bild: Frau mit Spaten und Kaffeetasse neben Versandkartons, Kanister Grundreiniger, Müllsäcken, Klebeband, Kabelbindern und Handschuhen vor dunklem Hintergrund."
            width={1678}
            height={937}
            /* Erstes Bild im Sichtfeld: bewusst NICHT lazy, sonst
               flackert der Hero beim Laden nach. */
            fetchPriority="high"
            decoding="async"
            /* Auf breiten Schirmen sitzt das Motiv mittig. Je schmaler es
               wird, desto weiter wandert der Ausschnitt nach rechts -
               sonst bliebe nur der leere Hintergrund der linken
               Bildhaelfte stehen und die Figur waere weg. */
            className="h-full w-full object-cover object-[72%_50%] md:object-[62%_50%] lg:object-[50%_50%]"
          />

          {/* Verlauf NUR ab md, bewusst SCHWACH: 70 % Deckung am linken
              Rand, 30 % bei 45 %, ab 60 % nichts mehr. Die Ware bleibt
              damit klar erkennbar und wird nur gedaempft - ein staerkerer
              Verlauf hatte sie ausgeloescht und dem Bild seinen Zweck
              genommen. Die Lesbarkeit des Textes traegt der Textschatten,
              nicht die Verdunkelung.
              Der Haltepunkt bei 53 % ist kein Zierrat: ohne ihn setzt der
              Verlauf am rechten Ende sichtbar ab. */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(14,14,18,0.70) 0%, rgba(14,14,18,0.30) 45%, rgba(14,14,18,0.12) 53%, rgba(14,14,18,0) 60%)",
            }}
          />
        </div>

        {/* Textebene. Liegt ueber dem Verlauf, nicht darunter.

            Der Textschatten greift erst ab md, also nur dort, wo Text auf
            dem Bild liegt. Unter 768 px steht der Text auf glattem Grund,
            dort waere er wirkungslos.
            Zwei Schatten statt einem: der enge, harte setzt die
            Buchstabenkanten ab, der weite, weiche traegt sie auf hellem
            Grund. Ein einzelner grosser Schatten wuerde die Schrift
            weichgezeichnet wirken lassen. */}
        <Container className="relative z-10 py-[clamp(40px,8vw,120px)]">
          <div className="max-w-[min(100%,34rem)] md:[text-shadow:0_1px_2px_rgba(14,14,18,0.95),0_4px_14px_rgba(14,14,18,0.6)] lg:max-w-[46%]">
            <p className="eyebrow">buttje · Wien</p>

            <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]">
              Jeder hat etwas zu verbergen
            </h1>

            <p className="mt-6 max-w-[30ch] text-[clamp(1.1rem,2vw,1.7rem)] font-semibold leading-[1.25] tracking-[-0.01em] text-text">
              Wir beraten gern. Und schweigen besser.
            </p>

            <p className="mt-5 max-w-[44ch] text-[0.95rem] leading-relaxed text-text-soft">
              Verbrauchsgüter für Gewerbe. Nettopreise, Lieferung in ganz
              Österreich.
            </p>

            <div className="mt-9">
              {/* Eigener halbtransparenter Grund unter dem Knopf: Er kann
                  je nach Breite auf einem hellen Karton landen, und dort
                  traegt der schwache Verlauf allein nicht. 60 % Deckung
                  reichen, ohne dass ein Kasten entsteht. */}
              <Link
                href="/produkte"
                className="inline-flex min-h-[48px] items-center border border-line-strong bg-[rgba(14,14,18,0.6)] px-7 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent"
              >
                Zum Sortiment →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Sortiment: 6 klickbare Kategorie-Kacheln (dunkle Flaeche, Name gross,
          Teaser-Halbsatz - kein Produktfoto) */}
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
          {/* OHNE .grad-text, anders als in der Newsletter-Sektion.

              Die Klasse ist ein dauerhaft laufender Verlauf (9 s, endlos).
              Bei der alten Zeile sass er auf "zu verbergen." und trug die
              Pointe. Die neue Ueberschrift hat ihre Pointe nicht im
              Schlusswort, sondern im trockenen "Ja, wirklich." darunter -
              die Ueberschrift selbst ist die gerade Feststellung, auf die
              der Nachsatz antwortet.
              Auf ein Wort gesetzt haette der Verlauf nur zwei Kandidaten:
              "Film" oder "Verbrauchsgueter". Beides zieht den Blick auf ein
              Wort, das nichts hervorzuheben hat, und laesst die Zeile
              angestrengt wirken statt trocken. Zusammen mit dem bewegten
              Bild im Hero und dem Verlauf in der Newsletter-Sektion waere
              es zudem die dritte Bewegung auf derselben Seite.
              Ruhiger ist deshalb: gar kein Verlauf. Als Stilmittel bleibt
              er der Seite erhalten, nur eben einmal statt zweimal. */}
          <h2 className="max-w-[20ch] text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase leading-[1.05] tracking-[-0.02em]">
            Ein Film über Verbrauchsgüter
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.95rem] text-muted">
            Ja, wirklich.
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
          Der Shop ist offen - die Ankuendigung der Eroeffnung ist entfernt,
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
