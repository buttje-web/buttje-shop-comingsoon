"use client";

/*
  Der Hero-Knopf "Zum Sortiment" auf der Startseite.

  FRUEHER ein Verweis auf /produkte. Entscheidung Rami (08.08.2026): Die
  Ware sieht man ausschliesslich ueber die Kategorien - der Knopf scrollt
  jetzt sanft zu den sechs Kategorie-Kacheln weiter unten auf derselben
  Seite (Abschnitt id="sortiment" in app/page.tsx).

  WARUM ANKER PLUS ABFANGEN, statt nur eines von beiden:
  - Ohne Javascript bleibt href="#sortiment" ein echter Ankerverweis und
    springt zum Kachelabschnitt - der Knopf funktioniert immer.
  - Mit Javascript wird der Sprung abgefangen und durch scrollIntoView
    ersetzt. Das laesst die Adresse und den Verlauf unangetastet: Ein
    Anker wuerde "#sortiment" in die Adresszeile und den Verlauf
    schreiben, und der Zurueck-Knopf muesste danach zweimal gedrueckt
    werden. Ein Klick, der nur die Ansicht bewegt, gehoert nicht in den
    Verlauf (dieselbe Begruendung wie bei der Wortmarke).
  - scrollIntoView OHNE behavior-Angabe: weich oder hart entscheidet das
    scroll-behavior aus globals.css, und dort ist die Systemeinstellung
    "weniger Bewegung" bereits beruecksichtigt.

  Auf der internen Vorschauseite /vorschau-hero gibt es den Kachel-
  abschnitt nicht; dort greift die Absicherung (Ziel fehlt -> nichts tun),
  und der Knopf sieht trotzdem exakt aus wie auf der Startseite.
*/
export default function SortimentKnopf() {
  return (
    <a
      href="#sortiment"
      onClick={(e) => {
        /*
          preventDefault VOR der Zielpruefung, nicht danach: Sonst laeuft
          auf der Vorschauseite (kein Ankerziel vorhanden) der native
          Ankersprung durch und schreibt "#sortiment" in Adresse und
          Verlauf - genau das, was das Abfangen verhindern soll. Der
          Rueckfall ohne Javascript bleibt unberuehrt, denn ohne
          Javascript laeuft dieser Handler gar nicht.
        */
        e.preventDefault();
        document.getElementById("sortiment")?.scrollIntoView();
      }}
      className="inline-flex min-h-[48px] items-center border border-line-strong bg-[rgba(14,14,18,0.6)] px-7 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent"
    >
      Zum Sortiment →
    </a>
  );
}
