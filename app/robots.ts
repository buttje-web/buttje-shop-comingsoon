import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

// robots.txt: alles erlaubt AUSSER Warenkorb und Checkout-Pfade.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/warenkorb", "/checkout", "/cart", "/account", "/bestaetigen", "/suche"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
