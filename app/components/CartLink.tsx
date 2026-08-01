"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

// Sackerl-Link im Header mit live-Zaehler aus dem CartContext.
// Schmal (< 640 px): nur Icon + Zahl, damit der Knopf nicht umbricht.
// Ab 640 px zusaetzlich das Wort. Touch-Ziel >= 44px.

// lucide "shopping-bag" — Linienstil und Strichstaerke wie die Header-Lupe.
function SackerlIcon() {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/warenkorb"
      aria-label={`Sackerl, ${count} Artikel`}
      className="flex min-h-[44px] items-center gap-2 border border-line-strong px-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
    >
      <SackerlIcon />
      {/* Wort erst ab 640 px — Klassen liegen als ungelayertes CSS in
          globals.css, damit aeltere Safari die Sichtbarkeit sicher treffen. */}
      <span className="cart-label-long">Sackerl&nbsp;</span>({count})
    </Link>
  );
}
