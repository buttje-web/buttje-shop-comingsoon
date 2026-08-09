// Menge je Verpackungseinheit - die Grundlage fuer den Grundpreis.
//
// STRENGE REGELN, Vorgabe vom 05.08.2026:
//
// - Eingetragen wird NUR, was als EINE Zahl fuer die GANZE
//   Verpackungseinheit belegt ist. "1 Flasche (1 l)" belegt 1 Liter,
//   "Packung (60 Tabs)" belegt 60 Stueck.
// - NICHTS wird aus Fliesstext geraten und NICHTS umgerechnet. Auch
//   nicht "4 Rollen mal 11 m": sobald zwei Zahlen multipliziert werden
//   muessten, fehlt der Eintrag. Genau ueber solche Umrechnungen ist
//   die VE-Falle offen (Preisbezug Flasche statt Karton, Faktor bis 40).
// - Produkte mit VE wie "12 Flaschen/Karton" bekommen KEINEN Eintrag,
//   solange der Lieferant den Preisbezug nicht geklaert hat: bezieht
//   sich der Preis auf die Flasche, waere ein Grundpreis je Karton um
//   den Faktor 12 falsch. Fehlend ist zulaessig, falsch ist abmahnbar.
// - Ein fehlender Eintrag heisst nur: kein Grundpreis in der Anzeige.
// - Zusaetzlich prueft die Anzeige zur Laufzeit, ob die Cent-Rundung den
//   Grundpreis um mehr als 2 Prozent verzerren wuerde, und laesst die
//   Zeile dann weg (app/lib/preis.ts, grundpreisAmount). Ein heute
//   exakter Eintrag kann also nie durch eine Preisaenderung zu einer
//   falschen Anzeige werden.
//
// NACHTRAGEN, wenn die VE-Klaerungen vom Lieferanten kommen: eine Zeile
// je Handle mit menge, einheit und quelle. quelle ist Pflicht - jede
// Zahl muss sich ohne Suche nachpruefen lassen.
//
// Die Menge gilt je Verpackungseinheit, also je Variante. Heute hat
// jedes Produkt genau eine Variante (am 05.08. ueber die Live-Seite
// belegt: kein einziges GROESSE WAEHLEN). Kommen Varianten mit
// verschiedenen Groessen, muss dieses Feld je Variante aufgeteilt
// werden, nicht je Produkt.

export type Grundmenge = {
  /** Inhalt der Verpackungseinheit, in der Einheit darunter. */
  menge: number;
  einheit: "l" | "kg" | "m" | "stueck";
  /** Pflicht: woher die Zahl stammt. */
  quelle: string;
};

export const EINHEIT_KURZ: Record<Grundmenge["einheit"], string> = {
  l: "l",
  kg: "kg",
  m: "m",
  stueck: "Stück",
};

