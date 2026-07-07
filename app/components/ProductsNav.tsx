"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../categories";

/*
  PRODUKTE mit Kategorie-Dropdown (Desktop).
  - Trigger + unsichtbarer Padding-Steg + Panel = EIN Hover-Bereich
    (.pnav-panel-wrap ueberbrueckt die Luecke)
  - Schliess-Verzoegerung 300ms: Menue bleibt offen, solange die Maus auf
    Trigger ODER Panel ist; kurzes Verlassen klappt nicht sofort zu
  - Klick toggelt, Outside-Click und Escape schliessen (Safari-sicher,
    solide Flaeche, klassisches positioning)
*/

const CLOSE_DELAY_MS = 300;

export default function ProductsNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeDelayed() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  // Outside-Click + Escape schliessen sofort.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pnav-root"
      onMouseEnter={openNow}
      onMouseLeave={closeDelayed}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:text-accent"
      >
        <Link
          href="/produkte"
          onClick={(e) => e.stopPropagation()}
          className="hover:text-accent"
        >
          Produkte
        </Link>
        <span aria-hidden className="text-[0.6em]">▾</span>
      </button>

      {open && (
        <div
          className="pnav-panel-wrap"
          onMouseEnter={openNow}
          onMouseLeave={closeDelayed}
        >
          <div className="pnav-panel shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
            <ul className="divide-y divide-line py-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategorie/${c.slug}`}
                    className="block px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-text transition-colors hover:bg-[rgba(244,244,246,0.06)] hover:text-accent"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
