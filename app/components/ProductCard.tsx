import Link from "next/link";
import BildPlatzhalter from "./BildPlatzhalter";
import PriceTag from "./PriceTag";
import {
  KAUFBAR,
  istPreisOffen,
  PREIS_AUF_ANFRAGE,
  PREIS_HINWEIS_KATALOG,
} from "../lib/shop-mode";
import type { Product } from "@/lib/shopify/types";

// Produktkachel: Bild, Name, Teaser-Zeile (gedaempft) + VE.
// Katalogmodus (KAUFBAR=aus): keine Preise, Hinweiszeile fuer Geschaeftskunden.
// Kaufmodus (KAUFBAR=ein):    Preis; bei 0,00 stattdessen "Preis auf Anfrage".
// Server-Komponente — liest den Schalter direkt, kein prop-Durchreichen noetig.

export default function ProductCard({ product: p }: { product: Product }) {
  const min = p.priceRange?.minVariantPrice;
  const max = p.priceRange?.maxVariantPrice;
  const preisOffen = istPreisOffen(min?.amount);
  const abPreis =
    max && Number(max.amount) !== Number(min?.amount ?? 0) ? "ab " : "";
  return (
    <li className="border-b border-r border-line bg-base">
      <Link
        href={`/produkt/${p.handle}`}
        className="block p-5 transition-colors hover:bg-[rgba(244,244,246,0.04)]"
      >
        <div
          className={`mb-4 aspect-square w-full overflow-hidden border border-line ${
            p.featuredImage ? "bg-white" : "bg-base"
          }`}
        >
          {p.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.featuredImage.url}
              alt={p.featuredImage.altText ?? p.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <BildPlatzhalter />
          )}
        </div>

        <h2 className="text-sm font-bold uppercase leading-tight tracking-[-0.01em]">
          {p.title}
        </h2>

        {p.teaser && (
          <p className="mt-1 text-[0.8rem] leading-snug text-muted">{p.teaser}</p>
        )}

        {!KAUFBAR ? (
          <p className="mt-2 text-[0.8rem] text-muted">{PREIS_HINWEIS_KATALOG}</p>
        ) : preisOffen ? (
          <p className="mt-2 text-[0.8rem] font-semibold text-muted">
            {PREIS_AUF_ANFRAGE}
          </p>
        ) : (
          <p className="mt-2 text-[0.8rem] font-semibold">
            {abPreis}
            <PriceTag amount={min!.amount} currency={min!.currencyCode} />
          </p>
        )}
        {p.ve && (
          <p className="mt-0.5 text-[0.72rem] text-muted">VE: {p.ve}</p>
        )}
      </Link>
    </li>
  );
}
