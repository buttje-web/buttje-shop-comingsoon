import ProductCard from "./ProductCard";
import { empfehlungFuer, GESPERRTE_SKUS } from "../crossselling";
import { istPreisOffen } from "../lib/shop-mode";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

/*
  Cross-Selling-Bloecke der Produktseite: "Alternativen" (hoechstens 2)
  und "Passt dazu" (hoechstens 3). Kuratierte Zuordnung in
  app/crossselling.ts - hier passiert nur das Aufloesen und Filtern.

  HARTE REGELN (Vorgabe Rami, 09.08.2026):
  - Preis 0 (auf Anfrage) erscheint NIE als Empfehlung. Der Filter
    laeuft beim Rendern gegen die Live-Preise - faellt ein Preis auf 0,
    verschwindet der Artikel von selbst aus allen Empfehlungen.
  - Gesperrte Artikel (GESPERRTE_SKUS) bleiben draussen, auch mit Preis.
  - Ein leerer Block verschwindet ersatzlos, keine Platzhalter. Sind
    beide leer, rendert die Komponente nichts.

  Die Produktliste kommt aus demselben 60-Sekunden-Cache wie /produkte
  (getProducts mit revalidate) - kein zusaetzlicher Abfrage-Aufwand je
  Empfehlung.
*/

const MAX_ALTERNATIVEN = 2;
const MAX_PASST_DAZU = 3;

function Block({ titel, produkte }: { titel: string; produkte: Product[] }) {
  if (produkte.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-[1.1rem] font-black uppercase tracking-[-0.01em]">
        {titel}
      </h2>
      <ul className="grid grid-cols-1 border-l border-t border-line min-[480px]:grid-cols-2 md:grid-cols-3">
        {produkte.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </ul>
    </section>
  );
}

export default async function CrossSelling({
  sku,
  eigenesHandle,
}: {
  sku: string | null | undefined;
  /** Handle des aktuellen Produkts - empfiehlt sich nie selbst. */
  eigenesHandle: string;
}) {
  const empfehlung = empfehlungFuer(sku);
  if (!empfehlung) return null;

  let alle: Product[] = [];
  try {
    alle = await getProducts(250);
  } catch {
    return null; // Ohne Produktliste keine Empfehlungen - Seite bleibt intakt.
  }

  const proSku = new Map<string, Product>();
  for (const p of alle) {
    const s = p.variants?.[0]?.sku;
    if (s) proSku.set(s, p);
  }

  function aufloesen(skus: string[], max: number, ausser: ReadonlySet<string>): Product[] {
    const treffer: Product[] = [];
    for (const s of skus) {
      if (treffer.length >= max) break;
      if (GESPERRTE_SKUS.has(s) || ausser.has(s)) continue;
      const p = proSku.get(s);
      if (!p || p.handle === eigenesHandle) continue;
      // Preis 0 = auf Anfrage: nie empfehlen (Live-Preis, nicht Datenstand).
      if (istPreisOffen(p.priceRange?.minVariantPrice?.amount)) continue;
      treffer.push(p);
    }
    return treffer;
  }

  const alternativen = aufloesen(empfehlung.alternativen, MAX_ALTERNATIVEN, new Set());
  // Kein Artikel doppelt: Was schon als Alternative steht, faellt aus
  // "Passt dazu" heraus (kuratiert kommt das nicht vor, der Filter
  // sichert es gegen spaetere Uebersteuerungen ab).
  const schonGezeigt = new Set(
    alternativen.map((p) => p.variants?.[0]?.sku ?? "").filter(Boolean)
  );
  const passtDazu = aufloesen(empfehlung.passtDazu, MAX_PASST_DAZU, schonGezeigt);

  if (alternativen.length === 0 && passtDazu.length === 0) return null;

  return (
    <>
      <Block titel="Alternativen" produkte={alternativen} />
      <Block titel="Passt dazu" produkte={passtDazu} />
    </>
  );
}
