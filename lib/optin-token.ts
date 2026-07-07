import { createHmac, timingSafeEqual } from "node:crypto";

// HMAC-signierte Opt-in-Tokens: Kunden-ID + E-Mail + Ablauf (7 Tage).
// Payload base64url, Signatur HMAC-SHA256 mit OPTIN_TOKEN_SECRET (nur Server).

const GUELTIG_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  const s = process.env.OPTIN_TOKEN_SECRET;
  if (!s?.trim()) throw new Error("OPTIN_TOKEN_SECRET fehlt.");
  return s.trim();
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function mintToken(customerId: string, email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ c: customerId, e: email, x: Date.now() + GUELTIG_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export type TokenErgebnis =
  | { ok: true; customerId: string; email: string }
  | { ok: false; grund: "ungueltig" | "abgelaufen" };

export function verifyToken(token: string): TokenErgebnis {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { ok: false, grund: "ungueltig" };
  const erwartet = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(erwartet);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, grund: "ungueltig" };
  }
  try {
    const { c, e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof c !== "string" || typeof e !== "string" || typeof x !== "number") {
      return { ok: false, grund: "ungueltig" };
    }
    if (Date.now() > x) return { ok: false, grund: "abgelaufen" };
    return { ok: true, customerId: c, email: e };
  } catch {
    return { ok: false, grund: "ungueltig" };
  }
}
