"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Die Wortmarke oben links.

  ZWEI FAELLE, EIN ELEMENT:
  Auf jeder Unterseite ist sie ein ganz normaler Verweis auf die
  Startseite. Auf der Startseite selbst fuehrt derselbe Verweis nirgendwo
  hin - das Ziel ist die Seite, auf der man schon steht. Wer weit unten
  steht und oben links klickt, erlebt heute: nichts passiert. Dort
  scrollt sie stattdessen sanft nach oben.

  WARUM KEIN VERWEIS AUF "#oben": Ein Sprungziel wuerde die Adresse um
  ein Rautezeichen ergaenzen und in den Verlauf schreiben. Der
  Zurueck-Knopf muesste danach zweimal gedrueckt werden, um die vorige
  Seite zu erreichen. Ein Klick, der nur die Ansicht bewegt, gehoert
  nicht in den Verlauf.

  BARRIEREFREIHEIT: Es bleibt ein echter Verweis mit href. Wer mit der
  Tastatur bedient, erreicht ihn wie bisher; ohne Javascript fuehrt er
  weiterhin zur Startseite. Nur der Klick auf der Startseite wird
  abgefangen.

  Wer im System "weniger Bewegung" eingestellt hat, bekommt keinen
  weichen Lauf, sondern den Sprung - scroll-behavior richtet sich in
  globals.css nach dieser Einstellung.
*/
export default function Wortmarke() {
  const pfad = usePathname();

  return (
    <Link
      href="/"
      onClick={(e) => {
        if (pfad !== "/") return; // Unterseite: normale Navigation
        e.preventDefault();
        // Bewusst OHNE behavior: "smooth". Ein ausdrueckliches smooth
        // schlaegt die Einstellung des Systems. Ohne Angabe gilt das
        // scroll-behavior aus globals.css - und dort ist "weniger
        // Bewegung" schon beruecksichtigt.
        window.scrollTo({ top: 0 });
      }}
      className="text-[1.4rem] font-extrabold lowercase tracking-[-0.04em] text-text transition-colors hover:text-accent"
    >
      buttje
    </Link>
  );
}
