import Container from "./Container";
import CategoryVideo from "./CategoryVideo";

/*
  Kategorie-Kopf, zweigeteilt auf dunklem Grund:
  LINKS  Eyebrow KATEGORIE + Headline + Intro (Hauptdarsteller),
  RECHTS Hochformat-Video (9:16, komplett sichtbar, dezenter Rahmen)
         bzw. dunkle Platzhalter-Flaeche in gleicher Proportion.
  Mobil: Video unter Headline/Intro, zentriert, unbeschnitten.
*/

export default function CategoryHeader({
  headline,
  intro,
  label,
  video,
}: {
  headline: string;
  intro: string;
  label: string;
  video?: { src: string; poster: string };
}) {
  return (
    <Container className="pt-[clamp(28px,5vw,56px)]">
      <div className="grid grid-cols-1 items-start gap-[clamp(28px,5vw,64px)] md:grid-cols-[1fr_minmax(280px,360px)]">
        {/* Text-Spalte */}
        <div>
          <span className="eyebrow">Kategorie</span>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
            {headline || label}
          </h1>
          {intro && (
            <p className="mt-4 max-w-[62ch] whitespace-pre-line text-[1rem] leading-relaxed text-text-soft">
              {intro}
            </p>
          )}
        </div>

        {/* Video-Spalte (mobil unter dem Text, zentriert) */}
        <div className="flex justify-center md:justify-end">
          {video ? (
            <CategoryVideo src={video.src} poster={video.poster} />
          ) : (
            /* Platzhalter in Hochformat-Proportion (Video folgt) */
            <div className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden border border-line bg-near-black">
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
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
