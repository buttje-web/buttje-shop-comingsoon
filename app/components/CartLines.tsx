"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeItem, updateItem } from "@/lib/cart/actions";
import type { CartLine } from "@/lib/shopify/types";
import { useCart } from "./CartContext";
import QuantityStepper from "./QuantityStepper";
import { einheitenSchuetzen } from "../lib/titel";
import PriceTag from "./PriceTag";

function CartLineRow({ line }: { line: CartLine }) {
  const [qty, setQty] = useState(line.quantity);
  const [pending, startTransition] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const { setCount } = useCart();
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nach Server-Refresh die authoritative Menge uebernehmen.
  useEffect(() => setQty(line.quantity), [line.quantity]);

  function commit(next: number) {
    startTransition(async () => {
      setFehler(null);
      const ergebnis = await updateItem(line.id, next);
      if (!ergebnis.ok) {
        // Auf den Serverstand zuruecksetzen: Die Zeile zeigte optimistisch
        // eine Menge an, die nie angekommen ist.
        setQty(line.quantity);
        setFehler(ergebnis.meldung);
        return;
      }
      setCount(ergebnis.anzahl);
      router.refresh();
    });
  }

  function change(next: number) {
    setQty(next); // sofort sichtbar (optimistisch)
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), 450);
  }

  function remove() {
    if (timer.current) clearTimeout(timer.current);
    startTransition(async () => {
      setFehler(null);
      const ergebnis = await removeItem(line.id);
      if (!ergebnis.ok) {
        setFehler(ergebnis.meldung);
        return;
      }
      setCount(ergebnis.anzahl);
      router.refresh();
    });
  }

  const img = line.merchandise.product.featuredImage;
  const lineTotal = (Number(line.merchandise.price.amount) * qty).toFixed(2);
  const titel = line.merchandise.product.title;
  const zurProduktseite = `/produkt/${line.merchandise.product.handle}`;

  /*
    Zwei getrennte Klickflaechen: Bild und Name fuehren zur Produktseite,
    Mengenzaehler, Entfernen und Preis liegen ausserhalb der Links.

    Bewusst KEIN Link um die ganze Zeile mit stopPropagation an den Knoepfen:
    Ein Button in einem Link ist ungueltiges HTML, und der Tastaturweg waere
    kaputt. Getrennte Flaechen loesen das ohne Sonderbehandlung.
  */
  return (
    <li className={`flex flex-wrap items-center gap-x-4 gap-y-3 py-5 ${pending ? "opacity-60" : ""}`}>
      <Link
        href={zurProduktseite}
        aria-label={titel}
        className="block h-16 w-16 shrink-0 overflow-hidden border border-line bg-white transition-colors hover:border-accent"
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.url}
            alt={img.altText ?? titel}
            className="h-full w-full object-contain"
          />
        ) : null}
      </Link>

      <div className="min-w-[200px] flex-1">
        <p className="text-sm font-bold uppercase tracking-[-0.01em]">
          {/* no-underline nur zur Sicherheit: Im Ruhezustand ist der Name
              nicht als Link markiert, erst beim Ueberfahren faerbt er sich. */}
          <Link
            href={zurProduktseite}
            aria-label={titel}
            className="no-underline transition-colors hover:text-accent"
          >
            {einheitenSchuetzen(titel)}
          </Link>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <QuantityStepper value={qty} onChange={change} />
          <button
            type="button"
            onClick={remove}
            className="min-h-[44px] px-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted underline underline-offset-2 transition-colors hover:text-accent"
          >
            Entfernen
          </button>
        </div>
        {fehler && (
          <p role="alert" className="mt-2 max-w-[52ch] text-[0.72rem] leading-relaxed text-muted">
            {fehler}
          </p>
        )}
      </div>

      <div className="ml-auto text-right text-sm">
        <PriceTag amount={lineTotal} currency={line.merchandise.price.currencyCode} />
      </div>
    </li>
  );
}

export default function CartLines({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {lines.map((line) => (
        <CartLineRow key={line.id} line={line} />
      ))}
    </ul>
  );
}
