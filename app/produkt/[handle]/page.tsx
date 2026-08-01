import type { Metadata } from "next";
import Link from "next/link";
import Container from "../../components/Container";
import OptInForm from "../../components/OptInForm";
import BildPlatzhalter from "../../components/BildPlatzhalter";
import JsonLd from "../../components/JsonLd";
import ProduktInfo from "../../components/ProduktInfo";
import BuyBox from "../../components/BuyBox";
import { SITE_URL, SITE_NAME } from "../../lib/seo";
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
      ? `B2B-Shop für Gewerbe — Nettopreise zzgl. USt. Lieferung innerhalb Österreichs.`
      : `B2B-Shop für Gewerbe — ${PREIS_HINWEIS_KATALOG}. Lieferung innerhalb Österreichs.`,
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
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
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
  const url = `${SITE_URL}/produkt/${product.handle}`;

  const min = product.priceRange?.minVariantPrice;
  const preisOffen = istPreisOffen(min?.amount);

  // Katalogmodus: bewusst KEIN offers-Block (kein Preis in strukturierten Daten).
  // Kaufmodus: offers nur, wenn ein echter Preis existiert — ein Angebot mit
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
          offers: {
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
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
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
            {product.title}
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
                      ? `Verpackungseinheit: ${product.variants![0].title}`
                      : `Verpackungseinheiten: ${product.variants!.map((v) => v.title).join(" · ")}`}
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
            ve={product.ve ?? variant?.title}
          />

          {/* 5. Technische Datentabelle des Herstellers.
                 Bleibt fuer Produkte OHNE gepflegte Abschnitte die einzige
                 Datenquelle; bei gepflegten Produkten ergaenzt sie die Box. */}
          {product.descriptionHtml && (
            <div
              className="techdata mt-10"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
