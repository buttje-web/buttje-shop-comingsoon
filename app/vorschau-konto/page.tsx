import type { Metadata } from "next";
import Container from "../components/Container";
import KontoLink from "../components/KontoLink";

/*
  NUR VORSCHAU - kein Bestandteil des Shops.

  Vergleichsseite fuer den neuen Konto-Einstieg in der Kopfleiste:
  Fassung A (Symbol + KONTO) gegen Fassung B (zusaetzlich graue
  Unterzeile "Bestellungen und Nachbestellen"). Die Entscheidung
  trifft Rami am Bildschirm; im echten Header haengt die Wahl am
  Prop kontoFassung von SiteHeader.

  Wie /vorschau-hero: nirgends verlinkt, keine Sitemap, kein Index.
  Die Kopfleiste ganz oben auf dieser Seite ist der echte Header im
  Arbeitsstand (Fassung A) - die beiden Kaesten darunter zeigen nur
  den Ausschnitt um Konto/Lupe/Sackerl im Vergleich.
*/

export const metadata: Metadata = {
  title: "Vorschau Konto-Einstieg",
  robots: { index: false, follow: false },
};

// Nachbau des rechten Leistenabschnitts: Konto neben Lupe (statisch
// angedeutet) und Sackerl, vor demselben dunklen Grund wie im Header.
function LeistenAusschnitt({ fassung }: { fassung: "a" | "b" }) {
  return (
    <div className="flex h-[62px] items-center justify-end gap-[clamp(12px,2.2vw,30px)] border border-line bg-[rgba(14,14,18,0.92)] px-6">
      <span className="py-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text">
        Versand &amp; Zahlung
      </span>
      <KontoLink variant="leiste" fassung={fassung} />
      {/* Lupe als statische Andeutung, damit die Nachbarschaft stimmt */}
      <span aria-hidden className="flex h-10 w-10 items-center justify-center text-text">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.2" y2="16.2" />
        </svg>
      </span>
      <span
        aria-hidden
        className="flex min-h-[44px] items-center gap-2 border border-line-strong px-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.6 8h10.8l1.7 12.6a1 1 0 0 1-1 1.1H5.9a1 1 0 0 1-1-1.1L6.6 8Z" />
          <path d="M8.8 8V6.4a3.2 3.2 0 0 1 6.4 0V8" />
        </svg>
        (0)
      </span>
    </div>
  );
}

export default function VorschauKontoPage() {
  return (
    <Container className="py-12">
      <p className="eyebrow">Interne Vorschau</p>
      <h1 className="mt-3 text-[1.6rem] font-black uppercase tracking-[-0.02em]">
        Konto-Einstieg: Fassung A gegen Fassung B
      </h1>
      <p className="mt-4 max-w-[60ch] text-[0.9rem] leading-relaxed text-text-soft">
        Beide Kaesten zeigen den rechten Abschnitt der Kopfleiste. Der
        Konto-Verweis fuehrt in beiden Fassungen auf konto.buttje.at.
        Die Kopfleiste ganz oben ist der echte Arbeitsstand (Fassung&nbsp;A).
      </p>

      <h2 className="mt-10 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-muted">
        Fassung A - Symbol + Konto
      </h2>
      <div className="mt-3">
        <LeistenAusschnitt fassung="a" />
      </div>

      <h2 className="mt-10 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-muted">
        Fassung B - zusaetzlich Unterzeile
      </h2>
      <div className="mt-3">
        <LeistenAusschnitt fassung="b" />
      </div>

      <p className="mt-10 text-[0.8rem] leading-relaxed text-muted">
        Diese Seite ist nicht verlinkt und nicht Teil des Shops.
      </p>
    </Container>
  );
}
