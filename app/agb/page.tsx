import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "AGB" };

export default function AgbPage() {
  return (
    <LegalArticle
      eyebrow="Rechtliches"
      title="AGB"
      updated="01.08.2026"
    >
      <p>
        <strong>
          Allgemeine Geschäftsbedingungen, ausschließlich für Geschäftskunden
          (B2B)
        </strong>
      </p>

      <h2>1. Geltungsbereich und Vertragspartner</h2>
      <p>
        1.1 Diese AGB gelten für alle Bestellungen über den Onlineshop
        shop.buttje.at.
      </p>
      <p>
        1.2 Verkäufer ist buttje e.U., Graben 28/1/12, 1010 Wien (nachfolgend
        "buttje").
      </p>
      <p>
        1.3 Der Verkauf erfolgt <strong>ausschließlich an Unternehmer</strong>{" "}
        im Sinne des § 1 UGB, an juristische Personen des öffentlichen Rechts
        sowie an Vereine. Ein Verkauf an Verbraucher findet nicht statt.
      </p>
      <p>
        1.4 Mit der Bestellung bestätigt der Kunde, als Unternehmer und nicht
        als Verbraucher zu handeln.
      </p>

      <h2>2. Vertragsschluss</h2>
      <p>
        2.1 Die Darstellung der Produkte im Shop stellt kein bindendes Angebot
        dar, sondern eine Aufforderung zur Bestellung.
      </p>
      <p>2.2 Mit Absenden der Bestellung gibt der Kunde ein verbindliches Angebot ab.</p>
      <p>
        2.3 Der Vertrag kommt mit der Auftragsbestätigung durch buttje bzw. mit
        Versand der Ware zustande.
      </p>

      <h2>3. Preise</h2>
      <p>
        3.1 Alle Preise verstehen sich netto zuzüglich der jeweils geltenden
        gesetzlichen österreichischen Umsatzsteuer.
      </p>
      <p>
        3.2 Versandkosten werden im Bestellprozess gesondert ausgewiesen und sind
        vor Abschluss der Bestellung ersichtlich.
      </p>

      <h2>4. Zahlung</h2>
      <p>
        4.1 Es stehen folgende Zahlungsarten zur Verfügung: Kreditkarte,
        Sofortzahlung sowie Vorkasse per Überweisung.
      </p>
      <p>4.2 Die Ware wird erst nach vollständigem Zahlungseingang versendet.</p>
      <p>
        4.3 Ein Kauf auf Rechnung mit Zahlungsziel kann ausgewählten Stammkunden
        nach gesonderter Vereinbarung eingeräumt werden.
      </p>

      <h2>5. Lieferung</h2>
      <p>5.1 Die Lieferung erfolgt ausschließlich innerhalb Österreichs.</p>
      <p>
        5.2 Die Lieferzeit beträgt bei lagernder Ware in der Regel 3 bis 7
        Werktage ab Zahlungseingang. Bei nicht lagernder Ware verlängert sich die
        Lieferzeit um die Beschaffungszeit; der Kunde wird in diesem Fall über
        den voraussichtlichen Liefertermin informiert.
      </p>
      <p>
        5.3 Angegebene Lieferzeiten sind unverbindliche Richtwerte, sofern nicht
        ausdrücklich ein verbindlicher Liefertermin vereinbart wurde.
      </p>
      {/* Betraege hier BEWUSST ausgeschrieben und nicht aus app/lib/versand.ts
          interpoliert: Rechtstext soll sich nie stillschweigend mitaendern,
          wenn jemand die Versandkonstanten anfasst. Wer VERSAND aendert, muss
          diesen Absatz und /versand-zahlung bewusst mitziehen. */}
      <p>
        5.4 Die Versandkosten betragen pauschal 10,00 EUR netto je Bestellung. Ab
        einem Warenwert von 150,00 EUR netto erfolgt die Lieferung
        versandkostenfrei. Bei sperriger oder schwerer Ware sowie bei
        Lieferungen in Palettengröße erfolgt der Versand auf Anfrage zu
        gesondertem Versandtarif.
      </p>

      <h2>6. Eigentumsvorbehalt</h2>
      <p>
        Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum von
        buttje.
      </p>

      <h2>7. Gewährleistung und Rügepflicht</h2>
      <p>7.1 Es gelten die gesetzlichen Gewährleistungsbestimmungen.</p>
      <p>
        7.2 Der Kunde hat die Ware unverzüglich nach Erhalt zu prüfen und
        erkennbare Mängel unverzüglich, spätestens innerhalb von 5 Werktagen,
        schriftlich zu rügen (Rügepflicht im unternehmerischen Geschäftsverkehr).
      </p>
      <p>7.3 Unterbleibt die Rüge, gilt die Ware als genehmigt.</p>

      <h2>8. Rücknahme / freiwillige Kulanz</h2>
      <p>8.1 Ein gesetzliches Widerrufsrecht besteht im unternehmerischen Geschäftsverkehr nicht.</p>
      <p>
        8.2 Eine Rücknahme einwandfreier Ware erfolgt ausschließlich nach
        vorheriger Absprache und auf Kulanzbasis. Die Rücksendekosten trägt in
        diesem Fall der Kunde.
      </p>

      <h2>9. Haftung</h2>
      <p>
        buttje haftet nach den gesetzlichen Bestimmungen. Die Haftung für leichte
        Fahrlässigkeit ist, soweit gesetzlich zulässig, ausgeschlossen, ausgenommen
        Personenschäden.
      </p>

      <h2>10. Erfüllungsort und Gerichtsstand</h2>
      <p>10.1 Erfüllungsort ist Wien.</p>
      <p>10.2 Als Gerichtsstand wird das sachlich zuständige Gericht in Wien vereinbart.</p>
      <p>10.3 Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.</p>

      <h2>11. Schlussbestimmungen</h2>
      <p>
        Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der
        übrigen Bestimmungen unberührt.
      </p>
    </LegalArticle>
  );
}
