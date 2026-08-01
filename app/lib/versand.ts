// Versandkonditionen an EINER Stelle.
//
// Diese Werte erscheinen an mehreren Stellen im Frontend (Kaufbereich,
// Warenkorb-Fortschrittsbalken) und muessen mit dem Shopify-Versandtarif
// uebereinstimmen. Wer hier etwas aendert, muss den Tarif im Shopify-Admin
// mitziehen — und umgekehrt.
//
// Stand 2026-08-01: Liefergebiet nur noch Oesterreich (Deutschland raus).

export const VERSAND = {
  /** Einziges Liefergebiet. */
  land: "Österreich",
  /** Standard-Versandkosten in EUR netto. */
  standard: 10,
  /** Ab diesem Netto-Warenwert (EUR) ist der Versand frei. */
  freiAb: 150,
} as const;

export function euro(n: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}
