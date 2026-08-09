import type { Metadata } from "next";
import Link from "next/link";
import Container from "../../components/Container";
import OptInForm from "../../components/OptInForm";
import BildPlatzhalter from "../../components/BildPlatzhalter";
import JsonLd from "../../components/JsonLd";
import ProduktInfo from "../../components/ProduktInfo";
import { boxZeilen } from "../../produktdaten";
import { einheitenSchuetzen } from "../../lib/titel";
import { bildBreite, bildSrcSet, DETAIL_STUFEN, DETAIL_SIZES } from "../../lib/bild";
import { PRODUKTINHALTE } from "../../produktdaten";
import BuyBox from "../../components/BuyBox";
import { GRUNDMENGEN } from "../../grundmengen";
import CrossSelling from "../../components/CrossSelling";
import { SITE_URL, SITE_NAME, OG_BILD, OG_ALT } from "../../lib/seo";
import { KAUFBAR, istPreisOffen, PREIS_HINWEIS_KATALOG } from "../../lib/shop-mode";
import { getProductByHandle } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

// Produktdetailseite. Next 16: params ist ein Promise und muss awaited werden.

type Params = Promise<{ handle: string }>;

async function loadProduct(handle: string): Promise<Product | null> {
  try {
    return await getProductByHandle(handle);
  } catch {
    return null; // Tokens/Store noch nicht bereit - Platzhalter zeigen.
  }
}

// Nuechterne, faktische Meta-Description (kein frecher Ton fuer Suchergebnisse).
// Katalogmodus: kein Preis in der Description.
function seoDescription(p: Product): string {
  const v = p.variants?.[0];
  const parts = [`${p.title}${p.vendor ? ` von ${p.vendor}` : ""}.`];
  if (p.ve) parts.push(`Verpackungseinheit: ${p.ve}.`);
  const ids: string[] = [];
  if (v?.sku) ids.push(`Artikelnummer ${v.sku}`);
  if (v?.barcode) ids.push(`EAN ${v.barcode}`);
  if (ids.length) parts.push(`${ids.join(", ")}.`);
  parts.push(
    KAUFBAR
      ? `B2B-Shop für Gewerbe. Nettopreise zzgl. USt. Lieferung innerhalb Österreichs.`
      : `B2B-Shop für Gewerbe. ${PREIS_HINWEIS_KATALOG}. Lieferung innerhalb Österreichs.`,
  );
  return parts.join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await loadProduct(handle);
  if (!product) return { title: "Produkt" };
  const url = `/produkt/${product.handle}`;
  const description = seoDescription(product);
  return {
    title: { absolute: `${product.title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${product.title} | ${SITE_NAME}`,
      description,
      url,
      /*
        Auf 1200 Punkte begrenzt. Ohne Begrenzung stand hier das
        Originalfoto der Warenwirtschaft mit 2048 Punkten und rund 4,7 MB
        - eine Groesse, an der Vorschau-Dienste abbrechen oder ins
        Zeitlimit laufen. Das Produktfoto bleibt hier bewusst das
        Vorschaubild und nicht das Standardmotiv: Wer einen Artikel teilt,
        meint diesen Artikel.
      */
      images: product.featuredImage
        ? [{ url: bildBreite(product.featuredImage.url, 1200) }]
        : [{ url: OG_BILD, width: 1200, height: 630, alt: OG_ALT }],
    },
  };
}


