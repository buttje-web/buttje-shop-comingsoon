import type { JSX } from "react";

/*
  Konto-Einstieg in der Kopfleiste. Ziel ist konto.buttje.at - eine eigene
  Adresse ausserhalb dieser App, deshalb ein einfaches <a> und KEIN
  next/link (Link prefetcht nur interne Routen, extern bringt er nichts).

  Fassung A (Symbol + KONTO, ohne Unterzeile) - Entscheidung Rami,
  09.08.2026. Fassung B mit Unterzeile und die Vergleichsseite
  /vorschau-konto sind mit derselben Entscheidung entfallen.

  Drei Erscheinungsformen:
  - variant="leiste":  Desktop-Kopfleiste, Symbol + Wort KONTO.
  - variant="kompakt": schmale Kopfleiste (< 1024 px), nur das Symbol im
                       44er-Rahmen, gleiche Machart wie Sackerl und Burger.
  - variant="menue":   Texteintrag im Burger-Menue, gleiche Typografie wie
                       die uebrigen Menuepunkte.

  Beruehrungsziel: wie bei ProductsNav ueber Innenabstand geloest, nicht
  ueber sichtbare Groesse - der Verweis hat weder Rahmen noch Hintergrund.
  18,4 px Zeile + 2 x 13 px = 44,4 px.

  Vorlesesoftware: aria-label beginnt mit dem sichtbaren Wort "Konto"
  (Label-in-Name-Regel) und sagt dann, was dahinter liegt. Beim reinen
  Symbol (kompakt) ist das Label der einzige Text.
*/

const KONTO_URL = "https://konto.buttje.at";
const ARIA_LABEL = "Konto: Bestellungen und Nachbestellen";

// Personen-Symbol: Kopf + Schulterbogen. Groesse, Strichstaerke und
// Linienenden identisch zur Header-Lupe (18 px, Strich 2, runde Kappen).
function PersonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="7.5" r="3.8" />
      <path d="M5.2 20.4a6.8 6.8 0 0 1 13.6 0" />
    </svg>
  );
}

export default function KontoLink({
  variant = "leiste",
  onNavigiert,
}: {
  variant?: "leiste" | "kompakt" | "menue";
  onNavigiert?: () => void;
}): JSX.Element {
  if (variant === "menue") {
    return (
      <a
        href={KONTO_URL}
        aria-label={ARIA_LABEL}
        onClick={onNavigiert}
        className="block py-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-text"
      >
        Konto
      </a>
    );
  }

  if (variant === "kompakt") {
    // Nur das Symbol: Das Wort darf auf schmalen Schirmen entfallen.
    // 44er-Rahmen wie Sackerl und Burger daneben.
    return (
      <a
        href={KONTO_URL}
        aria-label={ARIA_LABEL}
        className="flex h-11 w-11 items-center justify-center border border-line-strong text-text transition-colors hover:border-accent hover:text-accent"
      >
        <PersonIcon />
      </a>
    );
  }

  return (
    <a
      href={KONTO_URL}
      aria-label={ARIA_LABEL}
      className="flex items-center gap-2 py-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:text-accent"
    >
      <PersonIcon />
      Konto
    </a>
  );
}
