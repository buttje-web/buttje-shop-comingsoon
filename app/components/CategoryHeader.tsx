import Container from "./Container";

/*
  Kategorie-Kopf, zweigeteilt auf dunklem Grund:
  LINKS  Eyebrow KATEGORIE + Headline + Intro (Hauptdarsteller),
  RECHTS Hochformat-Standbild (9:16) aus den Buehnen-Mastern, dezent
         abgedunkelt, damit es Buehne bleibt und nicht mit der Headline
         konkurriert. Ohne Bild: dunkle Verlaufsflaeche in gleicher
         Proportion (kein leerer Kasten).
  Mobil: Bild unter Headline/Intro, zentriert, unbeschnitten.

  STILLGELEGT (Beschluss 14.07.2026, bestaetigt 01.08.2026): Es gibt keine
  Kategorie-Videos mehr. app/components/CategoryVideo.tsx bleibt bewusst im
  Repo, wird aber nirgends mehr eingebunden; ebenso bleibt das Feld `video`
  in app/categories.ts bestehen. Wer Videos reaktivieren will, rendert
  CategoryVideo hier wieder anstelle des <img> — sonst ist nichts noetig.
*/

export default function CategoryHeader({
  headline,
  intro,
  label,
  bild,
}: {
  headline: string;
  intro: string;
  label: string;
  /** Pfad zum Header-Standbild (9:16), z.B. "/kategorie/papier.webp". */
  bild?: string;
}) {
  return (
    <Container className="pt-[clamp(28px,5vw,56px)]">
      <div className="grid grid-cols-1 items-start gap-[clamp(28px,5vw,64px)] md:grid-cols-[1fr_minmax(280px,360px)]">
        {/* Text-Spalte */}
        <div>
          <span className="eyebrow">Kategorie</span>
          {/* KEINE Silbentrennung. Ein frueherer Versuch mit hyphens-auto
              hat lange Woerter zwar gebaendigt, dafuer aber Versalien-
              Headlines als "KEI-NE" umgebrochen. Umbruch jetzt nur an
              Wortgrenzen; laeuft ein Wort ueber, wird das gemeldet und
              per Schriftgroesse oder manuellem Umbruch geloest. */}
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
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
          <div className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden border border-line bg-near-black">
            {bild ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bild}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Abdunklung: haelt das Bild als Buehne im Hintergrund */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[rgba(14,14,18,0.36)]"
                />
                {/* Zusaetzlicher Verlauf nach unten — verankert das Bild im Grund */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(14,14,18,0.12) 0%, transparent 42%, rgba(14,14,18,0.55) 100%)",
                  }}
                />
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
