/*
  Die sechs Kategoriemotive: Dateibasis und Alt-Text, an EINER Stelle.

  Sie werden zweimal ausgeliefert - als Kachel auf der Startseite und als
  Kopfbild der Kategorieseite. Der Alt-Text muss an beiden Stellen
  derselbe sein, sonst beschreibt der Shop dasselbe Bild zweimal
  verschieden. Zwei Kopien in zwei Dateien halten das nicht aus, deshalb
  steht es hier.

  Alle sechs Motive sind KI-erzeugt. Der Alt-Text sagt das an erster
  Stelle und beschreibt danach sachlich, was zu sehen ist - keine
  Werbesprache, das ist ein Alt-Text und keine Anzeige. Die sichtbare
  Kennzeichnung nach Artikel 50 der EU-KI-Verordnung leistet nicht der
  Alt-Text, sondern KiLabel; Begruendung steht dort.
*/

// Von Entsorgung gibt es zwei Fassungen, verwendet wird die mit dem
// gebundenen Sack; entsorgung-a bleibt im Repo liegen.
export const BILD_BASIS: Record<string, string> = {
  entsorgung: "entsorgung-b-final",
  papier: "papier-final",
  chemie: "chemie-final",
  seifen: "seifen-final",
  handschuhe: "handschuhe-final",
  zubehoer: "zubehoer-final",
};

export const BILD_ALT: Record<string, string> = {
  entsorgung:
    "KI-generiert. Drei Rollen Müllsäcke in Grün, Grau und Blau, daneben ein gefüllter schwarzer Sack und eine liegende schwarze Rolle vor dunklem Hintergrund.",
  papier:
    "KI-generiert. Gestapelte Toilettenpapierrollen, eine Küchenrolle und ein Stapel gefalteter Papierhandtücher vor dunklem Hintergrund.",
  chemie:
    "KI-generiert. Sprühflasche, Kanister, Dosierflaschen und ein Seifenspender mit leeren weißen Etiketten auf dunklen Podesten.",
  seifen:
    "KI-generiert. Drei weiße Spenderflaschen auf dunklen Sockeln, daneben Schaum und Seifenblasen vor dunklem Hintergrund.",
  handschuhe:
    "KI-generiert. Eine Hand in schwarzem Einweghandschuh neben einer schwarzen Schachtel mit der Aufschrift Einweghandschuhe.",
  zubehoer:
    "KI-generiert. Gestapelte Mikrofasertücher, Topfreiniger, eine Kehrschaufel und ein Handbesen vor dunklem Hintergrund.",
};

// Vorhandene WebP-Breiten. Mehr gibt es nicht und mehr braucht es nicht:
// die Dateien sind 1344 px breit, alles darueber waere hochgerechnet.
export const BILD_BREITEN = [384, 768, 1344];

export function bildSrcSet(basis: string): string {
  return BILD_BREITEN.map((b) => `/kategorie/${basis}-${b}.webp ${b}w`).join(", ");
}
