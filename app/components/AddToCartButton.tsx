"use client";

import { useState, useTransition } from "react";
import { addItem } from "@/lib/cart/actions";
import { useCart } from "./CartContext";
import QuantityStepper from "./QuantityStepper";

// Mengenauswahl (Stepper) + Add-to-Cart. Ruft die Server-Action (Storefront
// Cart-API) auf und aktualisiert den Header-Zaehler sofort ueber den CartContext.

export default function AddToCartButton({
  merchandiseId,
  available,
}: {
  merchandiseId: string | null;
  available: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const { setCount } = useCart();

  const disabled = !merchandiseId || !available || pending;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} disabled={!available} />
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!merchandiseId) return;
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
          className="border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
        >
          {pending ? "Wird hinzugefügt..." : available ? "In den Warenkorb" : "Nicht verfügbar"}
        </button>
      </div>
      {error && <p className="text-[0.72rem] text-muted">{error}</p>}
    </div>
  );
}
