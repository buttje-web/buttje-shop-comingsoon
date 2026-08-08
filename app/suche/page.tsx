import type { Metadata } from "next";
import Container from "../components/Container";
import SuchErgebnisse from "./SuchErgebnisse";
import { KAUFBAR } from "../lib/shop-mode";

// Suchseite: noindex (interne Funktionsseite), Suchbegriff steckt im
// URL-Hash und erreicht den Server nicht.
// Eigenes canonical, sonst erbt die Seite das der Startseite aus
// app/layout.tsx und zeigt damit auf eine ANDERE Adresse. Genau daran
// scheitert die SEO-Pruefung "Document does not have a valid rel=canonical".
export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false, follow: false },
  alternates: { canonical: "/suche" },
};

export default function SuchePage() {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Suche</p>
      <h1 className="mb-8 text-[clamp(1.8rem,5vw,3rem)] font-black uppercase tracking-[-0.03em]">
        Produktsuche
      </h1>
      <SuchErgebnisse kaufbar={KAUFBAR} />
    </Container>
  );
}
