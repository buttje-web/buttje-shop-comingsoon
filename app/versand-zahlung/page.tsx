import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

// Eigenes canonical, sonst erbt die Seite das der Startseite aus
// app/layout.tsx und zeigt damit auf eine ANDERE Adresse. Genau daran
// scheitert die SEO-Pruefung "Document does not have a valid rel=canonical".
export const metadata: Metadata = {
  title: "Versand & Zahlung",
  alternates: { canonical: "/versand-zahlung" },
};

export default function VersandZahlungPage() {
  return (
    <LegalArticle eyebrow="Service" title="Versand & Zahlung">
      <h2>Liefergebiet</h2>
      <p>Wir liefern ausschließlich innerhalb Österreichs.</p>

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
          interpoliert - siehe Begruendung in app/agb/page.tsx (Punkt 5.4).
          Die Staffel steht als sichtbare Tabelle, weil die FAQ-Antwort zu
          den Versandkosten genau hierher verweist (Vorgabe vom 09.08.). */}
      <h2>Versandkosten</h2>
      <p>Österreichweit, gestaffelt nach Sendungsgewicht:</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Sendungsgewicht</th>
            <th scope="col">Versandkosten</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>bis 20 kg</td>
            <td>10,00 EUR netto</td>
          </tr>
          <tr>
            <td>bis 40 kg</td>
            <td>15,00 EUR netto</td>
          </tr>
          <tr>
            <td>bis 60 kg</td>
            <td>20,00 EUR netto</td>
          </tr>
          <tr>
            <td>über 60 kg</td>
            <td>auf Anfrage</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ab einem Warenwert von 150,00 EUR netto liefern wir versandkostenfrei -
        das gilt bei Sendungen bis 20 kg. Schwerere Sendungen sowie Lieferungen
        in Palettengröße kalkulieren wir individuell. Fragen Sie uns an.
      </p>

      <h2>Zahlungsarten</h2>
      <ul>
        <li>Karte</li>
        <li>eps-Überweisung</li>
        <li>Google Pay</li>
        <li>Apple Pay</li>
      </ul>
      <p>
        Kauf auf Rechnung bieten wir derzeit nicht an. Die Ware wird nach
        vollständigem Zahlungseingang versendet. Es fallen keine zusätzlichen
        Gebühren für die Wahl eines bestimmten Zahlungsmittels an.
      </p>
    </LegalArticle>
  );
}
