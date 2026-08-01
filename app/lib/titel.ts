/*
  Zahl und Einheit gehoeren in eine Zeile.

  ANLASS: "DEISS Müllbeutel 30 L, transparent" brach auf schmalen Screens
  zwischen "30" und "L" um. Das liest sich falsch und wirkt schlampig.

  WARUM IM RENDERING UND NICHT IN DEN SHOPIFY-TITELN: Die Titel in Shopify
  speisen auch Suche, Suchindex und spaeter den WhatsApp-Katalog. Ein hartes
  geschuetztes Leerzeichen in den Stammdaten koennte dort stoeren — beim
  Suchen wuerde "30 L" die Variante mit nbsp nicht mehr finden. Die Daten
  bleiben deshalb sauber, das geschuetzte Leerzeichen entsteht erst beim
  Ausspielen.

  WICHTIG: Nur fuer sichtbaren Text verwenden. NICHT fuer Meta-Titel,
  JSON-LD, Alt-Texte oder den Suchindex — dort gehoert das normale
  Leerzeichen hin.
*/

const NBSP = " ";

// Laengere Einheiten zuerst, sonst greift "m" bevor "mm" geprueft wird.
const EINHEITEN = ["ml", "mm", "cm", "kg", "my", "Stück", "Stk", "L", "l", "g", "m", "%"];

// Zahl (auch mit Komma oder Punkt) + Leerzeichen + Einheit,
// gefolgt von etwas, das kein Buchstabe/keine Ziffer ist.
// Beispiele: "30 L," · "600 ml" · "40 x 40 cm" · "11 my" · "5 Stück/Rolle" · "98,8 %"
const MUSTER = new RegExp(
  `(\\d+(?:[.,]\\d+)?)[ ${NBSP}]+(${EINHEITEN.join("|")})(?![\\p{L}\\p{N}])`,
  "gu",
);

/** Setzt zwischen Zahl und Einheit ein geschuetztes Leerzeichen. */
export function einheitenSchuetzen(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(MUSTER, `$1${NBSP}$2`);
}
