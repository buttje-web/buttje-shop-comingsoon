// Verbindungstest Storefront-API (Schritt 1).
// Nutzt bewusst den OEFFENTLICHEN Token (Header X-Shopify-Storefront-Access-Token),
// um zu beweisen, dass die oeffentliche Anzeige funktioniert.
// Erwartung bei leerem Store: gueltige, aber leere Produktliste.
//
// Aufruf:  node scripts/test-storefront.mjs

import process from "node:process";

// .env.local laden (Next-Konvention, gitignored).
try {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
} catch {
  // evtl. schon via Umgebung gesetzt
}

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-04";
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!DOMAIN) fail("SHOPIFY_STORE_DOMAIN fehlt in .env.local");
if (!PUBLIC_TOKEN || !PUBLIC_TOKEN.trim()) {
  fail("NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN fehlt in .env.local - oeffentlichen Storefront-Token eintragen.");
}

const endpoint = `https://${DOMAIN}/api/${VERSION}/graphql.json`;
const query = `{
  shop { name primaryDomain { url } }
  products(first: 5) { edges { node { handle title } } }
}`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Shopify-Storefront-Access-Token": PUBLIC_TOKEN.trim(),
  },
  body: JSON.stringify({ query }),
});

const text = await res.text();
let payload;
try {
  payload = JSON.parse(text);
} catch {
  fail(`Antwort kein JSON (HTTP ${res.status}): ${text.slice(0, 300)}`);
}

if (!res.ok || payload.errors) {
  console.error(`✗ Storefront-Verbindung fehlgeschlagen (HTTP ${res.status}).`);
  console.error("  Fehler:", JSON.stringify(payload.errors ?? payload, null, 2));
  // Haeufige Ursache: falscher/leerer Token oder Store nicht freigegeben.
  process.exit(2);
}

const shop = payload.data?.shop;
const products = payload.data?.products?.edges ?? [];

console.log("✓ Storefront-Verbindung steht (oeffentlicher Token).");
console.log(`  Shop:      ${shop?.name ?? "-"}`);
console.log(`  Domain:    ${shop?.primaryDomain?.url ?? "-"}`);
console.log(`  Produkte:  ${products.length} (leer erwartet, solange kein Altruan-CSV importiert ist)`);
console.log("  → Oeffentliche Anzeige funktioniert, sobald Produkte vorhanden sind.");
