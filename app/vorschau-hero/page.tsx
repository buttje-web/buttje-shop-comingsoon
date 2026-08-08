import type { Metadata } from "next";
import SortimentKnopf from "../components/SortimentKnopf";
import Container from "../components/Container";
import KiLabel from "../components/KiLabel";

/*
  NUR VORSCHAU - kein Bestandteil des Shops.

  Diese Seite zeigt, wie ein Hero mit dem freigegebenen Motiv
  hero-final-v2.png aussehen wuerde. Sie dient allein der Beurteilung
  durch Rami: Passen Motiv und Text zusammen, ueberlagert die Textspalte
  die Figur oder die Gegenstaende?

  BEWUSST NICHT ANGEFASST: die echte Startseite (app/page.tsx) und ihr
  bestehender Hero. Diese Route ist nirgends verlinkt, steht in keiner
  Navigation und in keiner Sitemap.

  Stand des Bildes: Endfassung, ausserhalb erstellt und freigegeben. Am
  Motiv wurde hier nur der leere Hintergrund auf den Seitengrundton
  gezogen (scripts/hero-grundton.py, Abweichung vorher bis 3,1 Tonwerte,
  jetzt bis 1,4). Damit setzt sich das Bild an seinen Kanten nicht mehr
  als dunkleres Rechteck von der Seite ab. Kein Bildpunkt heller als
  Tonwert 60 wurde dabei um mehr als einen Tonwert veraendert - Frau,
  Kartons und Gegenstaende sind unberuehrt.

  Die frueheren Zwischenstaende (hero-rohbild-v2.png, hero-mit-aufdruck.png,
  hero-final.png) bleiben zur Nachvollziehbarkeit liegen, werden aber
  nirgends mehr ausgeliefert.
*/

export const metadata: Metadata = {
  title: "Vorschau Hero",
  // Interne Vorschau: gehoert in keinen Suchindex.
  robots: { index: false, follow: false },
};

