"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "../categories";
import Suche from "./Suche";

/*
  Mobiles Menue (Burger) fuer Smartphone + Tablet hochkant (< lg).
  Kein Hover: alles per Tap. Solide dunkle Flaeche, schliesst bei
  Linkklick, Outside-Tap (Overlay) und Escape.
*/

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // Hintergrund-Scroll sperren, solange das Menue offen ist
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    // Sichtbarkeit regelt der .nav-mobile-Wrapper im Header (Safari-sicher)
    <div>
      <button
        type="button"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center border border-line-strong text-text"
      >
        {open ? (
          <span aria-hidden className="text-lg leading-none">✕</span>
        ) : (
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Overlay: Tap ausserhalb schliesst */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          />
          <div
            className="fixed inset-x-0 top-0 z-[100] max-h-full overflow-y-auto border-b border-line-strong"
            style={{ backgroundColor: "#0e0e12" }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
                Menü
              </span>
              <button
                type="button"
                aria-label="Menü schließen"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center border border-line-strong text-text"
              >
                ✕
              </button>
            </div>

            <nav className="px-5 py-4">
              {/* Suche ganz oben im Menue */}
              <div className="mb-5">
                <Suche variant="menue" onNavigiert={() => setOpen(false)} />
              </div>

              {/* "Produkte" ist hier BEWUSST kein Verweis, nur die
                  Zwischenueberschrift der Kategorieliste. Der fruehere
                  Sammel-Eintrag "Alle Produkte" (Link auf /produkte) ist
                  ersatzlos entfallen - Entscheidung Rami (08.08.2026):
                  Die Ware sieht man ausschliesslich ueber die Kategorien.
                  Die Seite /produkte bleibt per Adresse erreichbar. */}
              <p className="eyebrow mb-2">Produkte</p>
              <ul className="mb-4 divide-y divide-line border-y border-line">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/kategorie/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-text"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="divide-y divide-line border-y border-line">
                <li>
                  <Link
                    href="/versand-zahlung"
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-text"
                  >
                    Versand &amp; Zahlung
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-text"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
