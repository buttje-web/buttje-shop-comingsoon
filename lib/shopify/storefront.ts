import "server-only";

/*
  Storefront-API-Client - serverseitig.
  Spricht den GraphQL-Storefront-Endpoint des Stores an und nutzt den
  PRIVATEN Headless-Token (Header: Shopify-Storefront-Private-Token).
  Der private Token bleibt damit ausschliesslich auf dem Server.

  Fuer rein clientseitige Aufrufe gibt es den oeffentlichen Token
  (NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN, Header X-Shopify-Storefront-Access-Token) -
  wir bevorzugen aber serverseitige Abfragen ueber dieses Modul.
*/

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-04";
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

function endpoint() {
  if (!DOMAIN) {
    throw new Error("SHOPIFY_STORE_DOMAIN fehlt (.env.local).");
  }
  return `https://${DOMAIN}/api/${VERSION}/graphql.json`;
}

export type StorefrontResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};

export type StorefrontFetchOptions = {
  /** GraphQL-Query oder -Mutation */
  query: string;
  variables?: Record<string, unknown>;
  /** Cache-Steuerung (Next 16: fetch standardmaessig NICHT gecached). */
  revalidate?: number | false;
  /** IP des Buyers fuer buyer-getriebene Server-Requests (optional). */
  buyerIp?: string;
};

/**
 * Fuehrt eine Storefront-GraphQL-Abfrage serverseitig aus.
 * @throws bei fehlendem Token, Transport- oder GraphQL-Fehlern.
 */
export async function storefront<T>({
  query,
  variables = {},
  revalidate,
  buyerIp,
}: StorefrontFetchOptions): Promise<T> {
  if (!PRIVATE_TOKEN) {
    throw new Error(
      "SHOPIFY_STOREFRONT_PRIVATE_TOKEN fehlt (.env.local). Privaten Headless-Token eintragen.",
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Shopify-Storefront-Private-Token": PRIVATE_TOKEN,
  };
  if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;

  const res = await fetch(endpoint(), {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // Next 16: explizite Cache-Strategie. Default = kein Cache (immer frisch).
    ...(revalidate === undefined
      ? { cache: "no-store" as const }
      : revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
  });

  const text = await res.text();
  let payload: StorefrontResponse<T>;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(
      `Storefront: Antwort kein JSON (HTTP ${res.status}): ${text.slice(0, 300)}`,
    );
  }

  if (!res.ok) {
    throw new Error(
      `Storefront: HTTP ${res.status} - ${JSON.stringify(payload.errors ?? payload)}`,
    );
  }
  if (payload.errors?.length) {
    throw new Error(`Storefront-Fehler: ${JSON.stringify(payload.errors)}`);
  }
  if (!payload.data) {
    throw new Error("Storefront: Antwort ohne data.");
  }
  return payload.data;
}
