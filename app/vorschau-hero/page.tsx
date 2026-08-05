import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";

/*
  NUR VORSCHAU — kein Bestandteil des Shops.

  Diese Seite zeigt, wie ein Hero mit dem bearbeiteten Motiv
  hero-final.png aussehen wuerde. Sie dient allein der Beurteilung durch
  Rami: Passen Motiv und Text zusammen, ueberlagert die Textspalte die
  Figur oder die Gegenstaende?

  BEWUSST NICHT ANGEFASST: die echte Startseite (app/page.tsx) und ihr
  bestehender Hero. Diese Route ist nirgends verlinkt, steht in keiner
  Navigation und in keiner Sitemap.

  Stand des Bildes: Kartonaufdruck gesetzt (scripts/hero-kartonaufdruck.py),
  Hintergrund vollstaendig ersetzt (scripts/hero-hintergrund.py). Der
  violette Farbstich und die schwarze Fehlflaeche oben links sind damit
  erledigt. Der Grund ist jetzt derselbe Ton wie die Seite selbst
  (--base, #0e0e12) — das Bild kann rechts auslaufen, ohne dass eine
  Kante entsteht.
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
            hinter dem Text. */}
        <div
          aria-hidden
          className="relative h-[clamp(200px,44vw,290px)] md:absolute md:inset-0 md:h-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-final.png"
            alt=""
            /* Auf breiten Schirmen sitzt das Motiv mittig. Je schmaler es
               wird, desto weiter wandert der Ausschnitt nach rechts —
               sonst bliebe nur der leere Hintergrund der linken
               Bildhaelfte stehen und die Figur waere weg. */
            className="h-full w-full object-cover object-[72%_50%] md:object-[62%_50%] lg:object-[50%_50%]"
          />

          {/* Verlauf NUR ab md, bewusst SCHWACH: 70 % Deckung am linken
              Rand, 30 % bei 45 %, ab 60 % nichts mehr. Die Ware bleibt
              damit klar erkennbar und wird nur gedaempft — ein staerkerer
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
        </div>

        {/* Textebene. Liegt ueber dem Verlauf, nicht darunter.

            Der Textschatten greift erst ab md, also nur dort, wo Text auf
            dem Bild liegt. Unter 768 px steht der Text auf glattem Grund,
            dort waere er wirkungslos.
            Zwei Schatten statt einem: der enge, harte setzt die
            Buchstabenkanten ab, der weite, weiche traegt sie auf hellem
            Grund. Ein einzelner grosser Schatten wuerde die Schrift
            weichgezeichnet wirken lassen — genau das soll nicht
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

      <Container className="py-10">
        <p className="text-[0.8rem] leading-relaxed text-muted">
          Interne Vorschau mit dem bearbeiteten Motiv: Kartonaufdruck
          gesetzt, Hintergrund vollständig ersetzt, Grundton wie die Seite.
          Diese Seite ist nicht verlinkt und nicht Teil des Shops.
        </p>
      </Container>
    </>
  );
}
