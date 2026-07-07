"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { bereiteVor, suche, type SuchEintrag } from "@/lib/suche";

// Produktsuche. variant="header": Lupe im Header, Klick klappt Eingabefeld
// inline auf, Live-Dropdown mit max. 6 Treffern. variant="menue": Eingabefeld
// fest eingebaut (Burger-Menue), Trefferliste inline.
// Suche laeuft komplett im Client; nur der Produktindex wird einmal geladen.

let indexPromise: Promise<ReturnType<typeof bereiteVor>> | null = null;
function ladeIndex() {
  indexPromise ??= fetch("/api/suchindex")
    .then((r) => r.json())
    .then((d: { produkte: SuchEintrag[] }) => bereiteVor(d.produkte ?? []))
    .catch(() => {
      indexPromise = null; // beim naechsten Oeffnen erneut versuchen
      return [];
    });
  return indexPromise;
}

const MAX_LIVE = 6;

export default function Suche({
  variant = "header",
  onNavigiert,
}: {
  variant?: "header" | "menue";
  onNavigiert?: () => void;
}) {
  const router = useRouter();
  const [offen, setOffen] = useState(variant === "menue");
  const [query, setQuery] = useState("");
  const [treffer, setTreffer] = useState<SuchEintrag[]>([]);
  const [bereit, setBereit] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const vorbereitetRef = useRef<ReturnType<typeof bereiteVor>>([]);

  // Index lazy laden, sobald die Suche offen ist
  useEffect(() => {
    if (!offen) return;
    let aktiv = true;
    ladeIndex().then((v) => {
      if (aktiv) {
        vorbereitetRef.current = v;
        setBereit(true);
      }
    });
    return () => {
      aktiv = false;
    };
  }, [offen]);

  // Header-Variante: Klick ausserhalb / Escape schliesst
  useEffect(() => {
    if (variant !== "header" || !offen) return;
    const klick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) schliessen();
    };
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") schliessen();
    };
    document.addEventListener("mousedown", klick);
    document.addEventListener("keydown", taste);
    return () => {
      document.removeEventListener("mousedown", klick);
      document.removeEventListener("keydown", taste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, offen]);

  function schliessen() {
    setOffen(variant === "menue");
    setQuery("");
    setTreffer([]);
  }

  function tippt(wert: string) {
    setQuery(wert);
    setTreffer(wert.trim() ? suche(vorbereitetRef.current, wert).slice(0, MAX_LIVE) : []);
  }

  function geheZu(pfad: string) {
    schliessen();
    onNavigiert?.();
    router.push(pfad);
  }

  function absenden(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Suchbegriff im Hash: bleibt im Browser, taucht in keinem Server-Log auf.
    geheZu(`/suche#q=${encodeURIComponent(q)}`);
  }

  const liste = query.trim() && (
    <ul
      className={
        variant === "header"
          ? "absolute right-0 top-[calc(100%+10px)] z-[110] w-[min(420px,88vw)] border border-line-strong bg-[#0E0E12] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
          : "mt-2 border border-line bg-[#121218]"
      }
    >
      {treffer.map((t) => (
        <li key={t.handle} className="border-b border-line last:border-b-0">
          <button
            type="button"
            onClick={() => geheZu(`/produkt/${t.handle}`)}
            className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-[rgba(244,244,246,0.05)]"
          >
            <span className="block h-11 w-11 shrink-0 overflow-hidden border border-line bg-white">
              {t.bild ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.bild} alt="" className="h-full w-full object-contain" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-base text-[0.9rem] font-extrabold text-[rgba(244,244,246,0.16)]">
                  b
                </span>
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.82rem] font-bold uppercase leading-tight">
                {t.titel}
              </span>
              {t.ve && (
                <span className="block text-[0.72rem] text-muted">VE: {t.ve}</span>
              )}
            </span>
          </button>
        </li>
      ))}
      {treffer.length === 0 && bereit && (
        <li className="p-4 text-[0.82rem] text-muted">
          Nichts gefunden — Enter zeigt die Anfrage-Optionen.
        </li>
      )}
    </ul>
  );

  if (variant === "menue") {
    return (
      <form onSubmit={absenden} className="relative" role="search">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => tippt(e.target.value)}
          placeholder="Produkt oder Artikelnummer suchen"
          aria-label="Produktsuche"
          className="w-full border border-line-strong bg-transparent px-4 py-3 text-[0.9rem] text-text placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {liste}
      </form>
    );
  }

  return (
    <div ref={wrapRef} className="relative flex items-center">
      {offen ? (
        <form onSubmit={absenden} role="search" className="flex items-center gap-2">
          <input
            ref={inputRef}
            autoFocus
            type="search"
            value={query}
            onChange={(e) => tippt(e.target.value)}
            placeholder="Produkt oder Artikelnummer"
            aria-label="Produktsuche"
            className="w-[min(300px,40vw)] border border-line-strong bg-transparent px-3 py-2 text-[0.85rem] text-text placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOffen(true)}
          aria-label="Suche öffnen"
          className="flex h-10 w-10 items-center justify-center text-text transition-colors hover:text-accent"
        >
          <LupeIcon />
        </button>
      )}
      {offen && liste}
    </div>
  );
}

function LupeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  );
}
