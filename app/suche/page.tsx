import type { Metadata } from "next";
import Container from "../components/Container";
import SuchErgebnisse from "./SuchErgebnisse";

// Suchseite: noindex (interne Funktionsseite), Suchbegriff steckt im
// URL-Hash und erreicht den Server nicht.
export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false, follow: false },
};

export default function SuchePage() {
  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <p className="eyebrow mb-3">Suche</p>
      <h1 className="mb-8 text-[clamp(1.8rem,5vw,3rem)] font-black uppercase tracking-[-0.03em]">
        Produktsuche
      </h1>
      <SuchErgebnisse />
    </Container>
  );
}
