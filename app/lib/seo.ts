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
// Bitte hier NICHT wieder eintragen.
export const ORG = {
  legalName: "buttje e.U.",
  name: "buttje Shop",
  url: SITE_URL,
  telephone: "+43 1 236 632 64 42",
  vatID: "ATU81765216",
  address: {
    streetAddress: "Graben 28/1/12",
    postalCode: "1010",
    addressLocality: "Wien",
    addressCountry: "AT",
  },
  areaServed: ["AT"],
};

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
