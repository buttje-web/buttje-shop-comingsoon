"use client";

import { useState, useTransition } from "react";
import { addItem } from "@/lib/cart/actions";
import { trackEvent } from "../lib/analytics";
import { useCart } from "./CartContext";
import QuantityStepper from "./QuantityStepper";
import PriceTag from "./PriceTag";
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
  const disabled = !merchandiseId || !available || pending;

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
        <PriceTag amount={price.amount} currency={price.currencyCode} />
      </p>

      {/* Menge + In den Warenkorb */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} disabled={!available} />
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
          {pending ? "Wird hinzugefügt..." : available ? "In den Warenkorb" : "Nicht verfügbar"}
        </button>
      </div>
      {error && <p className="mt-2 text-[0.72rem] text-muted">{error}</p>}

      {/* Versand-Kurzinfo (Preise: siehe Versand & Zahlung; Schwelle = FreeShippingBar) */}
      <p className="mt-3 text-[0.66rem] text-muted">
        Versand DE 5,95 / AT 9,90 - versandkostenfrei ab 100 EUR netto.
      </p>
    </div>
  );
}
