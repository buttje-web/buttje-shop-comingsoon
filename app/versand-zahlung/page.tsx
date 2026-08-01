import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "Versand & Zahlung" };

export default function VersandZahlungPage() {
  return (
    <LegalArticle eyebrow="Service" title="Versand & Zahlung">
      <h2>Liefergebiet</h2>
      <p>Wir liefern innerhalb Österreichs.</p>

      <h2>Lieferzeit</h2>
      <p>
        In der Regel 5 bis 7 Werktage ab Zahlungseingang, abhängig von der
        Verfügbarkeit.
      </p>

      <h2>Versandkosten</h2>
      <p>
        Die Versandkosten richten sich nach Gewicht und Lieferort und werden im
        Warenkorb automatisch berechnet und vor Abschluss der Bestellung
        angezeigt. Bei sperriger oder schwerer Ware sowie bei Lieferungen in
        Palettengröße erstellen wir auf Anfrage ein gesondertes Versandangebot.
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