export default function VorschauHeroPage() {
  return (
    <>
      {/* ZWEI ANORDNUNGEN, geteilt bei 768 px (Tailwind md):
          - unter 768: Bild oben als eigener Block, Text darunter auf dem
            Seitenhintergrund. Kein Text ueber dem Motiv.
          - ab 768: Bild als Flaeche hinter dem Text, darueber ein
            Verlauf, der die linke Haelfte beruhigt.
          overflow-hidden verhindert, dass der Ueberstand des Bildes
          waagrechtes Scrollen ausloest. */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Bildebene. Mobil im Fluss mit eigener Hoehe, ab md absolut
            hinter dem Text.

            KEIN aria-hidden mehr: Das Motiv traegt jetzt einen Alt-Text mit
            KI-Kennzeichnung und gehoert damit in den Vorlesefluss. */}
        {/* AB 1280 (xl) ANDERE MASSGABE FUER DIE BILDGROESSE.

            Bis 1024 fuellt das Bild die Sektion und wird von object-cover
            beschnitten. Das geht auf, solange Sektionsbreite zu -hoehe
            ungefaehr dem Seitenverhaeltnis des Motivs entspricht (1,79).
            Die Hoehe kommt aber vom Text und waechst kaum mit, die Breite
            schon: bei 1440 stand ein Kasten von 1440x625, also 2,30 -
            object-cover hat das Motiv auf Breite gezogen und oben wie
            unten je 90 px abgeschnitten. Genau daher die fehlenden Fuesse,
            und genau daher standen die Kartons vergroessert unter dem Text.

            Ab xl haengt die Bildbreite deshalb nicht mehr an der
            Fensterbreite, sondern an der Bildhoehe: aspect-[1678/937] bei
            fester Ober- und Unterkante ergibt genau die Breite, bei der
            nichts mehr beschnitten wird. Das Bild sitzt rechts, links
            bleibt freier Seitengrund fuer die Textspalte - und weil der
            Bildgrund exakt derselbe Ton ist (#0e0e12), ist die Kante
            zwischen beiden nicht zu sehen.

            bottom-8 statt bottom-0: der geforderte Abstand unter den
            Fuessen.

            right-[-8%]: Rechts im Motiv stehen rund 17 Prozent leerer
            Grund. Den schiebt der negative Wert ueber die Fensterkante
            hinaus. Die Warengruppe rueckt dadurch nach rechts von der
            Textspalte weg, OHNE dass das Bild kleiner wird und ohne dass
            von der Frau etwas verloren geht - ihre rechte Kante liegt bei
            81 Prozent der Bildbreite und bleibt damit im Fenster.
            Waagrechtes Scrollen kann daraus nicht entstehen, die Sektion
            hat overflow-hidden. */}
        <div className="relative h-[clamp(200px,44vw,290px)] md:absolute md:inset-0 md:h-auto xl:bottom-8 xl:left-auto xl:right-[-8%] xl:aspect-[1678/937]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-final-v2.png"
            /* Drei WebP-Breiten, dazu die PNG-Fassung als Rueckfall fuer
               Browser ohne WebP. 1920 und 2560 gibt es bewusst nicht: das
               Motiv ist 1678 px breit, alles darueber waere hochgerechnet
               und damit groesser UND schlechter als das Original. */
            srcSet="/hero/hero-final-768.webp 768w, /hero/hero-final-1280.webp 1280w, /hero/hero-final-1678.webp 1678w"
            /* Unter 768 px steht das Bild als eigener Block in voller
               Fensterbreite. Ab da liegt es hinter dem Text und deckt
               ebenfalls die volle Breite ab - deshalb durchgehend 100vw. */
            sizes="100vw"
            alt="KI-generiert. Frau mit Spaten und Kaffeetasse neben Versandkartons, Kanister Grundreiniger, Müllsäcken, Klebeband, Kabelbindern und Handschuhen vor dunklem Hintergrund."
            width={1678}
            height={937}
            /* Erstes Bild im Sichtfeld: bewusst NICHT lazy. */
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
              genommen. Die Lesbarkeit des Textes traegt jetzt der
              Textschatten, nicht die Verdunkelung.
              Der Haltepunkt bei 53 % ist kein Zierrat: ohne ihn setzt der
              Verlauf am rechten Ende sichtbar ab. */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(14,14,18,0.70) 0%, rgba(14,14,18,0.30) 45%, rgba(14,14,18,0.12) 53%, rgba(14,14,18,0) 60%)",
            }}
          />

          {/* KI-Kennzeichnung, gleich wie auf der Startseite. Zum Zusatz
              ab xl siehe die Begruendung dort. */}
          <KiLabel className="xl:right-[calc(8vw+8px)]" />
        </div>

        {/* Textebene. Liegt ueber dem Verlauf, nicht darunter.

            Der Textschatten greift erst ab md, also nur dort, wo Text auf
            dem Bild liegt. Unter 768 px steht der Text auf glattem Grund,
            dort waere er wirkungslos.
            Zwei Schatten statt einem: der enge, harte setzt die
            Buchstabenkanten ab, der weite, weiche traegt sie auf hellem
            Grund. Ein einzelner grosser Schatten wuerde die Schrift
            weichgezeichnet wirken lassen - genau das soll nicht
            passieren. */}
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
              {/* Gleicher Knopf wie auf der Startseite (Entscheidung Rami,
                  08.08.2026: mitgezogen, damit die Vorschau der Startseite
                  entspricht). Ein Kachelabschnitt existiert hier nicht,
                  der Knopf laeuft bewusst leer - siehe SortimentKnopf.tsx. */}
              <SortimentKnopf />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <p className="text-[0.8rem] leading-relaxed text-muted">
          Interne Vorschau mit der freigegebenen Endfassung des Motivs.
          Diese Seite ist nicht verlinkt und nicht Teil des Shops.
        </p>
      </Container>
    </>
  );
}
