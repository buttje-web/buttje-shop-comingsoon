import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <LegalArticle eyebrow="Rechtliches" title="Impressum">
      <p>Angaben gemäß § 5 ECG, § 14 UGB und § 25 MedienG</p>

      <address>
        <strong>buttje e.U.</strong>
        <br />
        Inhaber: Rami Ibraimi
        <br />
        Graben 28/1/12
        <br />
        1010 Wien, Österreich
      </address>

      <p>
        E-Mail:{" "}
        <a href="mailto:shop@buttje.at">shop@buttje.at</a>
        <br />
        Telefon: +43 1 236 632 64 42
      </p>

      <h2>Unternehmensdaten</h2>
      <p>
        Firmenbuchnummer: FN 648848p
        <br />
        Firmenbuchgericht: Handelsgericht Wien
        <br />
        UID-Nummer: ATU81765216
      </p>
      <p>
        Unternehmensgegenstand: Handel mit Reinigungs-, Hygiene- und
        Verbrauchsgütern
        <br />
        Gewerbeberechtigung: Handelsgewerbe
        <br />
        Mitgliedschaft: Wirtschaftskammer Wien (WKO)
        <br />
        Anwendbare gewerberechtliche Vorschriften: Gewerbeordnung (GewO),
        abrufbar unter{" "}
        <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer">
          www.ris.bka.gv.at
        </a>
        <br />
        Aufsichtsbehörde: Magistratisches Bezirksamt für den 1. Bezirk, Wien
      </p>

      <h2>Offenlegung gemäß § 25 MedienG</h2>
      <p>
        Medieninhaber und für den Inhalt verantwortlich: buttje e.U., Inhaber
        Rami Ibraimi, Anschrift wie oben.
      </p>
      <p>
        Grundlegende Richtung: Präsentation und Verkauf von Reinigungs-,
        Hygiene- und Verbrauchsgütern an Gewerbetreibende.
      </p>

      <h2>Hinweis zur Streitbeilegung</h2>
      <p>
        buttje e.U. verkauft ausschließlich an Unternehmer. Eine Teilnahme an
        einem Verbraucherschlichtungsverfahren ist daher nicht einschlägig.
      </p>
    </LegalArticle>
  );
}
