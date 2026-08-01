"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";

/*
  B2B-Checkout-Gate (vorgelagert vor dem Shopify-Checkout).

  Rechtlicher Hintergrund: Damit der reine B2B-Status haelt, muss die
  Unternehmer-Bestaetigung unmittelbar vor dem Bestellvorgang erfolgen.
  Da der Shopify-Checkout (ohne Plus/Checkout Extensibility) keine eigene
  Pflicht-Checkbox erlaubt, sitzt die Bestaetigung hier im Frontend:
  Der Weg zur Kasse ist erst frei, wenn der Kunde bestaetigt, als
  Unternehmer zu handeln und die AGB zur Kenntnis genommen zu haben.
*/

export default function CheckoutGate({ checkoutUrl }: { checkoutUrl: string }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer items-start gap-3 py-1 text-[0.8rem] leading-relaxed text-text-soft">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-[2px] h-5 w-5 shrink-0 accent-[var(--accent)]"
          aria-describedby="b2b-confirm-text"
        />
        <span id="b2b-confirm-text">
          Ich bestätige, die Bestellung als Unternehmer und nicht als Verbraucher
          zu tätigen. Ich habe die{" "}
          <Link href="/agb" className="text-accent underline underline-offset-2">
            AGB
          </Link>{" "}
          zur Kenntnis genommen.
        </span>
      </label>

      {confirmed ? (
        <a
          href={checkoutUrl}
          onClick={() => trackEvent("checkout_started")}
          className="block border border-line-strong px-6 py-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          Weiter zur Kasse →
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="block w-full cursor-not-allowed border border-line px-6 py-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.2em] opacity-40"
        >
          Weiter zur Kasse →
        </button>
      )}

      <p className="text-[0.66rem] leading-relaxed text-muted">
        Alle Preise netto zzgl. USt. Verkauf ausschließlich an Unternehmer,
        Gewerbetreibende und öffentliche Einrichtungen.
      </p>
      <p className="text-[0.62rem] leading-relaxed text-muted opacity-80">
        Sichere Zahlung per Karte oder EPS-Überweisung. Rechnung mit
        ausgewiesener USt erhalten Sie automatisch per E-Mail.
      </p>
    </div>
  );
}
