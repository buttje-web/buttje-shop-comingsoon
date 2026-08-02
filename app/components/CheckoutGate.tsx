"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";
import { uidGueltig, uidNormalisieren, UID_FEHLER } from "../lib/uid";
import { setUidAttribut } from "@/lib/cart/actions";

/*
  B2B-Checkout-Gate (vorgelagert vor dem Shopify-Checkout).

  Rechtlicher Hintergrund: Damit der reine B2B-Status haelt, muss die
  Unternehmer-Bestaetigung unmittelbar vor dem Bestellvorgang erfolgen.
  Da der Shopify-Checkout (ohne Plus/Checkout Extensibility) keine eigene
  Pflicht-Checkbox erlaubt, sitzt die Bestaetigung hier im Frontend:
  Der Weg zur Kasse ist erst frei, wenn der Kunde bestaetigt, als
  Unternehmer zu handeln und die AGB zur Kenntnis genommen zu haben.

  Stufe 2: optionales UID-Feld mit reiner FORMATpruefung. Die UID bleibt
  freiwillig — ein leeres Feld sperrt nichts. Ist etwas eingetragen, muss
  es formal passen, sonst bleibt der Kassa-Knopf zu. Keine VIES-Abfrage:
  eine formal gueltige Nummer kann trotzdem erfunden sein.
*/

export default function CheckoutGate({ checkoutUrl }: { checkoutUrl: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const [uid, setUid] = useState("");
  // Fehler erst zeigen, wenn das Feld einmal verlassen wurde — nicht
  // schon beim ersten getippten Zeichen.
  const [uidBeruehrt, setUidBeruehrt] = useState(false);

  const uidOk = uidGueltig(uid);
  const uidFehler = uidBeruehrt && !uidOk;
  const frei = confirmed && uidOk;

  /*
    Die UID kann im Checkout nicht vorbefuellt werden — Shopify bietet dafuer
    keinen Weg. Damit sie trotzdem an der Bestellung ankommt, haengt sie als
    Bestell-Attribut am Warenkorb und ist spaeter im Admin sichtbar.

    Geschrieben wird beim Verlassen des Felds, nicht bei jedem Tastendruck:
    das spart Requests und schreibt nur fertige Eingaben. Ungueltige Eingaben
    werden gar nicht erst uebertragen. Schlaegt das Setzen fehl, passiert
    nichts weiter — der Weg zur Kassa bleibt davon unberuehrt.
  */
  async function uidSichern(wert: string) {
    setUidBeruehrt(true);
    if (!uidGueltig(wert)) return;
    await setUidAttribut(wert.trim() ? uidNormalisieren(wert) : "");
  }

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

      <div>
        <label
          htmlFor="uid"
          className="mb-1 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          UID-Nummer (optional)
        </label>
        <input
          id="uid"
          name="uid"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          onBlur={(e) => void uidSichern(e.target.value)}
          placeholder="ATU12345678"
          aria-invalid={uidFehler}
          aria-describedby={uidFehler ? "uid-fehler" : undefined}
          className={`w-full border bg-transparent px-3 py-2 text-[0.9rem] text-text placeholder:text-muted focus:outline-none focus:ring-1 ${
            uidFehler
              ? "border-[#ff6b6b] focus:ring-[#ff6b6b]"
              : "border-line-strong focus:border-accent focus:ring-accent"
          }`}
        />
        {uidFehler && (
          <p id="uid-fehler" role="alert" className="mt-1.5 text-[0.72rem] leading-relaxed text-[#ff6b6b]">
            {UID_FEHLER}
          </p>
        )}
      </div>

      {frei ? (
        <a
          href={checkoutUrl}
          onClick={() => trackEvent("checkout_started", uid ? { uid_angegeben: "ja" } : undefined)}
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
