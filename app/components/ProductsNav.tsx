"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../categories";

/*
  "Produkte" in der Desktop-Leiste: REINER AUFKLAPPER, kein Verweis.

  Entscheidung Rami (08.08.2026): Die Ware sieht man ausschliesslich ueber
  die sechs Kategorien. Frueher steckte im Knopf zusaetzlich ein Link auf
  /produkte - ein Link im Knopf ist ungueltiges HTML, und die beiden Ziele
  lagen uebereinander, woran die target-size-Pruefung scheiterte. Beides
  ist mit dem Umbau weg. Die Seite /produkte bleibt bestehen, nur die
  Navigation fuehrt nicht mehr hin.

  BEDIENUNG:
  - Maus: Ueberfahren oeffnet, Verlassen schliesst nach 300 ms
    (Trigger + unsichtbarer Steg + Panel sind EIN Hover-Bereich,
    .pnav-panel-wrap ueberbrueckt die Luecke). Klick schaltet um.
  - Tastatur: Enter und Leertaste schalten um (natives Knopfverhalten),
    Escape schliesst und holt den Fokus auf den Knopf zurueck,
    Pfeil runter/rauf wandert durch die Kategorien, Pfeil runter auf dem
    geschlossenen Knopf oeffnet und springt auf die erste Kategorie.
  - aria-expanded am Knopf. Bewusst OHNE aria-haspopup, siehe Knopf.
  - Aussenklick schliesst (Safari-sicher ueber mousedown/touchstart).
*/

const CLOSE_DELAY_MS = 300;

export default function ProductsNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /*
    Fokusziel fuers Oeffnen per Pfeiltaste. Der Sprung auf den ersten
    bzw. letzten Eintrag darf erst passieren, wenn das Panel im Baum
    steht - und das garantiert nur ein Effekt NACH dem Rendern. Ein
    requestAnimationFrame im Tastatur-Handler kann je nach Ereignis-
    Prioritaet VOR dem Rendern feuern und greift dann ins Leere
    (gemessen, nicht vermutet).
  */
  const fokusZiel = useRef<"erster" | "letzter" | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeDelayed() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      /*
        Steht der Tastaturfokus gerade AUF einem Kategorie-Link, wird
        nicht geschlossen: mouseleave feuert auch, wenn jemand die Maus
        nur beiseiteschiebt, waehrend er mit den Pfeilen im Panel ist -
        das Panel unter dem Fokus wegzureissen liesse den Fokus auf body
        fallen und das naechste Tab am Seitenanfang beginnen.
        Maus-Nutzer trifft die Pruefung nie: Der Fokus liegt bei ihnen
        auf dem Knopf oder ausserhalb, nicht auf einem Panel-Link.
      */
      if (panelRef.current?.contains(document.activeElement)) return;
      setOpen(false);
    }, CLOSE_DELAY_MS);
  }

  /** Die Kategorie-Links im Panel, in Reihenfolge. */
  function eintraege(): HTMLAnchorElement[] {
    return Array.from(panelRef.current?.querySelectorAll("a") ?? []);
  }

  /*
    Pfeiltasten auf dem ganzen Bauteil, nicht nur auf dem Knopf: Der Fokus
    steht beim Wandern auf den Kategorie-Links, und auch von dort sollen
    die Pfeile weiterfuehren. Escape steht hier doppelt zum document-
    Listener - der dortige schliesst nur, dieser holt zusaetzlich den
    Fokus auf den Knopf zurueck, damit er nicht ins Leere faellt.
  */
  function onKeyDown(e: React.KeyboardEvent) {
    // Wer tippt, bedient per Tastatur: ein laufender Hover-Schliesstimer
    // ist dann hinfaellig und wuerde sonst mitten in der Bedienung feuern.
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (e.key === "Escape" && open) {
      setOpen(false);
      knopfRef.current?.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault(); // die Seite darf nicht mitscrollen

    if (!open) {
      // Pfeil auf dem geschlossenen Knopf: oeffnen und das Ziel merken.
      // Den Sprung selbst macht der Effekt unten, sobald das Panel steht.
      fokusZiel.current = e.key === "ArrowDown" ? "erster" : "letzter";
      setOpen(true);
      return;
    }
    const liste = eintraege();
    if (liste.length === 0) return;
    const dort = liste.indexOf(document.activeElement as HTMLAnchorElement);
    const schritt = e.key === "ArrowDown" ? 1 : -1;
    // Vom Knopf aus (dort === -1) fuehrt Pfeil runter auf den ersten,
    // Pfeil rauf auf den letzten Eintrag; sonst zyklisch weiter.
    const ziel = dort === -1
      ? (schritt === 1 ? 0 : liste.length - 1)
      : (dort + schritt + liste.length) % liste.length;
    liste[ziel]?.focus();
  }

  // Vorgemerkten Fokus-Sprung ausfuehren, sobald das Panel im Baum steht.
  useEffect(() => {
    if (!open || !fokusZiel.current) return;
    const liste = eintraege();
    (fokusZiel.current === "erster" ? liste[0] : liste[liste.length - 1])?.focus();
    fokusZiel.current = null;
  }, [open]);

  // Aussenklick + Escape schliessen sofort.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pnav-root"
      onMouseEnter={openNow}
      onMouseLeave={closeDelayed}
      onKeyDown={onKeyDown}
    >
      <button
        ref={knopfRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        /*
          BEWUSST KEIN aria-haspopup: Das Panel ist eine schlichte
          Linkliste (Aufklapp-Muster), kein Menue-Widget mit role="menu".
          aria-haspopup="menu" wuerde Vorlesesoftware ein Menue
          ankuendigen, das nie kommt - ARIA verlangt dann ein Element
          mit Menue-Rolle, und Menue-Rollen waeren fuer Seitennavigation
          das falsche Muster. aria-expanded allein ist hier richtig;
          die Pfeiltasten sind eine Zugabe, keine Menue-Semantik.
        */
        /*
          Innenabstand 13 Punkte oben und unten: 18,4 + 26 = 44,4 - das
          Beruehrungsziel, unsichtbar, weil der Knopf weder Rahmen noch
          Hintergrund hat. Frueher trug der Link IM Knopf diesen Abstand;
          jetzt, ohne inneren Link, traegt ihn der Knopf selbst.
        */
        className="flex items-center gap-1 py-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:text-accent"
      >
        Produkte
        <span aria-hidden className="text-[0.6em]">▾</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="pnav-panel-wrap"
          onMouseEnter={openNow}
          onMouseLeave={closeDelayed}
        >
          <div className="pnav-panel shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
            <ul className="divide-y divide-line py-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategorie/${c.slug}`}
                    className="block px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-text transition-colors hover:bg-[rgba(244,244,246,0.06)] hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
