import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";
import { CATEGORIES } from "./categories";
import { getProducts } from "@/lib/shopify";

// Dynamische sitemap.xml: statische Seiten + Kategorien + (sichtbare) Produkte.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/produkte",
    "/faq",
    "/versand-zahlung",
    "/impressum",
    "/agb",
    "/datenschutz",
    "/widerruf",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.5,
  }));

  for (const c of CATEGORIES) {
    entries.push({
      url: `${SITE_URL}/kategorie/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Nur oeffentlich sichtbare (aktive + publizierte) Produkte listen.
  try {
    const products = await getProducts(250);
    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/produkt/${p.handle}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Storefront nicht erreichbar -> nur statische + Kategorie-Eintraege
  }

  return entries;
}
