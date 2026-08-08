// Zentrale SEO-/Geschaeftsdaten (aus dem Impressum). Serioes, faktisch.

export const SITE_URL = "https://shop.buttje.at";
export const SITE_NAME = "buttje Shop";

// Organisation (buttje e.U., Wien) fuer Organization-Schema.
//
// BEWUSST OHNE E-MAIL-ADRESSE: Der Organization-Block landet als JSON-LD in
// JEDER Seite. Eine Adresse darin steht im Klartext im Quelltext und ist die
// bequemste Beute fuer Adress-Sammler - genau das soll weg. Die Adresse
// kommt jetzt ausschliesslich aus app/lib/kontakt.ts und wird erst im
// Browser zusammengesetzt (app/components/EMailLink.tsx).
// BEWUSST OHNE TELEFONNUMMER: Vorgabe Rami (09.08.2026), keine
// Telefonnummern im Datenblock. Auch hier bitte NICHT wieder eintragen.
export const ORG = {
  legalName: "buttje e.U.",
  name: "buttje Shop",
  beschreibung: "Händler für Reinigungs- und Hygienebedarf",
  url: SITE_URL,
  vatID: "ATU81765216",
  firmenbuchnummer: "FN 648848p",
  // 512er-App-Icon als Logo: gross genug fuer die Google-Vorgabe (>= 112px),
  // quadratisch, liegt ohnehin unter public/.
  logo: `${SITE_URL}/icon-512.png`,
  address: {
    streetAddress: "Graben 28/1/12",
    postalCode: "1010",
    addressLocality: "Wien",
    addressCountry: "AT",
  },
  areaServed: ["AT"],
};

// Stabile Kennung des Organization-Blocks. Andere Datenbloecke (z. B. die
// FAQ-Seite als Herausgeber-Verweis) referenzieren die Organisation darueber,
// statt sie zu duplizieren.
export const ORG_ID = `${SITE_URL}/#organisation`;

export const FREE_SHIPPING_THRESHOLD = 100;

/*
  Standard-Vorschaubild fuer geteilte Links.

  Liegt hier und nicht nur in app/layout.tsx, weil jede Seite mit einem
  EIGENEN openGraph-Block den geerbten ersetzt statt ihn zu ergaenzen und
  das Bild deshalb erneut setzen muss. Ein zweiter Pfad im Code waere
  genau die Stelle, an der die beiden spaeter auseinanderlaufen.

  Die KI-Kennzeichnung ist in die Datei gebrannt, siehe scripts/og-bild.py.
*/
export const OG_BILD = "/og/og-standard.jpg";
export const OG_ALT =
  "buttje Shop, Wien: Kartons, Kanister, Müllsäcke und Zubehör (KI-generiert)";
