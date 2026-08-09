"use client";

// Mengenauswahl: Minus / Zahlenfeld (Direkteingabe) / Plus.
//
// ZWEI GROESSEN, ein Bauteil:
//   Standard  44 px hoch, feste Breite - der Kaufbereich der Produktseite.
//   klein     32 px hoch, volle Breite - die Produktkachel der Uebersicht.
// Gerechnet und beschriftet wird beide Male gleich, deshalb steht das an
// einer Stelle. Ohne klein/breit rendert das Bauteil wie bisher, die
// Produktseite bleibt unveraendert.
//
// max ist optional. Auf der Produktseite bleibt die Menge offen (B2B,
// Paletten), auf der Kachel liegt die Grenze bei 99.

export default function QuantityStepper({
  value,
  onChange,
  disabled = false,
  min = 1,
  max,
  klein = false,
  breit = false,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  klein?: boolean;
  breit?: boolean;
}) {
  // Werte ausserhalb der Grenzen werden auf die naechste Grenze gezogen,
  // nicht verworfen: wer 150 tippt, meint "viel" und bekommt das Hoechste.
  const clamp = (n: number) => {
    if (!Number.isFinite(n)) return min;
    const ganz = Math.floor(n);
    if (ganz < min) return min;
    if (max !== undefined && ganz > max) return max;
    return ganz;
  };

  // NICHT text-base: dieses Projekt definiert die Farbe --color-base, damit
  // erzeugt Tailwind aus text-base eine FARBE (fast schwarz) statt einer
  // Schriftgroesse. Das Minus und das Plus waeren unsichtbar.
  // In der kleinen Fassung ist der Knopf 32 x 32 Punkte gezeichnet. ziel44
  // legt eine unsichtbare 44er-Flaeche darueber, nach aussen erweitert, damit
  // das Zahlenfeld dazwischen antippbar bleibt (siehe globals.css).
  // Die grosse Fassung ist mit 44 x 44 schon gross genug.
  const knopf = klein
    ? "ziel44 ziel44-hoch w-8 shrink-0 text-[1rem] leading-none transition-colors enabled:hover:text-accent disabled:opacity-30"
    // Die grosse Fassung ist 44 breit, in der Sackerl-Zeile aber nur 42 hoch:
    // Der Rahmen hat min-h-[44px], die Knoepfe darin bekommen durch
    // items-stretch die Innenhoehe. ziel44 gleicht die zwei Punkte aus.
    : "ziel44 w-11 text-lg leading-none transition-colors enabled:hover:text-accent disabled:opacity-30";
  const feld = klein
    ? "min-w-0 flex-1 border-x border-line-strong bg-transparent text-center text-[0.8rem] font-semibold"
    : "w-16 border-x border-line-strong bg-transparent text-center text-sm font-semibold";

  return (
    <div
      className={
        `${breit ? "flex w-full" : "inline-flex"} ` +
        `${klein ? "h-8" : "min-h-[44px]"} items-stretch border border-line-strong`
      }
    >
      <button
        type="button"
        aria-label="Menge verringern"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={`${knopf} ${klein ? "ziel44-links" : ""}`}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        aria-label="Menge"
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10)))}
        className={`${feld} [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />
      <button
        type="button"
        aria-label="Menge erhöhen"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(clamp(value + 1))}
        className={`${knopf} ${klein ? "ziel44-rechts" : ""}`}
      >
        +
      </button>
    </div>
  );
}
