import type { Metadata } from "next";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

// Eigenes canonical, sonst erbt die Seite das der Startseite aus
// app/layout.tsx und zeigt damit auf eine ANDERE Adresse. Genau daran
// scheitert die SEO-Pruefung "Document does not have a valid rel=canonical".
export const metadata: Metadata = {
  title: "Produkte",
  alternates: { canonical: "/produkte" },
};

// Produktliste / Kategorie-Seite. Solange der Store leer ist (oder Tokens
// fehlen), zeigen wir einen ruhigen Platzhalter statt eines Fehlers.

async function loadProducts(): Promise<{ products: Product[]; ready: boolean }> {
  try {
    return { products: await getProducts(100), ready: true };
  } catch {
    // Tokens noch nicht gesetzt o.ae. - Fundament soll trotzdem rendern.
    return { products: [], ready: false };
  }
}

export default async function ProductsPage() {
  const { products } = await loadProducts();

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Sortiment</p>
      <h1 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Produkte
      </h1>

      {products.length === 0 ? (
        <div className="border border-line px-6 py-16 text-center">
          <p className="eyebrow mb-3">Vorübergehend nicht verfügbar</p>
          <p className="mx-auto max-w-[42ch] text-muted">
            Das Sortiment ist gerade nicht erreichbar. Bitte versuchen Sie es
            in wenigen Minuten erneut.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 border-l border-t border-line min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {/*
            NUR die erste Kachel wird vorrangig geladen, nicht die ersten vier.

            Frueher waren es vier - die erste Zeile im weitesten Raster. Auf
            dem Handy steht dort aber nur EINE Kachel, die drei anderen liegen
            unter dem Bildschirm. Vorrang fuer alle vier hiess: Sie teilen
            sich die gedrosselte Bandbreite mit genau dem Bild, an dem die
            Ladezeit gemessen wird, und bremsen es aus.
            Auf dem Schreibtisch kostet das nichts: Die uebrigen drei laden
            unmittelbar danach, dort ist die Leitung nicht der Engpass.
          */}
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} zuerst={i === 0} />
          ))}
        </ul>
      )}
    </Container>
  );
}
