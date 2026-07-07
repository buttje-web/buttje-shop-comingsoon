import Link from "next/link";

// Footer mit den Pflichtseiten-Links (Struktur jetzt, Inhalt spaeter).

const LEGAL = [
  { href: "/faq", label: "FAQ" },
  { href: "/impressum", label: "Impressum" },
  { href: "/agb", label: "AGB" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/versand-zahlung", label: "Versand & Zahlung" },
  { href: "/widerruf", label: "Widerruf" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1320px] px-[clamp(18px,5vw,64px)]">
        <nav className="flex flex-wrap gap-x-6 gap-y-3 py-8">
          {LEGAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="border-t border-line pt-5 text-[0.72rem] text-muted">
          Alle Preise netto zuzüglich gesetzlicher Umsatzsteuer.
        </p>
        <div className="flex flex-wrap justify-between gap-[10px] py-[22px] text-[0.72rem] uppercase tracking-[0.1em] text-muted">
          <span>© 2026 buttje e.U. · Wien</span>
          <span>shop.buttje.at</span>
        </div>
      </div>
    </footer>
  );
}
