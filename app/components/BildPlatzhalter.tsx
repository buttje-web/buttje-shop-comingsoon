// Dunkler Platzhalter fuer Produkte ohne eigenes Bild — im Buehne-Look
// (near-black mit dezentem Spotlight von oben), gedimmtes b + "Bild folgt".
// Sobald ein echtes Bild hochgeladen ist, rendert der Aufrufer das Bild
// statt dieser Komponente — kein weiterer Eingriff noetig.

export default function BildPlatzhalter() {
  return (
    <div
      aria-hidden
      className="flex h-full w-full flex-col items-center justify-center gap-1"
      style={{
        background:
          "radial-gradient(80% 55% at 50% 0%, rgba(244,244,246,0.07), transparent 65%), #0E0E12",
      }}
    >
      <span className="text-[2.6rem] font-extrabold lowercase leading-none text-[rgba(244,244,246,0.14)]">
        b
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[rgba(244,244,246,0.28)]">
        Bild folgt
      </span>
    </div>
  );
}
