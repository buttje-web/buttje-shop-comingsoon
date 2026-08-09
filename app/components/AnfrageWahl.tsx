"use client";

import { useEffect, useId, useRef, useState } from "react";
import { mailKlartext } from "../lib/kontakt";

// ANFRAGEN mit Wegwahl (Vorgabe vom 09.08.): Der Knopf klappt ein kleines
// Feld mit genau zwei Wegen auf - WhatsApp und E-Mail. Kein schwebendes
// Element: das Feld gehoert zum Knopf und schiebt den Inhalt darunter.
//
// Gilt fuer Produkte mit Preis auf Anfrage (Preis 0,00), auf der Kachel
// wie auf der Produktseite. Die Fallunterscheidung treffen die Aufrufer
// ueber das Preisfeld - dieselbe Pruefung wie fuer die Preiszeile. Damit
// wandert das Verhalten automatisch mit: faellt ein Preis auf 0, kommt
// die Wegwahl, bekommt ein Produkt einen Preis, verschwindet sie.
//
// Die Wege stehen NICHT im ausgelieferten HTML: das Feld wird erst nach
// dem Klick gerendert, den es ohne JavaScript nicht gibt. Die
// Mail-Adresse entsteht wie ueberall erst im Browser (app/lib/kontakt.ts,
// Harvester-Schutz); ohne JavaScript bleibt die lesbare Pflichtangabe
// im Impressum der Weg.

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
}: {
  /** Produktname im Klartext (unformatiert, landet im Anfragetext). */
  titel: string;
  /** Artikelnummer; ohne sie entfaellt der Nummern-Teil der Anfrage. */
  sku?: string | null;
  /** Kachel-Fassung: 32 Punkte gezeichnet, wie die Nachbar-Knoepfe. */
  klein?: boolean;
}) {
  const [offen, setOffen] = useState(false);
  const rahmen = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const feldId = useId();

  // Schliessen per Klick daneben und per Escape (Escape gibt den Fokus
  // an den Knopf zurueck). Die Abhoerer existieren nur, solange offen ist.
  useEffect(() => {
    if (!offen) return;
    const daneben = (e: PointerEvent) => {
      if (!rahmen.current?.contains(e.target as Node)) setOffen(false);
    };
    const taste = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOffen(false);
      knopf.current?.focus();
    };
    document.addEventListener("pointerdown", daneben);
    document.addEventListener("keydown", taste);
    return () => {
      document.removeEventListener("pointerdown", daneben);
      document.removeEventListener("keydown", taste);
    };
  }, [offen]);

  const artikel = sku?.trim() ? sku.trim() : null;
  // Vorgabe woertlich: "Anfrage zu [Produktname], Artikelnummer [Nr]:" -
  // ohne Artikelnummer entfaellt der Nummern-Teil, der Doppelpunkt bleibt.
  const whatsappText = `Anfrage zu ${titel}${artikel ? `, Artikelnummer ${artikel}` : ""}:`;
  const betreff = `Anfrage: ${titel}${artikel ? ` (${artikel})` : ""}`;

  // Eine Haelfte des Balkens. In der Kachel-Fassung 32 Punkte gezeichnet,
  // die Tippflaeche waechst per ziel44-tief nach UNTEN - nach oben sitzt
  // der ANFRAGEN-Knopf, dessen eigene Flaeche in die Fuge reicht.
  const haelfte =
    `flex ${klein ? "ziel44 ziel44-tief h-8" : "min-h-[44px]"} min-w-0 flex-1 ` +
    "items-center justify-center gap-2 px-1 " +
    `${klein ? "text-[0.64rem]" : "text-[0.72rem]"} font-bold uppercase leading-none ` +
    "tracking-[0.16em] transition-colors hover:text-accent focus-visible:text-accent";
  // Woerter entfallen in schmalen Kacheln (Behaeltermass, nicht
  // Fenstermass) - dann sprechen die Symbole, die Vorlese-Beschriftung
  // bleibt immer dran.
  const wort = klein ? "@max-[230px]:hidden" : "";

  return (
    <div
      ref={rahmen}
      className={klein ? "@container w-full" : "inline-block min-w-[260px]"}
    >
      <button
        ref={knopf}
        type="button"
        aria-expanded={offen}
        aria-controls={feldId}
        aria-label={`Anfragen: ${titel}`}
        onClick={() => setOffen((o) => !o)}
        className={
          // Zustand und Grundfarben schliessen sich aus, sonst entscheidet
          // die CSS-Reihenfolge statt des Zustands (text-muted schlug
          // text-accent).
          klein
            ? // wie WegKnopf der Kachel: 32 gezeichnet, 44 antippbar (ziel44)
              "ziel44 flex h-8 w-full items-center justify-center border px-2 " +
              "text-[0.64rem] font-bold uppercase leading-none tracking-[0.16em] transition-colors " +
              (offen
                ? "border-accent text-accent"
                : "border-line-strong text-muted hover:border-text hover:text-text")
            : "min-h-[44px] w-full border px-6 py-3 text-[0.72rem] font-bold " +
              "uppercase tracking-[0.2em] transition-colors " +
              (offen
                ? "border-accent text-accent"
                : "border-line-strong hover:border-accent hover:text-accent")
        }
      >
        Anfragen
      </button>

      {/* Erst nach dem Klick im Baum - kein Weg steht im HTML der Seite.
          EIN Balken, zweigeteilt, Trennlinie mittig, Rahmen in Akzentblau
          wie der offene ANFRAGEN-Knopf (Optikvorgabe vom 09.08.). */}
      {offen && (
        <div id={feldId} className="mt-2 flex border border-accent">
          <a
            href={`https://wa.me/4367762080802?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Per WhatsApp anfragen: ${titel}`}
            className={haelfte}
          >
            <WhatsAppZeichen />
            <span className={wort}>WhatsApp</span>
          </a>
          <a
            href={`mailto:${mailKlartext()}?subject=${encodeURIComponent(betreff)}`}
            aria-label={`Per E-Mail anfragen: ${titel}`}
            className={`${haelfte} border-l border-accent`}
          >
            <BriefZeichen />
            <span className={wort}>E-Mail</span>
          </a>
        </div>
      )}
    </div>
  );
}
