// Zentrale SEO-/Geschaeftsdaten (aus dem Impressum). Serioes, faktisch.

export const SITE_URL = "https://shop.buttje.at";
export const SITE_NAME = "buttje Shop";

// Organisation (buttje e.U., Wien) fuer Organization-Schema.
//
// BEWUSST OHNE E-MAIL-ADRESSE: Der Organization-Block landet als JSON-LD in
// JEDER Seite. Eine Adresse darin steht im Klartext im Quelltext und ist die
// bequemste Beute fuer Adress-Sammler — genau das soll weg. Die Adresse
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
