"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { addItem } from "@/lib/cart/actions";
import { trackEvent } from "../lib/analytics";
import { useCart } from "./CartContext";
import QuantityStepper from "./QuantityStepper";

/*
  Menge und Sackerl-Knopf direkt auf der Produktkachel.

  WARUM EIN EIGENES BAUTEIL: Die Kachel selbst bleibt eine
  Server-Komponente. Nur dieser Streifen braucht Zustand (Menge, Senden,
  Rueckmeldung) und wird deshalb allein zum Client geschickt. Die Faelle
  "mehrere Varianten" und "Preis auf Anfrage" fuehren nur auf die
  Produktseite - das sind einfache Links und liegen weiter im Server-Teil,
  damit dafuer kein Javascript ausgeliefert wird.

  AUSSERHALB DES LINKS: Dieser Streifen ist ein Geschwister der
  Produktverknuepfung, kein Kind. Deshalb braucht es kein
  stopPropagation - ein Klick hier kann die Produktseite gar nicht
  oeffnen, auch nicht bei Tastaturbedienung.

  DIE MENGE ZAEHLT VERPACKUNGSEINHEITEN. Eine 1 ist eine VE, nicht ein
  Stueck. Die VE-Zeile steht unmittelbar darueber und sagt, was das ist.
*/

const HOECHSTMENGE = 99;
const GELEGT_MS = 2000;
const MELDUNG_FEHLER = "Konnte nicht hinzugefügt werden. Bitte erneut versuchen.";

export default function KachelKauf({
  variantId,
  titel,
  handle,
}: {
  variantId: string;
  titel: string;
  handle: string;
}) {
  const [menge, setMenge] = useState(1);
  const [gelegt, setGelegt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { setCount } = useCart();
  const uhr = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Der Rueckmeldezustand haengt an einer Uhr. Verlaesst die Kachel den
  // Bildschirm (Filter, Seitenwechsel), muss die Uhr weg, sonst setzt sie
  // Zustand auf ein Bauteil, das es nicht mehr gibt.
  useEffect(() => () => {
    if (uhr.current) clearTimeout(uhr.current);
  }, []);

  function legen() {
    setFehler(null);
    startTransition(async () => {
      try {
        const ergebnis = await addItem(variantId, menge);
        if (!ergebnis.ok) {
          // Die Server-Action liefert ausfuehrliche Meldungen. Auf der
          // Kachel ist dafuer kein Platz und kein Anlass: hier steht eine
          // Zeile, die zum erneuten Versuch auffordert. Wer mehr wissen
          // will, landet ueber die Produktseite bei der langen Fassung.
          setFehler(MELDUNG_FEHLER);
          return;
        }
        setCount(ergebnis.anzahl);
        setMenge(1);
        setGelegt(true);
        if (uhr.current) clearTimeout(uhr.current);
        uhr.current = setTimeout(() => setGelegt(false), GELEGT_MS);
        trackEvent("add_to_cart", { handle, von: "kachel" });
      } catch {
        setFehler(MELDUNG_FEHLER);
      }
    });
  }

  return (
    <div>
      <QuantityStepper
        value={menge}
        onChange={setMenge}
        disabled={pending}
        max={HOECHSTMENGE}
        klein
        breit
      />
      <button
        type="button"
        onClick={legen}
        disabled={pending}
        aria-label={`${titel} ins Sackerl legen`}
        className={
          "mt-2 h-8 w-full border border-accent bg-transparent px-2 " +
          "text-[0.64rem] font-bold uppercase leading-none tracking-[0.16em] text-accent " +
          "transition-colors enabled:hover:bg-[rgba(92,200,255,0.12)] disabled:opacity-40"
        }
      >
        {gelegt ? "Im Sackerl" : "Ins Sackerl"}
      </button>
      {fehler && (
        <p className="mt-2 text-[0.7rem] leading-snug text-muted">{fehler}</p>
      )}
    </div>
  );
}