export const GRUNDMENGEN: Record<string, Grundmenge> = {
  // CHEMIE, 1-Liter-Flaschen: VE-Feld "1 Flasche (1 l)", Preis je Flasche.
  "dr-schnell-forol-universalreiniger-1-l-ds-00114-1": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "dr-schnell-milizid-sanitaerreiniger-1-l-ds-00104-1000": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "buzil-unibuz-g-235-wischpflege-1-l-bu-g235-0001ra": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "buzil-bucasan-trendy-t-464-sanitaerreiniger-1-l-bu-t464-0001ra": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "buzil-perfekt-g-440-intensiv-kraftreiniger-1-l-bu-g440-0001ra": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "buzil-corridor-daily-s-780-wischpflege-1-l-bu-s780-0001ra": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "taski-jontec-tensol-wischpflege-1-l-di-7513138": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "taski-sani-cid-sanitaerreiniger-1-l-di-7512833": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },
  "arcora-tenas-4in1-teppichreiniger-1-l-ac-01008": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter",
  },
  "dr-schnell-forex-grundreiniger-alkalisch-1-l-ds-00261": {
    menge: 1, einheit: "l", quelle: "VE-Feld: 1 Flasche (1 l); Technikdaten: Gebinde 1 Liter Flasche",
  },

  // SEIFE, Kanister: VE-Feld nennt den Inhalt direkt.
  "cws-bestcream-seifencreme-neutral-5-l-cws-c490000": {
    menge: 5, einheit: "l", quelle: "VE-Feld: Kanister (5 l); Technikdaten: Inhalt 5 Liter (Kanister)",
  },
  "stern-velvet-handseife-rosa-5-l-ste-106123": {
    menge: 5, einheit: "l", quelle: "VE-Feld: Kanister (5 l); Technikdaten: Inhalt 5 Liter (Kanister)",
  },

  // ENTSORGUNG: VE-Feld ist zugleich der Variantentitel, der Preis gilt
  // also genau fuer diese Stueckzahl (Variantentitel am 05.08. an den
  // Produktseiten geprueft).
  "deiss-muellbeutel-6-l-grau-54928": {
    menge: 50, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 50 Stück/Rolle",
  },
  "deiss-universal-plus-muellbeutel-30-l-grau-44904": {
    menge: 50, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 50 Stück/Rolle",
  },
  "deiss-muellbeutel-60-l-transparent-59984": {
    menge: 50, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 50 Stück/Rolle",
  },
  "deiss-universal-plus-muellbeutel-60-l-transparent-49908": {
    menge: 50, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 50 Stück/Rolle",
  },
  "altruan-abfallsack-120-l-typ-60-blau-al-12060": {
    menge: 25, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 25 Stück/Rolle",
  },
  "deiss-abfallsack-120-l-typ-60-blau-20010": {
    menge: 25, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 25 Stück/Rolle",
  },
  "altruan-abfallsack-120-l-typ-70-premium-blau-12070": {
    menge: 25, einheit: "stueck", quelle: "VE-Feld und Variantentitel: 25 Stück/Rolle",
  },
  // KEIN Eintrag fuer deiss-premium-plus-abfallsack-120-l-typ-100-blau-10010:
  // Die VE "250 Stück/Karton" ist ein Mehrgebinde, der Variantentitel wurde
  // nicht geprueft, und die Plausibilitaet spricht gegen den Karton-Bezug
  // (7,50 / 250 = 3 Cent je Premium-Sack Typ 100, waehrend die schwaecheren
  // Typ-60-Saecke 10 bis 12 Cent kosten). Erst eintragen, wenn der
  // Preisbezug vom Lieferanten belegt ist.

  // ZUBEHOER, Stueckware mit Stueckzahl im VE-Feld.
  "kiehl-arcandis-ecotab-spueltabs-60-stueck-jk-j56115a": {
    menge: 60, einheit: "stueck", quelle: "VE-Feld: Packung (60 Tabs)",
  },
  "mikrofaser-ena-soft-40x40": {
    menge: 10, einheit: "stueck", quelle: "VE-Feld: Packung (10 Stück)",
  },
  "arcora-polish-line-mikrofasertuch-hochflor-randlos-10-stueck-ac-apol4040bl": {
    menge: 10, einheit: "stueck", quelle: "VE-Feld: 10 Stück/Packung",
  },
  "vileda-schwammtuch-aqua-gr-1-5-stueck-vp-142290": {
    menge: 5, einheit: "stueck", quelle: "VE-Feld: 5 Stück/Packung",
  },
  "vileda-professional-staubbindetuch-101-high-performance-60x24-cm-50-stueck-vp-133920": {
    menge: 50, einheit: "stueck", quelle: "VE-Feld: 50 Stück/Packung",
  },
  "taski-padschwamm-10-stueck": {
    menge: 10, einheit: "stueck", quelle: "VE-Feld: 10 Stück",
  },
  // Nachgetragen am 09.08. nach Preispflege, Freigabe Rami:
  "deiss-abfallsaecke-recycling-ldpe-120-l-transparent-de-29071-120": {
    menge: 25, einheit: "stueck", quelle: "VE-Feld: Rolle à 25 Stück",
  },
  "scotch-brite-extreme-topfreiniger-extra-stark-12-stueck-3m-7100248037": {
    menge: 12, einheit: "stueck", quelle: "VE-Feld: 12 Stück/Packung",
  },
  "noelle-profi-brush-jumbo-abfallsack-240-l-60-my-schwarz-nl-00738750": {
    menge: 1, einheit: "stueck", quelle: "VE-Feld: 1 Stück",
  },
  // Einzelstuecke: Grundpreis gleich dem Artikelpreis. Redundant, aber
  // belegt und regelkonform - die Zeile macht die Angabe vollstaendig.
  "dr-schnell-handsprueher-leer-600-ml": {
    menge: 1, einheit: "stueck", quelle: "VE-Feld: 1 Stück",
  },
  "vileda-fensterabzieher": {
    menge: 1, einheit: "stueck", quelle: "VE-Feld: 1 Stück",
  },
};
