// Fortschrittsanzeige zur Versandfrei-Schwelle (Werte aus app/lib/versand.ts).
// Reine Darstellung aus dem Warenkorb-Nettowert; aktualisiert mit dem Server-Refresh.

import { VERSAND, euro } from "../lib/versand";

const THRESHOLD = VERSAND.freiAb;

export default function FreeShippingBar({ amount }: { amount: number }) {
  const reached = amount >= THRESHOLD;
  const remaining = Math.max(0, THRESHOLD - amount);
  const pct = Math.min(100, Math.round((amount / THRESHOLD) * 100));

  return (
    <div className="mb-6">
      <p className="mb-2 text-[0.78rem] leading-snug">
        {reached ? (
          <span className="font-semibold text-accent">Versandkostenfrei</span>
        ) : (
          <>
            Noch{" "}
            <span className="font-semibold">{euro(remaining)}</span> bis zum
            kostenlosen Versand
          </>
        )}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(244,244,246,0.1)]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background: reached ? "var(--accent)" : "var(--grad)",
            backgroundSize: "240% 240%",
          }}
        />
      </div>
      <p className="mt-1.5 text-[0.64rem] text-muted">
        Kostenloser Versand ab {euro(THRESHOLD)} (netto) innerhalb {VERSAND.land}s.
      </p>
    </div>
  );
}
