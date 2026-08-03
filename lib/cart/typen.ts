// Ergebnis einer Warenkorb-Aktion.
//
// BEWUSST EIN RUECKGABEWERT UND KEIN GEWORFENER FEHLER: Next redigiert
// Fehlermeldungen aus Server-Actions im Produktionsbuild ("The specific
// message is omitted in production builds"). Ein geworfener Text kommt beim
// Kunden also nie an — er sieht nur eine Serverfehlerseite. Zurueckgegebene
// Werte werden nicht redigiert und lassen sich anzeigen.
//
// Liegt bewusst in einer eigenen Datei: lib/cart/actions.ts traegt
// "use server" und darf ausschliesslich async-Funktionen exportieren.

export type CartErgebnis =
  | { ok: true; anzahl: number }
  | { ok: false; meldung: string };

/** Gegenstelle nicht erreichbar oder Zeitlimit. */
export const MELDUNG_NICHT_ERREICHBAR =
  "Das hat gerade nicht geklappt. Bitte versuchen Sie es in einem Moment noch einmal.";

/** Warenkorb kurzzeitig nicht auffindbar, existiert aber noch. */
export const MELDUNG_SACKERL_BESETZT =
  "Ihr Sackerl ist gerade kurz nicht erreichbar. Bitte versuchen Sie es in einem Moment noch einmal, Ihre bisherigen Positionen bleiben erhalten.";
