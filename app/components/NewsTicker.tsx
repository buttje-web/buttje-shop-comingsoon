"use client";

import { useEffect, useState } from "react";
import { TICKER_MELDUNGEN, TICKER_TRENNER } from "../config/ticker";

/*
  Kopfleiste als Laufband. Ersetzt die frühere statische B2B-Zeile, behält
  aber deren Optik: schwarze Fläche, weiße Versalien, Akzentfarbe nur im
  Trennzeichen.

  Zwei Betriebsarten:
    normal            langsam laufendes Band, pausiert bei Hover und bei
                      Tastaturfokus
    reduced-motion    kein Lauf. Stattdessen wird alle 7 s die nächste
                      Meldung eingeblendet - statischer Wechsel ohne Bewegung.

  Die Animation selbst steht als UNgelayertes CSS in globals.css. Grund ist
  dieselbe Safari-Erfahrung wie bei der Navigation: Tailwind legt Utilities
  in @layer, ältere Safari ignorieren das teilweise.
*/

export default function NewsTicker() {
  const [reduziert, setReduziert] = useState(false);
  const [index, setIndex] = useState(0);

  // Erst nach dem Mounten prüfen, sonst weicht der Server-HTML ab.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduziert(mq.matches);
    const auf = (e: MediaQueryListEvent) => setReduziert(e.matches);
    mq.addEventListener("change", auf);
    return () => mq.removeEventListener("change", auf);
  }, []);

  useEffect(() => {
    if (!reduziert || TICKER_MELDUNGEN.length < 2) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % TICKER_MELDUNGEN.length),
      7000,
    );
    return () => clearInterval(t);
  }, [reduziert]);

  const klasseLeiste =
    "ticker-rahmen border-b border-line px-3 py-[8px] text-[0.56rem] font-semibold uppercase leading-[1.5] tracking-[0.1em] sm:text-[0.64rem] sm:tracking-[0.18em]";

  if (reduziert) {
    return (
      <div className={`${klasseLeiste} text-center`} aria-live="off">
        {TICKER_MELDUNGEN[index]}
      </div>
    );
  }

  // Zwei identische Durchläufe hintereinander: die Animation schiebt um
  // exakt 50 %, dadurch ist der Übergang nahtlos.
  const lauf = (
    <span className="ticker-satz">
      {TICKER_MELDUNGEN.map((m, i) => (
        <span key={i}>
          <span className="px-[1.1em] text-accent" aria-hidden>
            {TICKER_TRENNER}
          </span>
          {m}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`${klasseLeiste} overflow-hidden`}>
      {/* Für Vorlesesoftware genügt der Text einmal, ohne Trennzeichen. */}
      <span className="sr-only">{TICKER_MELDUNGEN.join(". ")}</span>
      <div className="ticker-spur" aria-hidden>
        {lauf}
        {lauf}
      </div>
    </div>
  );
}
