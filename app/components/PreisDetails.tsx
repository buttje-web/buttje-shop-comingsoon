import { bruttoAmount, euroBetrag, grundpreisAmount, UST_PROZENT } from "../lib/preis";
import { EINHEIT_KURZ, type Grundmenge } from "../grundmengen";

// Die kleinen grauen Zeilen unter dem Nettopreis: Brutto, dazu wo die
// Menge belegt ist der Grundpreis. Ohne Zustand und ohne Hooks, damit
// dasselbe Bauteil in Server- (ProductCard) und Client-Komponenten
// (BuyBox, Suche) rendert.
//
// KEIN eigenes Ausblenden der Bruttozeile: Der Aufrufer rendert dieses
// Bauteil nur dort, wo auch ein echter Preis steht. Preis 0,00 ("Preis
// auf Anfrage") und der Katalogmodus kommen hier nie an.
//
// ZWEI SICHERUNGEN rendern trotzdem lieber nichts als etwas Falsches:
// - Eine andere Waehrung als EUR (Fehlkonfiguration der Gegenstelle)
//   liesse die fest auf EUR formatierten Zeilen falsch werden - dann
//   entfaellt das ganze Bauteil.
// - Der Grundpreis entfaellt, wenn die Cent-Rundung ihn um mehr als
//   2 Prozent verzerren wuerde (Rechnung und Begruendung in
//   app/lib/preis.ts, grundpreisAmount).
//
// Der Grundpreis rechnet netto durch die belegte Menge und ist als
// "netto" gekennzeichnet, damit er neben der Bruttozeile eindeutig
// bleibt.

export default function PreisDetails({
  nettoAmount,
  currencyCode,
  grundmenge = null,
  abPreis = false,
  className = "",
}: {
  nettoAmount: string;
  currencyCode: string;
  grundmenge?: Grundmenge | null;
  /** Bei "ab"-Preisen (Variantenspanne) traegt auch der Brutto ein "ab". */
  abPreis?: boolean;
  className?: string;
}) {
  if (currencyCode !== "EUR") return null;
  const grundpreis = grundmenge
    ? grundpreisAmount(nettoAmount, grundmenge.menge)
    : null;
  return (
    <div className={className}>
      <p className="text-[0.72rem] leading-snug text-muted">
        {abPreis ? "ab " : ""}
        {euroBetrag(bruttoAmount(nettoAmount))} inkl. {UST_PROZENT}% USt
      </p>
      {grundpreis && grundmenge && (
        <p className="text-[0.72rem] leading-snug text-muted">
          Grundpreis {euroBetrag(grundpreis)} / {EINHEIT_KURZ[grundmenge.einheit]} netto
        </p>
      )}
    </div>
  );
}
