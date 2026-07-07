import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";
import { verifyToken } from "@/lib/optin-token";
import { adminGraphql } from "@/lib/shopify/admin";

export const metadata: Metadata = {
  title: "Anmeldung bestätigen",
  robots: { index: false, follow: false },
};

// Double-Opt-in-Bestaetigung. Next 16: searchParams ist ein Promise.
// Gueltiger Token -> Consent auf SUBSCRIBED (+ Zeitstempel), trockene
// Bestaetigung. Ungueltig/abgelaufen -> neutrale Fehlseite mit
// Moeglichkeit, sich neu einzutragen.

const CONSENT = `mutation($input: CustomerEmailMarketingConsentUpdateInput!){
  customerEmailMarketingConsentUpdate(input: $input){
    customer { id }
    userErrors { field message }
  } }`;

type Zustand = "bestaetigt" | "abgelaufen" | "ungueltig" | "fehler";

async function bestaetigen(token: string | undefined): Promise<Zustand> {
  if (!token) return "ungueltig";
  const t = verifyToken(token);
  if (!t.ok) return t.grund === "abgelaufen" ? "abgelaufen" : "ungueltig";
  try {
    await adminGraphql(CONSENT, {
      input: {
        customerId: t.customerId,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "CONFIRMED_OPT_IN",
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });
    return "bestaetigt";
  } catch (e) {
    console.error("bestaetigen fehlgeschlagen:", e instanceof Error ? e.message : e);
    return "fehler";
  }
}

export default async function BestaetigenPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const zustand = await bestaetigen(t);

  const inhalt: Record<Zustand, { titel: string; text: string }> = {
    bestaetigt: {
      titel: "Bestätigt.",
      text: "Ihre Anmeldung steht. Sie hören von uns, wenn der Shop für Geschäftskunden öffnet. Abmeldung jederzeit möglich — jede E-Mail enthält einen Abmeldelink.",
    },
    abgelaufen: {
      titel: "Link abgelaufen.",
      text: "Dieser Bestätigungslink war 7 Tage gültig und ist inzwischen abgelaufen. Tragen Sie sich einfach neu ein — dann kommt ein frischer Link.",
    },
    ungueltig: {
      titel: "Link ungültig.",
      text: "Dieser Bestätigungslink ist nicht gültig. Tragen Sie sich einfach neu ein — dann kommt ein frischer Link.",
    },
    fehler: {
      titel: "Das hat nicht geklappt.",
      text: "Die Bestätigung konnte gerade nicht verarbeitet werden. Bitte versuchen Sie den Link in ein paar Minuten erneut.",
    },
  };
  const { titel, text } = inhalt[zustand];

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Newsletter</p>
      <h1 className="mb-6 text-[clamp(1.8rem,5vw,3rem)] font-black uppercase tracking-[-0.02em]">
        {titel}
      </h1>
      <p className="max-w-[52ch] text-[0.98rem] leading-relaxed text-text-soft">{text}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        {(zustand === "abgelaufen" || zustand === "ungueltig") && (
          <Link
            href="/#newsletter"
            className="border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
          >
            Neu eintragen →
          </Link>
        )}
        <Link
          href="/produkte"
          className="border border-line px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Zum Sortiment →
        </Link>
      </div>
    </Container>
  );
}
