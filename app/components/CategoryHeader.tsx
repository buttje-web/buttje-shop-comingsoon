import Container from "./Container";
import KiLabel from "./KiLabel";
import { BILD_ALT, BILD_BASIS, bildSrcSet } from "../kategorie-bilder";

/*
  Kategorie-Kopf, zweigeteilt auf dunklem Grund:
  LINKS  Eyebrow KATEGORIE + Headline + Intro (Hauptdarsteller),
  RECHTS das Kategoriemotiv im Querformat 3:2, dasselbe wie auf der
         Kachel der Startseite, dezent abgedunkelt. Ohne Motiv: dunkle
         Verlaufsflaeche in gleicher Proportion (kein leerer Kasten).
  Mobil: Bild unter Headline/Intro, zentriert, unbeschnitten.

  WARUM HIER NICHT MEHR DAS HERSTELLERFOTO STEHT (Beschluss 05.08.2026):
  Frueher lag hier je Kategorie ein einzelnes echtes Produktfoto, bei
  papier ein TORK-Karton mit Markenaufdruck. Eine Fremdmarke
  stellvertretend fuer eine ganze Kategorie ist an dieser Stelle falsch,
  und die Bildsprache der Startseite brach damit ab.

  WARUM DER KASTEN VON 9:16 AUF 3:2 GEDREHT WURDE: keine Geschmacksfrage.
  Im alten Hochformat haette object-cover von den 1344 px Bildbreite nur
  504 stehen lassen, also 62,5 Prozent weggeschnitten - gemessen 34,7 bis
  54,4 Prozent der Warenflaeche je Bild. Bei handschuhe waere von der
  Schachtel "andschuhe" uebrig geblieben. Ein Hochformat, das die Ware
  ganz zeigt, gibt es nicht: der Kasten muesste dafuer mindestens 1,49 mal
  so breit wie hoch sein, und das ist bereits Querformat.

  ABDUNKLUNG 10 STATT 36 PROZENT: Die 36 stammen aus der Zeit der hellen
  Herstellerfotos, die als Buehne zuruecktreten sollten. Die neuen Motive
  sind auf denselben Grundton wie die Seite gerechnet und brauchen das
  nicht. Bei einem Papierhaendler darf Papier nicht grau werden.

  STILLGELEGT (Beschluss 14.07.2026, bestaetigt 01.08.2026): Es gibt keine
  Kategorie-Videos mehr. app/components/CategoryVideo.tsx bleibt bewusst im
  Repo, wird aber nirgends mehr eingebunden; ebenso bleibt das Feld `video`
  in app/categories.ts bestehen. Wer Videos reaktivieren will, rendert
  CategoryVideo hier wieder anstelle des <img> - sonst ist nichts noetig.
*/

export default function CategoryHeader({
  headline,
  intro,
  label,
  slug,
}: {
  headline: string;
  intro: string;
  label: string;
  /** Kategorie-Slug. Bestimmt Motiv und Alt-Text ueber kategorie-bilder.ts. */
  slug?: string;
}) {
  const basis = slug ? BILD_BASIS[slug] : undefined;
  return (
    <Container className="pt-[clamp(28px,5vw,56px)]">
      <div className="grid grid-cols-1 items-start gap-[clamp(28px,5vw,64px)] md:grid-cols-[1fr_minmax(320px,480px)]">
        {/* Text-Spalte */}
        <div>
          <span className="eyebrow">Kategorie</span>
          {/* KEINE Silbentrennung. Ein frueherer Versuch mit hyphens-auto
              hat lange Woerter zwar gebaendigt, dafuer aber Versalien-
              Headlines als "KEI-NE" umgebrochen. Umbruch jetzt nur an
              Wortgrenzen; laeuft ein Wort ueber, wird das gemeldet und
              per Schriftgroesse geloest. Genau das ist am 2026-08-01
              passiert: unterster clamp-Wert von 2rem auf 1,7rem, damit
              "Montagmorgen." bei 320 px in die Zeile passt. */}
          <h1 className="mt-3 text-[clamp(1.7rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
            {headline || label}
          </h1>
          {intro && (
            <p className="mt-4 max-w-[62ch] whitespace-pre-line text-[1rem] leading-relaxed text-text-soft">
              {intro}
            </p>
          )}
        </div>

        {/* Bild-Spalte (mobil unter dem Text, zentriert) */}
        <div className="flex justify-center md:justify-end">
          <div className="relative aspect-[3/2] w-full max-w-[480px] overflow-hidden border border-line bg-near-black">
            {basis ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/kategorie/${basis}-768.webp`}
                  srcSet={bildSrcSet(basis)}
                  /* Ab 520 px Fensterbreite deckelt max-w den Kasten bei
                     480 px. Darunter ist er so breit wie der Inhalt, also
                     100vw minus dem Innenabstand des Containers - bei 390
                     sind das gemessene 351 px, und 90vw trifft das genau.
                     Damit laedt das Handy die 768er statt der 1344er. */
                  sizes="(min-width: 520px) 480px, 90vw"
                  alt={slug ? BILD_ALT[slug] : ""}
                  width={1344}
                  height={896}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Abdunklung: setzt das Bild leicht zurueck, ohne die
                    Ware grau zu machen. Siehe Kopf dieser Datei. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[rgba(14,14,18,0.10)]"
                />
                {/* Zusaetzlicher Verlauf nach unten - verankert das Bild im Grund */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(14,14,18,0.10) 0%, transparent 45%, rgba(14,14,18,0.30) 100%)",
                  }}
                />
                {/* KI-Kennzeichnung, gleiches Bauteil wie auf der
                    Startseite. Steht nach den beiden Verlaufsebenen und
                    liegt damit ueber ihnen. */}
                <KiLabel />
              </>
            ) : (
              /* Fallback ohne Motiv: dunkle Verlaufsflaeche wie bisher */
              <>
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12]"
                  style={{ background: "var(--grad)", backgroundSize: "240% 240%" }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 50% 120%, rgba(14,14,18,0.85), transparent 60%)",
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
