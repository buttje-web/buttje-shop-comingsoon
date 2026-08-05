// Kontaktadresse, absichtlich NICHT als zusammenhaengende Zeichenfolge.
//
// HINTERGRUND: Seit der Shop bei den Suchmaschinen eingereicht ist, sammeln
// Harvester die Adresse aus dem ausgelieferten HTML ab. Deshalb steht sie
// weder im HTML noch im JS-Bundle im Klartext, sondern base64-kodiert. Der
// Browser setzt sie erst zur Laufzeit zusammen.
//
// KEIN Ersatz fuer die Pflichtangabe: § 5 ECG verlangt unmittelbare
// elektronische Erreichbarkeit. Deshalb gibt es zwingend die lesbare
// Ersatzform fuer Besucher ohne JavaScript - siehe MAIL_LESBAR. Ein Bild
// oder ein reines Kontaktformular waere an dieser Stelle ein rechtliches
// Risiko und ist bewusst nicht gewaehlt.

/**
 * Die Shop-Adresse, base64-kodiert. Absichtlich auch hier im Kommentar
 * nicht ausgeschrieben - sonst stuende sie wieder als Zeichenfolge da.
 */
export const MAIL_B64 = "c2hvcEBidXR0amUuYXQ=";

/**
 * Lesbare Ersatzform ohne JavaScript. Fuer Menschen eindeutig, fuer
 * Sammler unbrauchbar, weil weder @ noch der Punkt vor der Endung
 * als Zeichen vorkommen.
 */
export const MAIL_LESBAR = "shop at buttje punkt at";

/** Setzt die Adresse zusammen. Nur im Browser aufrufen. */
export function mailKlartext(): string {
  return atob(MAIL_B64);
}
