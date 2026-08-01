import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";
import CartLines from "../components/CartLines";
import CheckoutGate from "../components/CheckoutGate";
import FreeShippingBar from "../components/FreeShippingBar";
import PriceTag from "../components/PriceTag";
import { KAUFBAR } from "../lib/shop-mode";
import { loadCart } from "@/lib/cart/actions";

export const metadata: Metadata = {
  title: "Sackerl",
  robots: { index: false, follow: true },
};

// Katalogmodus (KAUFBAR=aus): Kauf ist deaktiviert. Die Seite bleibt als
// neutraler Hinweis erreichbar (alte Lesezeichen/Links), fuehrt aber
// nirgendwohin ausser zurueck ins Sortiment.
// Kaufmodus (KAUFBAR=ein): echter Warenkorb mit Weg zum Shopify-Checkout.

function Geschlossen() {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Sackerl</p>
      <h1 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Noch nicht geöffnet
      </h1>
      <div className="border border-line px-6 py-16 text-center">
        <p className="mx-auto max-w-[46ch] text-muted">
          Der Shop startet in Kürze. Bis zur Eröffnung können Sie das Sortiment
          durchsehen — Preise für Geschäftskunden folgen.
        </p>
        <Link
          href="/produkte"
          className="mt-8 inline-block border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          Zum Sortiment →
        </Link>
      </div>
    </Container>
  );
}

function Leer() {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Sackerl</p>
      <h1 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Ihr Sackerl
      </h1>
      <div className="border border-line px-6 py-16 text-center">
        <p className="text-muted">Dein Sackerl ist leer.</p>
        <Link
          href="/produkte"
          className="mt-8 inline-block border border-line-strong px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          Zu den Produkten →
        </Link>
      </div>
    </Container>
  );
}

export default async function CartPage() {
  if (!KAUFBAR) return <Geschlossen />;

  const cart = await loadCart();
  if (!cart || cart.lines.length === 0) return <Leer />;

  const netto = Number(cart.cost.subtotalAmount.amount);

  // Sendungsgewicht in kg. Varianten ohne gepflegtes Gewicht zaehlen als 0 —
  // dann liegt die Schaetzung zu niedrig, nie zu hoch. gewichtVollstaendig
  // sagt der Anzeige, ob sie sich auf den Wert verlassen darf.
  const FAKTOR: Record<string, number> = { KILOGRAMS: 1, GRAMS: 0.001, POUNDS: 0.4535924, OUNCES: 0.0283495 };
  const gewichtKg = cart.lines.reduce((s, l) => {
    const w = l.merchandise.weight;
    const f = FAKTOR[l.merchandise.weightUnit ?? "KILOGRAMS"] ?? 1;
    return s + (w ? w * f * l.quantity : 0);
  }, 0);
  const gewichtVollstaendig = cart.lines.every((l) => (l.merchandise.weight ?? 0) > 0);

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Sackerl</p>
      <h1 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Ihr Sackerl
      </h1>

      <div className="grid grid-cols-1 gap-[clamp(24px,5vw,64px)] lg:grid-cols-[1fr_340px]">
        <div>
          <CartLines lines={cart.lines} />
        </div>

        <aside className="h-fit border border-line p-6">
          <FreeShippingBar
            amount={netto}
            gewichtKg={gewichtKg}
            gewichtBekannt={gewichtVollstaendig}
          />

          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Zwischensumme
            </span>
            <span className="text-lg font-semibold">
              <PriceTag
                amount={cart.cost.subtotalAmount.amount}
                currency={cart.cost.subtotalAmount.currencyCode}
              />
            </span>
          </div>

          <p className="mt-2 text-[0.66rem] leading-relaxed text-muted">
            Versandkosten werden im Bestellprozess ausgewiesen.
          </p>

          <div className="mt-6 border-t border-line pt-6">
            <CheckoutGate checkoutUrl={cart.checkoutUrl} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
