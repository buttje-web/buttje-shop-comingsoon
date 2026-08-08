"use client";

import { useSyncExternalStore } from "react";
import { MAIL_LESBAR, mailKlartext } from "../lib/kontakt";

// E-Mail-Adresse, die nicht im Quelltext steht.
//
// Serverseitig gerendert wird ausschliesslich die lesbare Ersatzform
// ("shop at buttje punkt at"). Erst im Browser entsteht daraus die echte
// Adresse samt mailto-Verweis. Damit findet ein Harvester im HTML nichts,
// ein Besucher sieht und klickt aber wie gewohnt.
//
// WARUM useSyncExternalStore UND KEIN useEffect + useState: Ein setState
// direkt im Effekt-Rumpf verstoesst gegen react-hooks/set-state-in-effect
// und loest eine zusaetzliche Renderrunde aus. useSyncExternalStore liefert
// beim Server- und beim Hydrations-Render "false" und danach "true" - ohne
// Hydrations-Warnung und ohne eigenen Zustand.

const nichtsAbonnieren = () => () => {};
const imBrowser = () => true;
const aufDemServer = () => false;

export default function EMailLink({
  className,
  betreff,
  nachtext,
}: {
  className?: string;
  /** Optionaler Betreff fuer den mailto-Verweis. */
  betreff?: string;
  /** Zusatz hinter der Adresse, INNERHALB des Verweises (z. B. ein Pfeil). */
  nachtext?: string;
}) {
  const hydriert = useSyncExternalStore(nichtsAbonnieren, imBrowser, aufDemServer);

  if (!hydriert) {
    // Ohne JavaScript bleibt es bei dieser Zeile. Sie ist die
    // Pflichtangabe: lesbar, aber nicht maschinell abgreifbar.
    return (
      <span className={className}>
        {MAIL_LESBAR}
        {nachtext}
      </span>
    );
  }

  const adresse = mailKlartext();
  const ziel = betreff
    ? `mailto:${adresse}?subject=${encodeURIComponent(betreff)}`
    : `mailto:${adresse}`;

  return (
    <a className={className} href={ziel}>
      {adresse}
      {nachtext}
    </a>
  );
}
