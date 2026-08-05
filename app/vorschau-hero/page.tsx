import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";

/*
  NUR VORSCHAU — kein Bestandteil des Shops.

  Diese Seite zeigt, wie ein Hero mit dem Rohbild hero-rohbild-v2.png
  aussehen wuerde. Sie dient allein der Beurteilung durch Rami:
  Passen Motiv und Text zusammen, ueberlagert die Textspalte die Figur
  oder die Gegenstaende?

  BEWUSST NICHT ANGEFASST: die echte Startseite (app/page.tsx) und ihr
  bestehender Hero. Diese Route ist nirgends verlinkt, steht in keiner
  Navigation und in keiner Sitemap.

  Das Bild ist UNBEARBEITET. Der violette Farbstich und die schwarze
  Fehlflaeche oben links sind bekannt und werden erst im naechsten
  Schritt korrigiert — sie gehoeren hier absichtlich noch ins Bild,
  sonst waere die Vorschau nicht ehrlich.
*/

export const metadata: Metadata = {
  title: "Vorschau Hero",
  // Interne Vorschau: gehoert in keinen Suchindex.
  robots: { index: false, follow: false },
};

export default function VorschauHeroPage() {
  return (
    <>
      {/* Das Bild liegt als Flaeche hinter dem Text und laeuft bewusst
          ueber den Container hinaus. overflow-hidden verhindert, dass
          daraus waagrechtes Scrollen wird. */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Bildebene */}
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-rohbild-v2.png"
            alt=""
            /* Auf breiten Schirmen sitzt das Motiv mittig. Je schmaler es
               wird, desto weiter wandert der Ausschnitt nach rechts —
               sonst bliebe auf dem Handy nur der leere Hintergrund der
               linken Bildhaelfte stehen und die Figur waere weg. */
            className="h-full w-full object-cover object-[72%_50%] md:object-[62%_50%] lg:object-[50%_50%]"
          />
        </div>

        {/* Textebene. Vorrang vor dem Bild: eigene Spalte, die auf
            breiten Schirmen nur die linke Haelfte einnimmt. */}
        <Container className="relative z-10 py-[clamp(56px,8vw,120px)]">
          <div className="max-w-[min(100%,34rem)] lg:max-w-[46%]">
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
              <Link
                href="/produkte"
                className="inline-flex min-h-[48px] items-center border border-line-strong px-7 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent"
              >
                Zum Sortiment →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <p className="text-[0.8rem] leading-relaxed text-muted">
          Interne Vorschau. Das Bild ist unbearbeitet: violetter Farbstich
          und schwarze Fehlfläche oben links werden erst nach Ihrer
          Rückmeldung korrigiert. Diese Seite ist nicht verlinkt und nicht
          Teil des Shops.
        </p>
      </Container>
    </>
  );
}
