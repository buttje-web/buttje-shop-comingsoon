// Server-seitiger Admin-API-Client (client_credentials grant) — nur fuer
// Route Handler. Credentials liegen ausschliesslich in Server-Env-Variablen
// und erreichen nie den Browser. Token wird im Modul-Scope gecached und vor
// Ablauf erneuert (Muster aus Hermes/shopify-auth.mjs).

const SKEW_MS = 60_000;
let cache: { token: string; expiresAt: number } | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Umgebungsvariable ${name} fehlt.`);
  return v.trim();
}

function base(): string {
  return `https://${env("SHOPIFY_STORE_DOMAIN")}`;
}

async function getAccessToken(force = false): Promise<string> {
  if (!force && cache && Date.now() < cache.expiresAt - SKEW_MS) return cache.token;

  const res = await fetch(`${base()}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env("SHOPIFY_ADMIN_CLIENT_ID"),
      client_secret: env("SHOPIFY_ADMIN_CLIENT_SECRET"),
    }),
  });
  if (!res.ok) throw new Error(`Token-Tausch fehlgeschlagen: HTTP ${res.status}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Token-Antwort ohne access_token.");
  cache = {
    token: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 23 * 3600) * 1000,
  };
  return cache.token;
}

export async function adminGraphql<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const version = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-04";
  const url = `${base()}/admin/api/${version}/graphql.json`;

  let token = await getAccessToken();
  let res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 401) {
    token = await getAccessToken(true);
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });
  }
  if (!res.ok) throw new Error(`Admin-API: HTTP ${res.status}`);
  const payload = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(`Admin-API-Fehler: ${payload.errors.map((e) => e.message).join("; ")}`);
  }
  return payload.data as T;
}
