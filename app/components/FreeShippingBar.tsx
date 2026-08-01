// Fortschrittsanzeige zur Versandfrei-Schwelle (Werte aus app/lib/versand.ts).
// Reine Darstellung aus dem Warenkorb-Nettowert; aktualisiert mit dem Server-Refresh.
//
// Der Gratisversand gilt in Shopify NUR in der untersten Gewichtsstufe. Eine
// Sendung ueber dieser Grenze bleibt auch oberhalb des Schwellenwerts
// kostenpflichtig — deshalb darf hier nicht pauschal "versandkostenfrei"
// stehen, sobald der Warenwert erreicht ist.

import {
  VERSAND,
  GRATIS_BIS_KG,
  MAX_KG,
  tarifFuerGewicht,
  euro,
} from "../lib/versand";

const THRESHOLD = VERSAND.freiAb;

export default function FreeShippingBar({
  amount,
  gewichtKg = 0,
  gewichtBekannt = false,
}: {
  amount: number;
  /** Sendungsgewicht in kg, aus den Variantengewichten summiert. */
  gewichtKg?: number;
  /** false, wenn mindestens eine Position kein gepflegtes Gewicht hat. */
  gewichtBekannt?: boolean;
}) {
  const wertErreicht = amount >= THRESHOLD;
  const remaining = Math.max(0, THRESHOLD - amount);
  const pct = Math.min(100, Math.round((amount / THRESHOLD) * 100));

  // Zu schwer fuer Gratisversand — nur aussagen, wenn das Gewicht belastbar ist.
  const zuSchwer = gewichtBekannt && gewichtKg > GRATIS_BIS_KG;
  const ueberMax = gewichtBekannt && gewichtKg > MAX_KG;
  const tarif = gewichtBekannt ? tarifFuerGewicht(gewichtKg) : null;
  // Der Fortschrittsbalken hat nur Sinn, wenn das Ziel erreichbar ist.
  const balkenZeigen = !zuSchwer && !ueberMax;

  return (
    <div className="mb-6">
      <p className="mb-2 text-[0.78rem] leading-snug">
        {ueberMax ? (
          <span className="font-semibold">
            Sendung über {MAX_KG} kg — Versand auf Anfrage
          </span>
        ) : zuSchwer ? (
          <>
            <span className="font-semibold">
              Versand {tarif !== null ? euro(tarif) : ""}
            </span>{" "}
            — bei {gewichtKg.toLocaleString("de-AT", { maximumFractionDigits: 1 })} kg
            greift der Gratisversand nicht
          </>
        ) : wertErreicht ? (
          <span className="font-semibold text-accent">Versandkostenfrei</span>
        ) : (
          <>
            Noch <span className="font-semibold">{euro(remaining)}</span> bis zum
            kostenlosen Versand
          </>
        )}
      </p>
      {/* Balken nur, solange Gratisversand ueberhaupt erreichbar ist. Ein
          voller Balken neben "greift nicht" wuerde sich selbst widersprechen. */}
      {balkenZeigen && (
        <div
          className="h-2 w-full overflow-hidden rounded-full border border-[rgba(244,244,246,0.22)] bg-[rgba(244,244,246,0.06)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Fortschritt bis zum kostenlosen Versand"
        >
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background: wertErreicht ? "var(--accent)" : "var(--grad)",
              backgroundSize: "240% 240%",
            }}
          />
        </div>
      )}
      <p className="mt-1.5 text-[0.64rem] text-muted">
        Kostenloser Versand ab {euro(THRESHOLD)} (netto) innerhalb{" "}
        {VERSAND.land}s, bei Sendungen bis {GRATIS_BIS_KG} kg. Schwerere
        Sendungen werden nach Gewicht gestaffelt berechnet.
      </p>
    </div>
  );
}
