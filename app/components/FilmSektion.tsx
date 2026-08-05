"use client";

import { useEffect, useRef, useState } from "react";

import KiLabel from "./KiLabel";

/*
  Film-Sektion der Startseite. Bewusst NICHT wie die alten Kategorie-Videos:
  kein Autoplay, kein Loop, kein stummes Vorschau-Abspielen.

  Bis zum Klick wird ausschliesslich das Posterbild geladen (das <video>-Element
  traegt preload="none" und bekommt die Quelle erst beim ersten Klick). Damit
  kostet die Sektion im Normalfall 65 KB statt 12 MB - wichtig, weil die Datei
  selbst gehostet wird.

  Ton laeuft mit, weil der Film Untertitel UND Sprache hat; gestartet wird er
  nur durch den Nutzer, deshalb ist das kein Autoplay-Problem.

  KI-KENNZEICHNUNG, Artikel 50 der EU-KI-Verordnung: Der Film ist
  fotorealistisch, zeigt eine Person und koennte als echte Aufnahme
  durchgehen. In die Datei laesst sich der Hinweis hier nicht brennen,
  also steht er als Ueberlagerung im Player - und zwar dauerhaft, nicht
  nur in den ersten Sekunden.

  ZWEI ECKEN, kein Zierrat: Solange das Standbild steht, sitzt die
  Kennzeichnung unten rechts wie bei allen anderen Bildern des Shops.
  Sobald abgespielt wird, erscheint dort die Bedienleiste. Wie hoch die
  ist, sagt kein Browser; ein fester Abstand nach oben waere geraten.
  Deshalb wandert das Label beim Start nach oben rechts, mit einer
  kurzen Einblendung, damit der Wechsel nicht als Sprung gelesen wird.

  DAS VOLLBILD IST DER GRUND FUER DEN EIGENEN KNOPF. Geht das
  <video>-Element selbst ins Vollbild, wird nur dieses Element in der
  obersten Ebene gezeichnet; alles andere aus diesem Kasten liegt
  ausserhalb und verschwindet - gemessen, nicht vermutet
  (fullscreenElement.contains(label) war false). Ein <video> kann auch
  keine sichtbaren Kindelemente aufnehmen, es laesst sich also nichts
  hineinschieben. Also geht der KASTEN ins Vollbild, mit Video und
  Kennzeichnung darin. Dazu:
    - controlsList="nofullscreen" legt den nativen Vollbildknopf still;
      weil Chromium ihn danach grau weiterzeichnet, nimmt ihn zusaetzlich
      die Regel .film-bedienleiste in globals.css ganz heraus,
    - disablePictureInPicture verhindert das Bild-im-Bild-Fenster, das
      dieselbe Luecke aufreissen wuerde,
    - der eigene Knopf ruft kasten.requestFullscreen(),
    - der Waechter auf fullscreenchange schaltet um, falls doch einmal
      das Video allein ins Vollbild geht.
  BEKANNTE GRENZE, abgenommen: controlsList ist eine Chromium-Regelung.
  Firefox ignoriert sie, dort greift nur der Waechter; auf iOS geht ein
  <video> immer allein ins Vollbild. Inline, und das ist der Normalfall,
  steht die Kennzeichnung in jedem Browser.
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
  const [vollbild, setVollbild] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const kasten = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function wechsel() {
      const el = document.fullscreenElement;
      setVollbild(el === kasten.current);
      // Waechter: Ist trotz nofullscreen das Video allein im Vollbild
      // gelandet, sofort auf den Kasten umschalten - sonst faellt die
      // Kennzeichnung fuer die Dauer des Vollbilds weg.
      if (el && el === ref.current && kasten.current) {
        document
          .exitFullscreen()
          .then(() => kasten.current?.requestFullscreen())
          .catch(() => {
            /* Browser laesst das Umschalten nicht zu - inline bleibt die
               Kennzeichnung, mehr ist von hier aus nicht zu machen. */
          });
      }
    }
    document.addEventListener("fullscreenchange", wechsel);
    return () => document.removeEventListener("fullscreenchange", wechsel);
  }, []);

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

  function vollbildUm() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      kasten.current?.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div
      ref={kasten}
      className={
        vollbild
          ? // Im Vollbild muessen die eigenen Masse weg, sonst haelt der
            // Browser den Kasten weiter bei 380 px mitten auf dem Schirm.
            "relative flex h-full w-full items-center justify-center bg-near-black"
          : "relative mx-auto aspect-[9/16] w-full max-w-[380px] overflow-hidden border border-line bg-near-black"
      }
    >
      {/* Innerer Kasten. Er hat immer genau das Format des Films, damit
          die Kennzeichnung auch im Vollbild an der Bildkante klebt und
          nicht irgendwo im schwarzen Rand steht. */}
      <div
        className={
          vollbild ? "relative h-full aspect-[9/16]" : "absolute inset-0"
        }
      >
        <video
          ref={ref}
          poster={poster}
          preload="none"
          playsInline
          controls={gestartet}
          controlsList="nofullscreen"
          disablePictureInPicture
          className="film-bedienleiste absolute inset-0 h-full w-full object-cover"
          aria-label={`${titel}. KI-generiert.`}
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

        {/* Eigener Vollbildknopf, oben links - die einzige freie Ecke:
            rechts steht die Kennzeichnung, unten die Bedienleiste. */}
        {gestartet && (
          <button
            type="button"
            onClick={vollbildUm}
            aria-label={vollbild ? "Vollbild beenden" : "Vollbild"}
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center bg-[rgba(14,14,18,0.65)] text-text transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="fill-current">
              {vollbild ? (
                <path d="M5 0H4v3H1v1h4V0zm5 0H9v4h4V3h-3V0zM0 9v1h3v3h1V9H0zm9 0v4h1v-3h3V9H9z" />
              ) : (
                <path d="M0 0h5v1H1v3H0V0zm9 0h5v4h-1V1H9V0zM0 9h1v3h3v1H0V9zm13 0h1v4H9v-1h4V9z" />
              )}
            </svg>
          </button>
        )}

        {/* KI-Kennzeichnung. Standbild unten rechts wie ueberall sonst im
            Shop, waehrend der Wiedergabe oben rechts ueber der
            Bedienleiste. Dichterer Kasten als bei den Standbildern, weil
            der Schnitt auf Weiss blendet - Begruendung in KiLabel.

            pointer-events-none am Standbild-Label, damit der Klick
            durchgeht: darunter liegt der Startknopf, der die ganze
            Flaeche einnimmt. Ohne das waere die untere rechte Ecke die
            einzige Stelle des Films, an der ein Klick nichts tut. Fuer
            den Bildschirmleser aendert das nichts. */}
        {gestartet ? (
          <KiLabel
            lage="oben"
            stark
            className="pointer-events-none animate-[sanft-ein_260ms_ease-out]"
          />
        ) : (
          <KiLabel stark className="pointer-events-none" />
        )}
      </div>
    </div>
  );
}
