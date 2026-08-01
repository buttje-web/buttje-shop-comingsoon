// Meldungen der Kopfleiste (News-Ticker).
//
// Aendern heisst: hier eine Zeile anpassen und deployen. Sonst nichts.
//
// Hausregeln fuer die Texte:
//   - keine Ausrufezeichen, keine Emojis
//   - kurze Aussagesaetze, Versalien entstehen per CSS
//   - die erste Meldung ist der rechtlich erforderliche B2B-Hinweis und
//     sollte an erster Stelle stehen bleiben
//   - Betraege und Fristen muessen zu app/lib/versand.ts und den
//     Rechtstexten passen; wer dort etwas aendert, zieht hier nach

export const TICKER_MELDUNGEN: string[] = [
  "Verkauf ausschließlich an Gewerbetreibende, Vereine und öffentliche Einrichtungen",
  "Versandkostenfrei ab 150 EUR netto",
  "Lieferzeit 3 bis 7 Werktage",
];

/** Trennzeichen zwischen den Meldungen im Laufband. */
export const TICKER_TRENNER = "+ + +";
