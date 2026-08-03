import type { Metadata } from "next";
import Container from "../components/Container";
import JsonLd from "../components/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "Häufige Fragen (FAQ) | buttje Shop" },
  description:
    "Antworten zu Bestellung, Versand und Zahlung im buttje Shop: Verkauf ausschließlich an Gewerbe, Lieferung innerhalb Österreichs, Nettopreise zzgl. USt, Versand gestaffelt nach Gewicht ab 10 EUR netto.",
  alternates: { canonical: "/faq" },
};

// Nuechterne, faktische FAQ (kein frecher Ton). Dient Google + KI-Suchen.
const FAQ: { q: string; a: string }[] = [
  {
    q: "Wer darf im buttje Shop bestellen?",
    a: "Der Verkauf erfolgt ausschließlich an Unternehmer, juristische Personen des öffentlichen Rechts und Vereine. Ein Verkauf an Verbraucher findet nicht statt. Mit der Bestellung bestätigt der Kunde, als Unternehmer zu handeln.",
  },
  {
    q: "Wohin wird geliefert?",
    a: "Wir liefern innerhalb Österreichs.",
  },
  {
    q: "Ab wann ist der Versand kostenlos?",
    a: "Die Versandkosten sind österreichweit nach Sendungsgewicht gestaffelt: bis 20 kg 10,00 EUR netto, bis 40 kg 15,00 EUR netto, bis 60 kg 20,00 EUR netto. Ab einem Netto-Warenwert von 150 EUR liefern wir bei Sendungen bis 20 kg versandkostenfrei. Schwerere Sendungen und Palettenlieferungen kalkulieren wir individuell auf Anfrage. Der genaue Betrag wird im Bestellprozess ausgewiesen.",
  },
  {
    q: "Wie sind die Preise angegeben?",
    a: "Alle Preise sind Nettopreise und verstehen sich zuzüglich der gesetzlichen Umsatzsteuer. Die Umsatzsteuer wird im Bestellprozess ausgewiesen.",
  },
  {
    q: "Welche Zahlungsarten gibt es?",
    a: "Zur Verfügung stehen Kreditkarte, Sofortzahlung sowie Vorkasse per Überweisung. Die Ware wird nach vollständigem Zahlungseingang versendet.",
  },
  {
    q: "Wie lange dauert die Lieferung?",
    a: "Lagernde Ware erreicht Sie in der Regel innerhalb von 3 bis 7 Werktagen ab Zahlungseingang. Nicht lagernde Ware beschaffen wir zunächst; die Beschaffung dauert in der Regel etwa eine Woche, danach kommen 3 bis 7 Werktage bis zur Zustellung hinzu. Über den voraussichtlichen Liefertermin informieren wir Sie in diesem Fall gesondert. Alle Angaben sind unverbindliche Richtwerte.",
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Container className="py-[clamp(40px,7vw,88px)]">
      <JsonLd data={faqLd} />
      <p className="eyebrow mb-3">Service</p>
      <h1 className="mb-8 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase tracking-[-0.03em]">
        Häufige Fragen
      </h1>
      <div className="legal">
        {FAQ.map((f) => (
          <section key={f.q}>
            <h2>{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
