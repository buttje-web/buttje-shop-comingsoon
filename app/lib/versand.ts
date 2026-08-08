// Versandkonditionen an EINER Stelle.
//
// Diese Werte erscheinen an mehreren Stellen im Frontend (Kaufbereich,
// Warenkorb-Fortschrittsbalken) und muessen mit dem Shopify-Versandtarif
// uebereinstimmen. Wer hier etwas aendert, muss den Tarif im Shopify-Admin
// mitziehen - und umgekehrt.
//
// ACHTUNG: Die Rechtstexte (AGB 5.4, /versand-zahlung) fuehren dieselben
// Betraege AUSGESCHRIEBEN und werden bewusst NICHT von hier interpoliert,
// damit sich ein Rechtstext nie stillschweigend mitaendert. Wer hier etwas
// anfasst, muss beide Textstellen bewusst mitziehen.
//
// Stand 2026-08-01: Liefergebiet nur Oesterreich. Staffelung nach
// Sendungsgewicht; oberhalb der letzten Stufe gibt es bewusst KEINEN Tarif
// (Shopify liefert dann gar keine Versandoption - Lieferung nur auf Anfrage).
// Der automatische Rabatt "Kostenloser Versand ab 150 EUR" ist in Shopify auf
// die unterste Stufe beschraenkt: frei wird es also nur bis 20 kg.

export const VERSAND = {
  /** Einziges Liefergebiet. */
  land: "Österreich",
  /** Gewichtsstufen aufsteigend; bisKg = obere Grenze einschliesslich, Preis EUR netto. */
  stufen: [
    { bisKg: 20, preis: 10 },
    { bisKg: 40, preis: 15 },
    { bisKg: 60, preis: 20 },
  ],
  /** Ab diesem Netto-Warenwert (EUR) entfaellt der Versand - nur in der untersten Stufe. */
  freiAb: 150,
} as const;

/** Guenstigster Tarif (EUR netto) - das "ab" in der Kommunikation. */
export const VERSAND_AB = VERSAND.stufen[0].preis;

/** Obergrenze der Stufe, bis zu der Gratisversand ueberhaupt moeglich ist. */
export const GRATIS_BIS_KG = VERSAND.stufen[0].bisKg;

/** Hoechstes transportierbares Gewicht ueber den Regeltarif. */
export const MAX_KG = VERSAND.stufen[VERSAND.stufen.length - 1].bisKg;

/**
 * Tarif fuer ein Sendungsgewicht in kg.
 * @returns Preis in EUR netto, oder null oberhalb der letzten Stufe (= nur auf Anfrage).
 */
export function tarifFuerGewicht(kg: number): number | null {
  const stufe = VERSAND.stufen.find((s) => kg <= s.bisKg);
  return stufe ? stufe.preis : null;
}

/** Kann diese Sendung ueberhaupt versandkostenfrei werden? (nur unterste Stufe) */
export function gratisMoeglich(kg: number): boolean {
  return kg <= GRATIS_BIS_KG;
}

export function euro(n: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}
