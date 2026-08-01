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
        Bei lagernder Ware in der Regel 3 bis 7 Werktage ab Zahlungseingang. Bei
        nicht lagernder Ware verlängert sich die Lieferzeit um die
        Beschaffungszeit; wir informieren Sie in diesem Fall über den
        voraussichtlichen Liefertermin.
      </p>

      {/* Betraege bewusst ausgeschrieben, nicht aus app/lib/versand.ts
          interpoliert — siehe Begruendung in app/agb/page.tsx (Punkt 5.4). */}
      <h2>Versandkosten</h2>
      <p>
        Pauschal 10,00 EUR netto je Bestellung. Ab einem Warenwert von 150,00 EUR
        netto liefern wir versandkostenfrei. Bei sperriger oder schwerer Ware
        sowie bei Lieferungen in Palettengröße erstellen wir auf Anfrage ein
        gesondertes Versandangebot.
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
