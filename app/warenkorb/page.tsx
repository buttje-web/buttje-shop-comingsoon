import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/Container";

export const metadata: Metadata = {
  title: "Warenkorb",
  robots: { index: false, follow: true },
};

// Katalogmodus: Kauf ist bis zur Eroeffnung deaktiviert. Die Seite bleibt
// als neutraler Hinweis erreichbar (alte Lesezeichen/Links), fuehrt aber
// nirgendwohin ausser zurueck ins Sortiment.

export default function CartPage() {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Warenkorb</p>
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