export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  const product = await loadProduct(handle);

  if (!product) {
    return (
      <Container className="py-[clamp(40px,7vw,88px)]">
        <p className="eyebrow mb-3">Produkt</p>
        <h1 className="mb-6 text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase tracking-[-0.02em]">
          Noch nicht verfügbar
        </h1>
        <p className="max-w-[42ch] text-muted">
          Dieses Produkt ist aktuell nicht im Sortiment. Das Angebot wird gerade
          aufgebaut.
        </p>
        <Link
          href="/produkte"
          className="mt-8 inline-block border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          ← Zum Sortiment
        </Link>
      </Container>
    );
  }

  const variant = product.variants?.[0];

  // Dubletten zwischen Produktdaten-Box und Herstellertabelle.
  //
  // Frueher stand hier eine feste Liste aus drei Feldnamen. Die griff zu
  // kurz: Material, Masse und Fassungsvermoegen standen doppelt, sobald die
  // Box sie fuehrte. Jetzt wird aus der Box selbst abgeleitet, was raus muss
  // - ueber Label UND Wert, weil dieselbe Angabe links unterschiedlich
  // heissen kann ("Blatt/Rolle" gegen "Blatt je Rolle").
  //
  // Zeilen, die nur die Herstellertabelle hat (Gewicht, Produktart,
  // Zolltarifnummer ...), bleiben unangetastet.
  const boxDaten = variant?.sku ? boxZeilen(variant.sku, {
    hersteller: product.vendor, ean: variant.barcode, ve: product.ve ?? variant.title,
  }) : [];

  /** Klein, ohne Sonderzeichen und ohne Fuellwoerter - zum Vergleichen. */
  const norm = (s: string) =>
    s.toLowerCase()
      .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
      .replace(/\b(je|pro|der|die|das|ca|circa)\b/g, "")
      .replace(/[^a-z0-9]/g, "");

  const boxLabels = new Set(boxDaten.map(([l]) => norm(l)));
  const boxWerte = new Set(boxDaten.map(([, w]) => norm(w)).filter((w) => w.length >= 3));

  /** Entfernt Tabellenzeilen, die inhaltlich schon in der Box stehen. */
  function ohneDubletten(html: string): string {
    const bereinigt = html.replace(
      /<tr>\s*<th[^>]*>([^<]*)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>\s*/g,
      (treffer, feld: string, wert: string) => {
        const l = norm(feld);
        const w = norm(wert.replace(/<[^>]+>/g, ""));
        // Label deckungsgleich, oder eines im anderen enthalten
        // ("blattrolle" gegen "blattrolle", "masse" gegen "massebxh").
        const labelTrifft = [...boxLabels].some(
          (b) => b === l || (b.length >= 4 && l.length >= 4 && (b.includes(l) || l.includes(b))),
        );
        return labelTrifft || boxWerte.has(w) ? "" : treffer;
      },
    );
    // Leer gewordene Tabelle samt Ueberschrift ganz weglassen.
    return /<td>/.test(bereinigt) ? bereinigt : "";
  }

  const hatBox = Boolean(variant?.sku && PRODUKTINHALTE[variant.sku]);
  const technikHtml = product.descriptionHtml
    ? hatBox
      ? ohneDubletten(product.descriptionHtml)
      : product.descriptionHtml
    : "";
  const url = `${SITE_URL}/produkt/${product.handle}`;

  const min = product.priceRange?.minVariantPrice;
  const preisOffen = istPreisOffen(min?.amount);

  // Katalogmodus: bewusst KEIN offers-Block (kein Preis in strukturierten Daten).
  // Kaufmodus: offers nur, wenn ein echter Preis existiert - ein Angebot mit
  // 0,00 waere eine Falschaussage gegenueber Suchmaschinen.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: seoDescription(product),
    ...(variant?.sku ? { sku: variant.sku, mpn: variant.sku } : {}),
    ...(variant?.barcode ? { gtin13: variant.barcode } : {}),
    ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
    ...(product.featuredImage ? { image: product.featuredImage.url } : {}),
    ...(KAUFBAR && !preisOffen && min
      ? {
          // Mehrere Varianten: AggregateOffer mit der Preisspanne. Ein
          // Einzelangebot zum niedrigsten Preis waere eine Falschaussage,
          // sobald die Varianten verschieden kosten (Rolle 7,50 gegen
          // Karton 85,50 beim Typ-100).
          offers:
            (product.variants?.length ?? 0) > 1
              ? {
                  "@type": "AggregateOffer",
                  url,
                  lowPrice: min.amount,
                  highPrice:
                    product.priceRange?.maxVariantPrice?.amount ?? min.amount,
                  priceCurrency: min.currencyCode,
                  offerCount: product.variants!.length,
                  valueAddedTaxIncluded: false,
                  availability: product.variants!.some((v) => v.availableForSale)
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                }
              : {
                  "@type": "Offer",
                  url,
                  price: min.amount,
                  priceCurrency: min.currencyCode,
                  valueAddedTaxIncluded: false,
                  availability: variant?.availableForSale
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Produkte", item: `${SITE_URL}/produkte` },
      { "@type": "ListItem", position: 3, name: product.title, item: url },
    ],
  };

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="grid grid-cols-1 gap-[clamp(20px,5vw,64px)] md:grid-cols-2">
        {/* Bild (mobil in der Hoehe begrenzt, damit der Kaufbereich ohne
            endloses Scrollen erreichbar bleibt) */}
        <div
          className={`aspect-square max-h-[320px] w-full overflow-hidden border border-line sm:max-h-[420px] md:max-h-none ${
            product.featuredImage ? "bg-white" : "bg-base"
          }`}
        >
          {product.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bildBreite(product.featuredImage.url, 640)}
              srcSet={bildSrcSet(product.featuredImage.url, DETAIL_STUFEN)}
              sizes={DETAIL_SIZES}
              width={640}
              height={640}
              alt={product.featuredImage.altText ?? product.title}
              // Nicht lazy: Das ist das groesste Bild der Seite und steht
              // sofort im Bild. Verzoegern hiesse die Ladezeit verschlechtern,
              // die es misst.
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-contain"
            />
          ) : (
            <BildPlatzhalter />
          )}
        </div>

        {/* Info */}
        <div>
          {/* 1. Produktname (H1, SEO) */}
          <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
            {einheitenSchuetzen(product.title)}
          </h1>

          {/* 2. Frecher Kurztext (Langtext) */}
          {product.langtext && (
            <p className="mt-4 max-w-[48ch] whitespace-pre-line text-[0.98rem] leading-relaxed text-text-soft">
              {product.langtext}
            </p>
          )}

          {/* 3. Kaufmodus: echter Kaufbereich. Katalogmodus: VE-Info,
                 Preis-Hinweis, Eroeffnungs-Opt-in + WhatsApp. */}
          <div className="mt-6 border border-line p-5">
            {KAUFBAR ? (
              <>
                <BuyBox
                  variants={product.variants ?? []}
                  fallbackPrice={min ?? { amount: "0", currencyCode: "EUR" }}
                  productHandle={product.handle}
                  grundmenge={GRUNDMENGEN[product.handle] ?? null}
                />
                <a
                  href="https://wa.me/4367762080802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block border border-line-strong px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
                >
                  Fragen? Per WhatsApp →
                </a>
              </>
            ) : (
              <>
                {(product.variants?.length ?? 0) > 0 && (
                  <p className="text-[0.8rem] text-muted">
                    {product.variants!.length === 1
                      ? `Verpackungseinheit: ${einheitenSchuetzen(product.variants![0].title)}`
                      : `Verpackungseinheiten: ${product.variants!.map((v) => einheitenSchuetzen(v.title)).join(" · ")}`}
                  </p>
                )}
                <p className="mt-2 text-[0.98rem] font-semibold">
                  {PREIS_HINWEIS_KATALOG}
                </p>

                <div className="mt-5 border-t border-line pt-5">
                  <p className="eyebrow mb-3">Zur Eröffnung informieren</p>
                  <OptInForm variant="compact" />
                </div>

                <a
                  href="https://wa.me/4367762080802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block border border-line-strong px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
                >
                  Fragen? Per WhatsApp →
                </a>
              </>
            )}
          </div>

          {/* 4. Gegliederter Produktinhalt (Abschnitte + Produktdaten-Box).
                 Rendert nur, wenn fuer die SKU Inhalte gepflegt sind. */}
          <ProduktInfo
            sku={variant?.sku ?? ""}
            hersteller={product.vendor}
            ean={variant?.barcode}
            ve={einheitenSchuetzen(product.ve ?? variant?.title)}
          />

          {/* 5. Technische Datentabelle des Herstellers.
                 Bei Produkten MIT Produktdaten-Box werden die dort schon
                 gezeigten Zeilen herausgefiltert, damit Hersteller,
                 Artikelnummer und EAN nicht doppelt stehen. Bei Produkten
                 OHNE Box bleibt die Tabelle unveraendert - dort ist sie die
                 einzige Datenquelle. */}
          {technikHtml && (
            <div
              className="techdata mt-10"
              dangerouslySetInnerHTML={{ __html: technikHtml }}
            />
          )}
        </div>
      </div>

      {/* Cross-Selling: "Alternativen" + "Passt dazu", kuratiert je SKU
          (app/crossselling.ts). Leere Bloecke verschwinden ersatzlos. */}
      <CrossSelling sku={variant?.sku} eigenesHandle={product.handle} />
    </Container>
  );
}
