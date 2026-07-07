import Link from "next/link";
import ProductsNav from "./ProductsNav";
import MobileNav from "./MobileNav";
import Suche from "./Suche";

// Sticky Nav im dunklen buttje-Look.
// Desktop (>= lg): Kategorie-Dropdown + Links. Mobil/Tablet hochkant: Burger-Menue.

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(14,14,18,0.92)]">
      {/* Topbar - rechtlich erforderlicher, prominenter B2B-Hinweis (auf jeder Seite).
          Mobil kleiner + engere Sperrung, bricht sauber um, ueberlappt nicht. */}
      <div className="border-b border-line px-3 py-[8px] text-center text-[0.56rem] font-semibold uppercase leading-[1.5] tracking-[0.1em] sm:text-[0.64rem] sm:tracking-[0.18em]">
        Verkauf ausschließlich an Gewerbetreibende, Vereine und öffentliche
        Einrichtungen
      </div>

      <nav className="mx-auto flex h-[62px] w-full max-w-[1320px] items-center justify-between gap-3 px-[clamp(16px,5vw,64px)]">
        <Link
          href="/"
          className="grad-text text-[1.4rem] font-extrabold lowercase tracking-[-0.04em]"
        >
          buttje
        </Link>

        {/* Desktop-Navigation (Sichtbarkeit via .nav-desktop, Safari-sicher) */}
        <div className="nav-desktop items-center gap-[clamp(12px,2.2vw,30px)]">
          <ProductsNav />
          <Link
            href="/versand-zahlung"
            className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:text-accent"
          >
            Versand &amp; Zahlung
          </Link>
          <Suche variant="header" />
        </div>

        {/* Mobil/Tablet hochkant: Burger (via .nav-mobile) */}
        <div className="nav-mobile items-center gap-2">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
