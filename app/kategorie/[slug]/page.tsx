import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "../../components/Container";
import CategoryHeader from "../../components/CategoryHeader";
import ProductCard from "../../components/ProductCard";
import JsonLd from "../../components/JsonLd";
import { SITE_URL } from "../../lib/seo";
import { CATEGORIES, categoryBySlug } from "../../categories";
import { getProductsByCategory } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// Nuechterne, faktische Kategorie-Descriptions (kein frecher Ton fuer Suche).
const CATEGORY_SEO: Record<string, string> = {
  entsorgung:
    "Müllsäcke und Abfallsäcke für Gewerbe: von dünnen Beuteln bis zu reißfesten 120-Liter-Säcken sowie Hygienebeutel. Markenware von DEISS zu Nettopreisen. Lieferung innerhalb Österreichs.",
  papier:
    "Toilettenpapier, Falthandtücher, Küchen- und Putztuchrollen für Objekte und Betriebe. Marken wie Papernet, Tork und Scott zu Nettopreisen. B2B-Verkauf, Lieferung innerhalb Österreichs.",
  chemie:
    "Professionelle Reinigungschemie von Dr. Schnell, Buzil, TASKI, Diversey und Kiehl: Unterhaltsreiniger, Sanitär, Glas, Grundreiniger. Nettopreise für Gewerbe, Lieferung innerhalb Österreichs.",
  seifen:
    "Seifencreme, Handseife und Waschlotion für Spendersysteme und Waschräume. Marken wie CWS, STERN und Diversey zu Nettopreisen. B2B, Lieferung innerhalb Österreichs.",
  handschuhe:
    "Einweg- und Arbeitshandschuhe aus Nitril, Latex und Vinyl in gängigen Größen. Nettopreise für Gewerbe, Lieferung innerhalb Österreichs.",
  zubehoer:
    "Reinigungszubehör: Mikrofasertücher, Pads, Schwämme, Moppbezüge, Fensterabzieher und Sprühflaschen. Nettopreise für Gewerbe, Lieferung innerhalb Österreichs.",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) return { title: "Kategorie" };
  return {
    title: { absolute: `${cat.label} für Gewerbe (B2B) kaufen | buttje Shop` },
    description: CATEGORY_SEO[cat.slug],
    alternates: { canonical: `/kategorie/${cat.slug}` },
    openGraph: {
      title: `${cat.label} für Gewerbe (B2B) kaufen | buttje Shop`,
      description: CATEGORY_SEO[cat.slug],
      url: `/kategorie/${cat.slug}`,
    },
  };
}

async function loadCategoryProducts(tag: string): Promise<Product[]> {
  try {
    return await getProductsByCategory(tag);
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();

  const products = await loadCategoryProducts(cat.tag);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Produkte", item: `${SITE_URL}/produkte` },
      { "@type": "ListItem", position: 3, name: cat.label, item: `${SITE_URL}/kategorie/${cat.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <CategoryHeader
        headline={cat.headline}
        intro={cat.intro}
        label={cat.label}
        video={cat.video}
      />

      <Container className="py-[clamp(32px,5vw,64px)]">
        {products.length === 0 ? (
          <div className="border border-line px-6 py-16 text-center">
            <p className="eyebrow mb-3">In Vorbereitung</p>
            <p className="mx-auto max-w-[42ch] text-muted">
              In dieser Kategorie sind bald Produkte verfügbar.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 border-l border-t border-line min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
