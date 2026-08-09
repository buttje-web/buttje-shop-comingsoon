import Link from "next/link";
import AnfrageWahl from "./AnfrageWahl";
import BildPlatzhalter from "./BildPlatzhalter";
import { bildBreite, bildSrcSet, KACHEL_STUFEN, KACHEL_SIZES } from "../lib/bild";
import KachelKauf from "./KachelKauf";
import { einheitenSchuetzen } from "../lib/titel";
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
// Server-Komponente - liest den Schalter direkt, kein prop-Durchreichen noetig.
//
// ZWEI BEREICHE, BEWUSST GETRENNT: Oben die Verknuepfung auf die
// Produktseite (Bild, Titel, Spruch, Preis, VE). Darunter, ALS
// GESCHWISTER und nicht darin, der Kaufbereich. Ein Klick auf Menge oder
// Knopf kann die Produktseite damit gar nicht oeffnen; es braucht kein
// Abfangen von Klicks, und die Tastaturbedienung bleibt richtig
// (verschachtelte Bedienelemente in einem Link waeren beides nicht).
//
// WELCHER KAUFBEREICH, entschieden aus den Daten der Kachel:
//   Preis 0,00                     ->  ANFRAGEN, Weg zur Produktseite
//   mehr als eine Variante         ->  GROESSE WAEHLEN, ebenfalls dorthin
//   genau eine, verfuegbar, Preis  ->  Menge + INS SACKERL
// Die Reihenfolge ist Absicht: Was keinen Preis hat, ist nicht kaufbar,
// auch nicht mit nur einer Variante. Der Kunde sieht in dem Fall oben
// "Preis auf Anfrage" - ein Sackerl-Knopf darunter waere ein Widerspruch.
//
// KEINE TAGS ALS KRITERIUM. "sku-offen" haengt auch an rund 25 Produkten
// mit Preis, die kaufbar sein muessen (Dr. Schnell Forol, Buzil Perfekt
// G 440, Diversey Suma Inox, Vileda Fensterabzieher und weitere);
// "preis-offen" steht ebenfalls an Produkten mit Preis. Beide Tags bilden
// den Zustand nicht ab. Verlaesslich ist allein das Preisfeld, und genau
// das entscheidet hier - dieselbe Pruefung, die auch die Preiszeile
// darueber steuert.

/** Neutraler Knopf, der auf die Produktseite fuehrt (kein Kauf von hier aus). */
function WegKnopf({
  href,
  titel,
  children,
}: {
  href: string;
  titel: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${titel}: ${children}`}
      className={
        // ziel44: 32 Punkte gezeichnet, 44 Punkte antippbar (globals.css)
        "ziel44 flex h-8 w-full items-center justify-center border border-line-strong px-2 " +
        "text-[0.64rem] font-bold uppercase leading-none tracking-[0.16em] text-muted " +
        "transition-colors hover:border-text hover:text-text"
      }
    >
      {children}
    </Link>
  );
}

export default function ProductCard({
  product: p,
  zuerst = false,
}: {
  product: Product;
  /*
    Steht die Kachel in der ersten Rasterzeile? Dann wird ihr Bild sofort
    geladen, alle uebrigen erst beim Heranscrollen.

    Warum nicht alles lazy: Das groesste sichtbare Bild ist der Massstab
    fuer die wahrgenommene Ladezeit. Ein "lazy" darauf verzoegert genau
    das Bild, auf das es ankommt, weil der Browser es erst nach dem
    Layout anfordert.
  */
  zuerst?: boolean;
}) {
  const min = p.priceRange?.minVariantPrice;
  const max = p.priceRange?.maxVariantPrice;
  const preisOffen = istPreisOffen(min?.amount);
  const abPreis =
    max && Number(max.amount) !== Number(min?.amount ?? 0) ? "ab " : "";

  const ziel = `/produkt/${p.handle}`;
  const varianten = p.variants ?? [];
  const einzige = varianten.length === 1 ? varianten[0] : null;

  let kaufbereich: React.ReactNode = null;
  if (KAUFBAR) {
    if (preisOffen) {
      // Kein ANFRAGEN-Knopf mehr (Vorgabe Rami, 09.08.2026): An der Stelle
      // von INS SACKERL steht dauerhaft der zweigeteilte Balken
      // WhatsApp/E-Mail. Name und Bild der Kachel fuehren weiter auf die
      // Produktseite. Artikelnummer nur bei genau einer Variante - bei
      // mehreren bleibt im Anfragetext nur der Name.
      kaufbereich = (
        <AnfrageWahl titel={p.title} sku={einzige?.sku ?? null} klein />
      );
    } else if (varianten.length > 1) {
      kaufbereich = (
        <WegKnopf href={ziel} titel={p.title}>
          Größe wählen
        </WegKnopf>
      );
    } else if (einzige?.availableForSale) {
      kaufbereich = (
        <KachelKauf variantId={einzige.id} titel={p.title} handle={p.handle} />
      );
    } else {
      // Ausverkauft, oder die Liste hat keine Variante mitgeliefert. Beides
      // ist kein Fall fuer einen Sackerl-Knopf, der nachher scheitert.
      kaufbereich = (
        <WegKnopf href={ziel} titel={p.title}>
          Anfragen
        </WegKnopf>
      );
    }
  }

  return (
    <li className="border-b border-r border-line bg-base">
      <div className="flex h-full flex-col p-5 transition-colors hover:bg-[rgba(244,244,246,0.04)]">
        <Link href={ziel} className="block">
          <div
            className={`mb-4 aspect-square w-full overflow-hidden border border-line ${
              p.featuredImage ? "bg-white" : "bg-base"
            }`}
          >
            {p.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bildBreite(p.featuredImage.url, 320)}
                srcSet={bildSrcSet(p.featuredImage.url, KACHEL_STUFEN)}
                sizes={KACHEL_SIZES}
                width={320}
                height={320}
                alt={p.featuredImage.altText ?? p.title}
                loading={zuerst ? "eager" : "lazy"}
                fetchPriority={zuerst ? "high" : undefined}
                decoding="async"
                className="h-full w-full object-contain"
              />
            ) : (
              <BildPlatzhalter />
            )}
          </div>

          <h2 className="text-sm font-bold uppercase leading-tight tracking-[-0.01em]">
            {einheitenSchuetzen(p.title)}
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

        {/* mt-auto: In einer Rasterzeile sind die Kacheln unterschiedlich
            hoch (Titel ein- oder zweizeilig, Spruch da oder nicht). Ohne
            das haengen die Knoepfe auf verschiedenen Hoehen. */}
        {kaufbereich && <div className="mt-auto pt-4">{kaufbereich}</div>}
      </div>
    </li>
  );
}
