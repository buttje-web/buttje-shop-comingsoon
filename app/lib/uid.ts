/*
  Formatpruefung fuer UID-Nummern (USt-IdNr.).

  BEWUSST NUR FORMAT, KEINE ECHTHEITSPRUEFUNG: Es gibt keinen VIES-Aufruf.
  Eine formal gueltige Nummer kann trotzdem erfunden sein. Die Pruefung
  faengt Tippfehler ab, sie ersetzt keine Verifikation.

  Die UID bleibt optional - ein leeres Feld ist immer gueltig.
*/

/**
 * Trennzeichen raus, Grossbuchstaben.
 *
 * Neben Leerzeichen und Punkten werden auch Binde- und Gedankenstriche
 * entfernt: "ATU-12345678" ist eine gaengige Schreibweise und wuerde sonst
 * faelschlich als Formatfehler gemeldet.
 */
export function uidNormalisieren(eingabe: string): string {
  return eingabe.replace(/[\s.\u2010-\u2015-]/g, "").toUpperCase();
}

/** Oesterreich: ATU + genau 8 Ziffern. */
const AT = /^ATU\d{8}$/;

/**
 * Uebrige EU: Laenderpraefix + 2 bis 12 alphanumerische Zeichen.
 * Grundmuster, absichtlich grosszuegig - die Laenderregeln unterscheiden
 * sich stark, und ein zu strenges Muster wuerde echte Kunden aussperren.
 */
const EU_GRUNDMUSTER = /^[A-Z]{2}[A-Z0-9]{2,12}$/;

/**
 * Gueltig? Leere Eingabe gilt als gueltig (Feld ist optional).
 *
 * WICHTIG bei AT: Beginnt die Nummer mit "AT", wird die strenge
 * ATU-Regel verlangt. Ohne diese Sonderbehandlung wuerde "AT12345678"
 * (fehlendes U, ein haeufiger Tippfehler) ueber das Grundmuster
 * durchrutschen - und genau solche Faelle soll die Pruefung fangen.
 */
export function uidGueltig(eingabe: string): boolean {
  const u = uidNormalisieren(eingabe);
  if (u === "") return true;
  if (u.startsWith("AT")) return AT.test(u);
  return EU_GRUNDMUSTER.test(u);
}

export const UID_FEHLER =
  "Bitte prüfen Sie das Format Ihrer UID-Nummer (z. B. ATU12345678).";

/** Name des Bestell-Attributs, unter dem die UID an der Bestellung haengt. */
export const UID_ATTRIBUT = "UID-Nummer";
