"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BildPlatzhalter from "../components/BildPlatzhalter";
import PriceTag from "../components/PriceTag";
import EMailLink from "../components/EMailLink";
import { bereiteVor, suche, type SuchEintrag } from "@/lib/suche";
import { einheitenSchuetzen } from "../lib/titel";

// Ergebnisseite: liest den Suchbegriff aus dem URL-Hash (#q=...), damit er
// den Browser nie verlaesst (kein Server-Log, keine Dritten). Suche laeuft
// client-seitig ueber den Produktindex; Raster im Katalog-Look.

export default function SuchErgebnisse({ kaufbar }: { kaufbar: boolean }) {
  const [query, setQuery] = useState("");
  const [treffer, setTreffer] = useState<SuchEintrag[] | null>(null);
  const vorbereitetRef = useRef<ReturnType<typeof bereiteVor>>([]);

  useEffect(() => {
    let aktiv = true;

    function hashQuery(): string {
      const m = window.location.hash.match(/q=([^&]*)/);
      return m ? decodeURIComponent(m[1]) : "";
    }

    async function initialisieren() {
      const r = await fetch("/api/suchindex");
      const d = (await r.json()) as { produkte: SuchEintrag[] };
      if (!aktiv) return;
      vorbereitetRef.current = bereiteVor(d.produkte ?? []);
      const q = hashQuery();
      setQuery(q);
      setTreffer(q ? suche(vorbereitetRef.current, q) : []);
    }
    initialisieren();

    const beiHash = () => {
      const q = hashQuery();
      setQuery(q);
      setTreffer(q ? suche(vorbereitetRef.current, q) : []);
    };
    window.addEventListener("hashchange", beiHash);
    return () => {
      aktiv = false;
      window.removeEventListener("hashchange", beiHash);
    };
  }, []);

  function tippt(wert: string) {
    setQuery(wert);
    setTreffer(wert.trim() ? suche(vorbereitetRef.current, wert) : []);
    // Hash still nachziehen (ohne Navigation), damit Reload/Teilen funktioniert
    history.replaceState(null, "", wert.trim() ? `#q=${encodeURIComponent(wert.trim())}` : "#");
  }

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => tippt(e.target.value)}
        placeholder="Produkt oder Artikelnummer suchen"
        aria-label="Produktsuche"
        autoFocus
        className="mb-10 w-full max-w-[520px] border border-line-strong bg-transparent px-4 py-3 text-[0.95rem] text-text placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {treffer === null ? (
        <p className="text-muted">Suche wird geladen...</p>
      ) : !query.trim() ? (
        <p className="text-muted">Tippen Sie los - Titel, Artikelnummer, Marke oder Kategorie.</p>
      ) : treffer.length === 0 ? (
        <div className="max-w-[60ch] border border-line px-6 py-10">
          <p className="text-[1.05rem] font-bold uppercase tracking-[-0.01em]">
            Nicht im Sortiment gefunden.
          </p>
          <p className="mt-2 text-[0.95rem] text-text-soft">
            Schreiben Sie uns, wir besorgen es.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://wa.me/4367762080802"
              target="_blank"
              rel="noopener"
              className="border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
            >
              Per WhatsApp anfragen →
            </a>
            <EMailLink
              className="border border-line px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              nachtext=" →"
            />
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6 text-[0.82rem] text-muted">
            {treffer.length} {treffer.length === 1 ? "Treffer" : "Treffer"}
          </p>
          <ul className="grid grid-cols-1 border-l border-t border-line min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {treffer.map((t) => (
              <li key={t.handle} className="border-b border-r border-line bg-base">
                <Link
                  href={`/produkt/${t.handle}`}
                  className="block p-5 transition-colors hover:bg-[rgba(244,244,246,0.04)]"
                >
                  <div
                    className={`mb-4 aspect-square w-full overflow-hidden border border-line ${
                      t.bild ? "bg-white" : "bg-base"
                    }`}
                  >
                    {t.bild ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.bild}
                        alt={t.bildAlt ?? t.titel}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <BildPlatzhalter />
                    )}
                  </div>
                  <h2 className="text-sm font-bold uppercase leading-tight tracking-[-0.01em]">
                    {einheitenSchuetzen(t.titel)}
                  </h2>
                  {t.teaser && (
                    <p className="mt-1 text-[0.8rem] leading-snug text-muted">{t.teaser}</p>
                  )}
                  {!kaufbar ? (
                    <p className="mt-2 text-[0.8rem] text-muted">
                      Preise für Geschäftskunden in Kürze
                    </p>
                  ) : !(Number(t.preis?.amount) > 0) ? (
                    <p className="mt-2 text-[0.8rem] font-semibold text-muted">
                      Preis auf Anfrage
                    </p>
                  ) : (
                    <p className="mt-2 text-[0.8rem] font-semibold">
                      <PriceTag
                        amount={t.preis!.amount}
                        currency={t.preis!.currencyCode}
                      />
                    </p>
                  )}
                  {t.ve && <p className="mt-0.5 text-[0.72rem] text-muted">VE: {t.ve}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
