"use client";

import { mailKlartext } from "../lib/kontakt";

/*
  Anfrage-Wahl als DAUERHAFT SICHTBARER Balken (Vorgabe Rami, 09.08.2026;
  ersetzt alle frueheren Fassungen). Kein ANFRAGEN-Knopf, kein Aufklappen:
  Der zweigeteilte Balken selbst ist der eine, immer sichtbare Knopf.
  Linke Haelfte WhatsApp-Zeichen + WHATSAPP, rechte Haelfte Briefsymbol +
  E-MAIL, senkrechte Trennlinie mittig, Rahmen in Akzentblau, eine
  Knopfhoehe (Kachel 32 gezeichnet, Produktseite 44).

  Gilt fuer Produkte mit Preis auf Anfrage (Preis 0,00), auf der Kachel
  wie auf der Produktseite. Die Fallunterscheidung treffen die Aufrufer
  ueber das Preisfeld - dieselbe Pruefung wie fuer die Preiszeile. Damit
  wandert das Verhalten automatisch mit: faellt ein Preis auf 0, kommt
  der Balken, bekommt ein Produkt einen Preis, verschwindet er.

  DIE ZIELE STEHEN NICHT IM AUSGELIEFERTEN HTML: Beide Haelften sind
  Knoepfe, deren Adresse erst im Klick-Handler entsteht - WhatsApp-Nummer
  und Anfragetext tauchen im Quelltext der Seite nicht auf, die
  Mail-Adresse entsteht wie ueberall erst im Browser (app/lib/kontakt.ts,
  Harvester-Schutz). Ohne JavaScript bleibt die lesbare Pflichtangabe im
  Impressum der Weg.

  Beruehrungsziele: beide Haelften einzeln antippbar mit mindestens 44
  Punkten. Produktseite echt ueber Innenabstand (min-h 44). Kachel: 32
  gezeichnet wie die Nachbar-Knoepfe, die Tippflaeche waechst per
  ziel44-tief nach UNTEN in den Innenabstand der Kachel - nach oben liegt
  die Produktverknuepfung, mit der sich die Flaeche nicht ueberlappen darf.

  Unter 230 Punkten KACHELBREITE (Behaeltermass, nicht Fenstermass)
  entfallen die Woerter, die Symbole bleiben - die Vorlese-Beschriftung
  traegt immer den Produktnamen.
*/

/** WhatsApp-Zeichen in Markenfarbe - von Rami fuer die Wegwahl beauftragt. */
function WhatsAppZeichen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/** Schlichtes Briefsymbol, Strichstaerke wie das Sackerl-Zeichen im Kopf. */
function BriefZeichen() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7.5 9 6 9-6" />
    </svg>
  );
}

export default function AnfrageWahl({
  titel,
  sku = null,
  klein = false,
  wortlaut = "anfrage",
}: {
  /** Produktname im Klartext (unformatiert, landet im Anfragetext). */
  titel: string;
  /** Artikelnummer; ohne sie entfaellt der Nummern-Teil der Anfrage. */
  sku?: string | null;
  /** Kachel-Fassung: 32 Punkte gezeichnet, wie die Nachbar-Knoepfe. */
  klein?: boolean;
  /**
   * Wortlaut der Vorbefuellung (Vorgabe Rami, 09.08.2026):
   * - "anfrage": Anfrage-Produkte (Preis 0) - "Anfrage zu ..." / "Anfrage: ..."
   * - "frage":   kaufbare Produkte - "Frage zu ..." / "Frage: ..."
   * Der Balken selbst ist in beiden Faellen derselbe.
   */
  wortlaut?: "anfrage" | "frage";
}) {
  const artikel = sku?.trim() ? sku.trim() : null;
  const auftakt = wortlaut === "frage" ? "Frage" : "Anfrage";

  // Vorgabe woertlich: "[Anfrage|Frage] zu [Produktname], Artikelnummer
  // [Nr]:" - ohne Artikelnummer entfaellt der Nummern-Teil, der
  // Doppelpunkt bleibt.
  function whatsapp() {
    const text = `${auftakt} zu ${titel}${artikel ? `, Artikelnummer ${artikel}` : ""}:`;
    window.open(
      `https://wa.me/4367762080802?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function mail() {
    const betreff = `${auftakt}: ${titel}${artikel ? ` (${artikel})` : ""}`;
    window.location.href = `mailto:${mailKlartext()}?subject=${encodeURIComponent(betreff)}`;
  }

  // Eine Haelfte des Balkens: Machart wie der Sackerl-Knopf daneben
  // (Akzentfarbe, Versalien, Hover-Toenung), Hoehe wie EIN Knopf.
  const haelfte =
    `flex ${klein ? "ziel44 ziel44-tief h-8" : "min-h-[44px] py-3"} min-w-0 flex-1 ` +
    "items-center justify-center gap-2 px-1 " +
    `${klein ? "text-[0.64rem]" : "text-[0.72rem]"} font-bold uppercase leading-none ` +
    "tracking-[0.16em] text-accent transition-colors hover:bg-[rgba(92,200,255,0.12)]";
  // Woerter entfallen in schmalen Kacheln - dann sprechen die Symbole,
  // die Vorlese-Beschriftung bleibt immer dran.
  const wort = klein ? "@max-[230px]:hidden" : "";

  return (
    <div className={klein ? "@container flex w-full border border-accent" : "flex min-w-[260px] border border-accent"}>
      <button
        type="button"
        onClick={whatsapp}
        aria-label={
          wortlaut === "frage"
            ? `Frage per WhatsApp stellen: ${titel}`
            : `Per WhatsApp anfragen: ${titel}`
        }
        className={haelfte}
      >
        <WhatsAppZeichen />
        <span className={wort}>WhatsApp</span>
      </button>
      <button
        type="button"
        onClick={mail}
        aria-label={
          wortlaut === "frage"
            ? `Frage per E-Mail stellen: ${titel}`
            : `Per E-Mail anfragen: ${titel}`
        }
        className={`${haelfte} border-l border-accent`}
      >
        <BriefZeichen />
        <span className={wort}>E-Mail</span>
      </button>
    </div>
  );
}
