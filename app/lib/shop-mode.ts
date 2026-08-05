// Feature-Schalter "Kaufbarkeit".
//
// AUS (Standard): Katalogmodus wie bisher - keine Preise sichtbar, Hinweis
//                 "Preise fuer Geschaeftskunden in Kuerze", kein Warenkorb,
//                 kein Checkout, keine offers in den strukturierten Daten.
// EIN:            Preise sichtbar, Hinweis weg, Warenkorb und Checkout aktiv.
//
// Gesteuert ueber die Server-Umgebungsvariable SHOP_KAUFBAR ("1" oder "true").
// BEWUSST OHNE NEXT_PUBLIC_-Praefix: Der Wert wird ausschliesslich in
// Server-Komponenten gelesen und als prop nach unten gereicht. Dadurch
// - landet der Schalter nicht im Client-Bundle,
// - genuegt zum Umlegen ein Setzen der Variable + Redeploy, kein Code-Change,
// - und ein fehlender/kaputter Wert faellt immer auf den sicheren
//   Katalogmodus zurueck (fail closed).
//
// Umlegen: Vercel-Env SHOP_KAUFBAR=1 setzen und neu deployen.

export const KAUFBAR =
  process.env.SHOP_KAUFBAR === "1" || process.env.SHOP_KAUFBAR === "true";

/** Ein Preis von 0,00 bedeutet "noch nicht kalkuliert" -> Preis auf Anfrage. */
export function istPreisOffen(amount: string | number | undefined | null): boolean {
  return !(Number(amount) > 0);
}

export const PREIS_AUF_ANFRAGE = "Preis auf Anfrage";
export const PREIS_HINWEIS_KATALOG = "Preise für Geschäftskunden in Kürze";
