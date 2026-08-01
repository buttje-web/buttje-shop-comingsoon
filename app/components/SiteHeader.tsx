import Link from "next/link";
import ProductsNav from "./ProductsNav";
import MobileNav from "./MobileNav";
import Suche from "./Suche";
import CartLink from "./CartLink";
import NewsTicker from "./NewsTicker";
import { KAUFBAR } from "../lib/shop-mode";

// Sticky Nav im dunklen buttje-Look.
// Desktop (>= lg): Kategorie-Dropdown + Links. Mobil/Tablet hochkant: Burger-Menue.

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(14,14,18,0.92)]">
      {/* Topbar als News-Ticker. Die erste Meldung ist weiterhin der
          rechtlich erforderliche B2B-Hinweis; Inhalte in app/config/ticker.ts. */}
      <NewsTicker />

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
          {/* Warenkorb-Link nur im Kaufmodus */}
          {KAUFBAR && <CartLink />}
        </div>

        {/* Mobil/Tablet hochkant: Burger (via .nav-mobile) */}
        <div className="nav-mobile items-center gap-2">
          {KAUFBAR && <CartLink />}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
