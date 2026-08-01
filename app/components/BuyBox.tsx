"use client";

import { useState, useTransition } from "react";
import { addItem } from "@/lib/cart/actions";
import { trackEvent } from "../lib/analytics";
import { useCart } from "./CartContext";
import QuantityStepper from "./QuantityStepper";
import PriceTag from "./PriceTag";
import { VERSAND, VERSAND_AB, GRATIS_BIS_KG, euro } from "../lib/versand";
import type { ProductVariant, Money } from "@/lib/shopify/types";

// Kaufbereich: Verpackungseinheit-Auswahl (Varianten) VOR der Mengenauswahl.
// Menge bezieht sich auf die gewaehlte Einheit. Jede Variante hat eigene SKU/Preis.

export default function BuyBox({
  variants,
  fallbackPrice,
  productHandle,
}: {
  variants: ProductVariant[];
  fallbackPrice: Money;
  productHandle: string;
}) {
  const first = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selectedId, setSelectedId] = useState<string | null>(first?.id ?? null);
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { setCount } = useCart();

  const selected = variants.find((v) => v.id === selectedId) ?? first ?? null;
  const price = selected?.price ?? fallbackPrice;
  const available = selected?.availableForSale ?? false;
  const merchandiseId = selected?.id ?? null;
  // 0,00 heisst "noch nicht kalkuliert": anzeigen als "Preis auf Anfrage",
  // und die Einheit ist NICHT in den Warenkorb legbar.
  const preisOffen = !(Number(price?.amount) > 0);
  const disabled = !merchandiseId || !available || preisOffen || pending;

  return (
    <div>
      {/* Verpackungseinheit-Auswahl */}
      {variants.length > 0 && (
        <div className="mb-6">
          <p className="eyebrow mb-2">Verpackungseinheit</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === selectedId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  aria-pressed={active}
                  disabled={!v.availableForSale}
                  className={`min-h-[44px] border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors disabled:opacity-40 ${
                    active
                      ? "border-accent text-accent"
                      : "border-line-strong text-text hover:border-accent hover:text-accent"
                  }`}
                >
                  {v.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preis der gewaehlten Einheit */}
      <p className="text-lg font-semibold">
        {preisOffen ? (
          <span className="text-muted">Preis auf Anfrage</span>
        ) : (
          <PriceTag amount={price.amount} currency={price.currencyCode} />
        )}
      </p>

      {preisOffen && (
        <p className="mt-2 max-w-[42ch] text-[0.78rem] leading-relaxed text-muted">
          Für diese Verpackungseinheit nennen wir Ihnen den Preis gern direkt —
          per{" "}
          <a
            href="https://wa.me/4367762080802"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            WhatsApp
          </a>{" "}
          oder{" "}
          <a
            href="mailto:shop@buttje.at"
            className="text-accent underline underline-offset-2"
          >
            shop@buttje.at
          </a>
          .
        </p>
      )}

      {/* Menge + In den Warenkorb */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} disabled={!available || preisOffen} />
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!merchandiseId) return;
            trackEvent("add_to_cart", { handle: productHandle });
            setError(null);
            startTransition(async () => {
              try {
                const total = await addItem(merchandiseId, qty);
                setCount(total);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Fehler");
              }
            });
          }}
          className="min-h-[44px] border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
        >
          {pending
            ? "Wird hinzugefügt..."
            : preisOffen
              ? "Preis auf Anfrage"
              : available
                ? "In den Warenkorb"
                : "Nicht verfügbar"}
        </button>
      </div>
      {error && <p className="mt-2 text-[0.72rem] text-muted">{error}</p>}

      {/* Versand-Kurzinfo (Werte zentral in app/lib/versand.ts) */}
      <p className="mt-3 text-[0.66rem] text-muted">
        Versand ab {euro(VERSAND_AB)} — versandkostenfrei ab{" "}
        {euro(VERSAND.freiAb)} netto (bis {GRATIS_BIS_KG} kg).
      </p>
    </div>
  );
}
