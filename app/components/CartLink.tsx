"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

// Warenkorb-Link im Header mit live-Zaehler aus dem CartContext.
// Mobil kompaktes Label ("Korb"), Touch-Ziel >= 44px.
export default function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/warenkorb"
      className="flex min-h-[44px] items-center border border-line-strong px-[13px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
    >
      <span className="cart-label-long">Warenkorb&nbsp;</span>
      <span className="cart-label-short">Korb&nbsp;</span>({count})
    </Link>
  );
}
