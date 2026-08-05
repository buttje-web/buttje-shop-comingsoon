import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "Versand & Zahlung" };

export default function VersandZahlungPage() {
  return (
    <LegalArticle eyebrow="Service" title="Versand & Zahlung">
      <h2>Liefergebiet</h2>
      <p>Wir liefern innerhalb Österreichs.</p>

      {/* Zwei Faelle getrennt ausgewiesen, damit die Zusage aus dem Ticker
          ("3 bis 7 Werktage bei Lagerware") bei Beschaffungsware nicht bricht.
          Quelle: schriftliche Praezisierung des Lieferanten vom 31.07.2026
          (dort 3 bis 5 Werktage). Die 7 Werktage sind der bewusst behaltene
          Puffer, Entscheidung Rami vom 03.08.2026 - der Lieferant stellt
          gerade sein Logistikzentrum um. */}
      <h2>Lieferzeit</h2>
      <p>
        Lagernde Ware erreicht Sie in der Regel innerhalb von 3 bis 7 Werktagen
        ab Zahlungseingang.
      </p>
      <p>
        Nicht lagernde Ware beschaffen wir zunächst. Die Beschaffung dauert in
        der Regel etwa eine Woche, danach kommen 3 bis 7 Werktage bis zur
        Zustellung hinzu. Über den voraussichtlichen Liefertermin informieren wir
        Sie in diesem Fall gesondert.
      </p>
      <p>Alle Angaben sind unverbindliche Richtwerte.</p>

      {/* Betraege bewusst ausgeschrieben, nicht aus app/lib/versand.ts
          interpoliert - siehe Begruendung in app/agb/page.tsx (Punkt 5.4). */}
      <h2>Versandkosten</h2>
      <p>
        Österreichweit gestaffelt nach Sendungsgewicht: bis 20 kg 10,00 €, bis
        40 kg 15,00 €, bis 60 kg 20,00 € (jeweils netto). Ab einem Warenwert von
        150,00 EUR netto liefern wir bei Sendungen bis 20 kg versandkostenfrei.
        Schwerere Sendungen sowie Lieferungen in Palettengröße kalkulieren wir
        individuell. Fragen Sie uns an.
      </p>

      <h2>Zahlungsarten</h2>
      <ul>
        <li>Kreditkarte</li>
        <li>Sofortzahlung</li>
        <li>Vorkasse per Überweisung</li>
      </ul>
      <p>
        Die Ware wird nach vollständigem Zahlungseingang versendet. Es fallen
        keine zusätzlichen Gebühren für die Wahl eines bestimmten Zahlungsmittels
        an.
      </p>
    </LegalArticle>
  );
}
