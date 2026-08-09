// Brutto zum Nettopreis.
//
// Alle Preise im Shop sind netto (B2B). Die Anzeige stellt den Netto
// gross und fett, darunter klein den Brutto - damit der Satz "Der
// Bruttopreis steht bei jedem Artikel klein darunter" stimmt.
//
// Rechenregel laut Entscheidung vom 29.07.: netto mal 1,20,
// kaufmaennisch auf den Cent gerundet, zwei Nachkommastellen.

export const UST_PROZENT = 20;

/** Bruttobetrag zum Nettobetrag, kaufmaennisch auf den Cent gerundet. */
export function bruttoAmount(netto: string | number): string {
  // In Cent rechnen und die Gleitkommadarstellung vor dem Runden
  // glaetten: 19.99 * 120 ist in IEEE 754 knapp UNTER 2398.8, ein
  // nacktes Math.round faellt dann auf die falsche Seite, sobald der
  // Wert genau auf einem halben Cent laege. toFixed(4) raeumt das weg,
  // ohne eine echte Kommastelle anzutasten.
  const cent = Math.round(Number((Number(netto) * 120).toFixed(4)));
  return (cent / 100).toFixed(2);
}

/** "€ 6,60" im oesterreichischen Format, identisch zu PriceTag. */
export function euroBetrag(betrag: string | number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(betrag));
}

/**
 * Grundpreis je Basiseinheit, kaufmaennisch auf den Cent gerundet.
 *
 * null statt eines Werts, wenn nichts Ehrliches anzeigbar ist - fehlend
 * ist zulaessig, falsch ist abmahnbar:
 * - Die Cent-Rundung wuerde den Wert um mehr als 2 Prozent verzerren
 *   (z.B. 0,67 Cent je Stueck: als "€ 0,01" waere das die Haelfte zu
 *   viel). Das schuetzt auch vor kuenftigen Preisaenderungen, die einen
 *   heute exakten Eintrag in die Verzerrung schieben wuerden.
 * - Es bliebe 0,00 oder weniger uebrig.
 *
 * Die Glaettung mit toFixed(4) vor dem Runden ist dieselbe wie in
 * bruttoAmount: 34,50 / 60 * 100 liegt in IEEE 754 knapp UNTER 57,5,
 * ein nacktes Math.round runden dort ab statt kaufmaennisch auf.
 */
export function grundpreisAmount(
  netto: string | number,
  menge: number,
): string | null {
  const exakt = Number(netto) / menge;
  if (!(exakt > 0)) return null;
  const cent = Math.round(Number((exakt * 100).toFixed(4)));
  if (cent <= 0) return null;
  const gerundet = cent / 100;
  if (Math.abs(gerundet - exakt) / exakt > 0.02) return null;
  return gerundet.toFixed(2);
}
