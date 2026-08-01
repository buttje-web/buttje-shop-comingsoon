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
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 py-8">
          {LEGAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          {/* Externer Kanal. rel="noopener": kein Zugriff auf window.opener. */}
          <a
            href="https://www.youtube.com/@buttje-wien"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
          >
            <svg width="16" height="12" viewBox="0 0 24 17" aria-hidden className="fill-current">
              <path d="M23.5 2.7A3 3 0 0 0 21.4.6C19.6 0 12 0 12 0S4.4 0 2.6.6A3 3 0 0 0 .5 2.7 31 31 0 0 0 0 8.5c0 2 .2 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.8.5-5.8s-.2-3.9-.5-5.8ZM9.5 12.1V4.9l6.4 3.6-6.4 3.6Z" />
            </svg>
            YouTube
          </a>
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
