"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

// Sackerl-Link im Header mit live-Zaehler aus dem CartContext.
// Schmal (< 640 px): nur Icon + Zahl, damit der Knopf nicht umbricht.
// Ab 640 px zusaetzlich das Wort. Touch-Ziel >= 44px.

// Eigenes Sackerl-Icon (Variante D, von Rami gewaehlt): Papiertragetasche
// als Silhouette - Trapezkorpus, oben schmaler als unten, darueber ein
// Henkelbogen. Das lucide "shopping-bag" war quadratisch und wirkte wie ein
// Koffer. Zwei getrennte Henkelboegen waren angedacht, verschmelzen bei 18 px
// aber zu einer Kuppe; deshalb ein breiter Bogen.
// Linienstil, Strichstaerke und Groesse identisch zur Header-Lupe.
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
      <path d="M6.6 8h10.8l1.7 12.6a1 1 0 0 1-1 1.1H5.9a1 1 0 0 1-1-1.1L6.6 8Z" />
      <path d="M8.8 8V6.4a3.2 3.2 0 0 1 6.4 0V8" />
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
      {/* Wort erst ab 640 px - Klassen liegen als ungelayertes CSS in
          globals.css, damit aeltere Safari die Sichtbarkeit sicher treffen. */}
      <span className="cart-label-long">Sackerl&nbsp;</span>({count})
    </Link>
  );
}
