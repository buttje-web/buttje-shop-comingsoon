"use client";

import { useRef, useState } from "react";

/*
  Film-Sektion der Startseite. Bewusst NICHT wie die alten Kategorie-Videos:
  kein Autoplay, kein Loop, kein stummes Vorschau-Abspielen.

  Bis zum Klick wird ausschliesslich das Posterbild geladen (das <video>-Element
  traegt preload="none" und bekommt die Quelle erst beim ersten Klick). Damit
  kostet die Sektion im Normalfall 65 KB statt 12 MB — wichtig, weil die Datei
  selbst gehostet wird.

  Ton laeuft mit, weil der Film Untertitel UND Sprache hat; gestartet wird er
  nur durch den Nutzer, deshalb ist das kein Autoplay-Problem.
*/

export default function FilmSektion({
  src,
  poster,
  titel,
}: {
  src: string;
  poster: string;
  titel: string;
}) {
  const [gestartet, setGestartet] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  function starten() {
    setGestartet(true);
    // Quelle erst jetzt setzen, dann abspielen.
    const v = ref.current;
    if (!v) return;
    v.src = src;
    v.play().catch(() => {
      /* Nutzer kann ueber die nativen Bedienelemente starten */
    });
  }

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[380px] overflow-hidden border border-line bg-near-black">
      <video
        ref={ref}
        poster={poster}
        preload="none"
        playsInline
        controls={gestartet}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={titel}
      />

      {!gestartet && (
        <button
          type="button"
          onClick={starten}
          aria-label={`${titel} abspielen`}
          className="group absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Abdunklung, damit der Knopf auf hellen Frames sicher lesbar bleibt */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[rgba(14,14,18,0.28)] transition-colors group-hover:bg-[rgba(14,14,18,0.14)]"
          />
          <span
            aria-hidden
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(244,244,246,0.72)] bg-[rgba(14,14,18,0.55)] backdrop-blur-[2px] transition-colors group-hover:border-accent"
          >
            {/* Play-Dreieck, optisch leicht nach rechts versetzt */}
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              className="ml-[3px] fill-current text-text transition-colors group-hover:text-accent"
              aria-hidden
            >
              <path d="M0 0v22l20-11z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
