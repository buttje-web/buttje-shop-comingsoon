import { NextResponse } from "next/server";
import { adminGraphql } from "@/lib/shopify/admin";
import { mintToken } from "@/lib/optin-token";
import { sendeBestaetigungsMail } from "@/lib/mail";

// Eroeffnungs-Opt-in: legt den Kontakt als Kunden mit Marketing-Status
// PENDING an (Double-Opt-in: erst nach Bestaetigung gilt der Kontakt als
// eingewilligt). Zeitstempel + Herkunfts-Tag werden mitgeschrieben.
// Fehlermeldungen sind bewusst generisch — interne Systemnamen bleiben
// serverseitig.

const CREATE = `mutation($input: CustomerInput!){
  customerCreate(input: $input){
    customer { id }
    userErrors { field message }
  } }`;

const FIND = `query($q: String!){
  customers(first: 1, query: $q){ nodes { id } } }`;

const CONSENT = `mutation($input: CustomerEmailMarketingConsentUpdateInput!){
  customerEmailMarketingConsentUpdate(input: $input){
    customer { id }
    userErrors { field message }
  } }`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: { email?: string; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." },
      { status: 400 },
    );
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Bitte die Einwilligung bestätigen." },
      { status: 400 },
    );
  }

  const consent = {
    marketingState: "PENDING",
    marketingOptInLevel: "CONFIRMED_OPT_IN",
    consentUpdatedAt: new Date().toISOString(),
  };

  try {
    const created = await adminGraphql<{
      customerCreate: { customer: { id: string } | null; userErrors: { message: string }[] };
    }>(CREATE, {
      input: { email, tags: ["eroeffnung-optin"], emailMarketingConsent: consent },
    });

    let customerId = created.customerCreate.customer?.id ?? null;
    const errs = created.customerCreate.userErrors;
    if (errs.length) {
      const taken = errs.some((e) => /taken|bereits/i.test(e.message));
      if (!taken) throw new Error(errs.map((e) => e.message).join("; "));
      // Adresse existiert schon als Kunde -> Consent (wieder) auf PENDING setzen
      const found = await adminGraphql<{ customers: { nodes: { id: string }[] } }>(FIND, {
        q: `email:${email}`,
      });
      customerId = found.customers.nodes[0]?.id ?? null;
      if (customerId) {
        await adminGraphql(CONSENT, {
          input: { customerId, emailMarketingConsent: consent },
        });
      }
    }
    if (!customerId) throw new Error("kein Kundendatensatz");

    // Double-Opt-in: Bestaetigungslink per Mail (7 Tage gueltig)
    const token = mintToken(customerId, email);
    await sendeBestaetigungsMail(email, `https://shop.buttje.at/bestaetigen?t=${token}`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("optin fehlgeschlagen:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "Anmeldung derzeit nicht möglich. Bitte später erneut versuchen." },
      { status: 502 },
    );
  }
}
