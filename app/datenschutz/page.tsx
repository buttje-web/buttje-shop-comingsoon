import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <LegalArticle
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      updated="01.08.2026"
    >
      <h2>1. Verantwortlicher</h2>
      <p>
        buttje e.U., Rami Ibraimi, Graben 28/1/12, 1010 Wien,{" "}
        <a href="mailto:shop@buttje.at">shop@buttje.at</a>
      </p>

      <h2>2. Welche Daten wir verarbeiten</h2>
      <p>
        Bei einer Bestellung verarbeiten wir: Firmenname, Ansprechpartner,
        Anschrift, E-Mail, Telefonnummer, UID (sofern angegeben), Bestell- und
        Zahlungsdaten.
      </p>

      <h2>3. Zwecke und Rechtsgrundlagen</h2>
      <ul>
        <li>Vertragsabwicklung (Art. 6 Abs. 1 lit. b DSGVO)</li>
        <li>
          Erfüllung rechtlicher Pflichten, z. B. steuerliche Aufbewahrung (Art. 6
          Abs. 1 lit. c DSGVO)
        </li>
        <li>
          Berechtigtes Interesse an sicherem Shopbetrieb (Art. 6 Abs. 1 lit. f
          DSGVO)
        </li>
      </ul>

      <h2>4. Weitergabe an Dritte</h2>
      <p>
        Zur Vertragserfüllung geben wir Daten an die für Versand und Zahlung
        notwendigen Dienstleister weiter (Versanddienstleister,
        Zahlungsdienstleister, Logistikpartner). Eine Weitergabe erfolgt nur,
        soweit dies für die Abwicklung erforderlich ist.
      </p>

      <h2>5. Speicherdauer</h2>
      <p>
        Wir speichern Daten so lange, wie es für die Vertragsabwicklung und zur
        Erfüllung gesetzlicher Aufbewahrungsfristen (insbesondere steuerrechtlich
        10 Jahre) erforderlich ist.
      </p>

      <h2>6. Hosting und technische Dienstleister</h2>
      <p>
        Der Shop wird über Vercel (Frontend) sowie einen externen
        Shopsystem-Dienstleister (Bestell- und Zahlungsabwicklung) betrieben.
        Dabei werden technisch notwendige Daten (z. B. Server-Logs)
        verarbeitet.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Wir verwenden ausschließlich technisch notwendige Cookies, etwa für
        den Warenkorb und den Bestellprozess. Cookies zu Analyse- oder
        Werbezwecken setzen wir nicht ein; ein Cookie-Banner ist daher nicht
        erforderlich.
      </p>

      <h2>8. Webanalyse (Plausible Analytics)</h2>
      <p>
        Zur Reichweitenmessung setzen wir Plausible Analytics ein, einen
        Webanalysedienst der Plausible Insights OÜ, Västriku tn 2, 50403
        Tartu, Estland. Plausible arbeitet ohne Cookies und ohne Speicherung
        personenbezogener Daten; IP-Adressen werden nicht gespeichert,
        Besucher werden nicht über mehrere Websites hinweg verfolgt. Die
        Verarbeitung erfolgt auf Servern innerhalb der Europäischen Union.
        Rechtsgrundlage ist unser berechtigtes Interesse an einer
        datenschutzfreundlichen, anonymisierten Analyse der Nutzung unseres
        Onlineshops (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>9. Eröffnungs-Information und Newsletter (Opt-in)</h2>
      <p>
        Wenn Sie sich für unsere Eröffnungs-Information anmelden, verarbeiten
        wir Ihre E-Mail-Adresse sowie den Zeitpunkt Ihrer Einwilligung, um Sie
        per E-Mail über die Eröffnung und Angebote unseres Shops zu
        informieren. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1
        lit. a DSGVO). Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Erst
        nach Bestätigung gilt Ihre Einwilligung als erteilt. Sie können sich
        jederzeit abmelden — per Abmeldelink in jeder E-Mail oder formlos an{" "}
        <a href="mailto:shop@buttje.at">shop@buttje.at</a>. Die Daten werden in
        unserem Shopsystem gespeichert und nach Widerruf für Werbezwecke nicht
        weiter verwendet.
      </p>

      <h2>10. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung,
        Datenübertragbarkeit und Widerspruch. Beschwerden können Sie an die
        österreichische Datenschutzbehörde (
        <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">
          dsb.gv.at
        </a>
        ) richten.
      </p>
    </LegalArticle>
  );
}
