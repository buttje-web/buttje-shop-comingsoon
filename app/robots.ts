import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

// robots.txt: alles erlaubt AUSSER Sackerl und Checkout-Pfade.
// /warenkorb bleibt gesperrt: Die alte Adresse leitet nur noch auf
// /sackerl weiter, gecrawlt werden soll keine von beiden.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/sackerl", "/warenkorb", "/checkout", "/cart", "/account", "/bestaetigen", "/suche"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
