// Cross-Selling: kuratierte Empfehlungen je Produkt (Aufgabe 4, 09.08.2026).
//
// ZWEI BLOECKE je Produktseite: "Alternativen" (hoechstens 2) und
// "Passt dazu" (hoechstens 3). KURATIERT, NICHT BERECHNET - die Listen
// unten sind von Hand aus den von Rami abgenommenen Gruppenregeln
// abgeleitet.
//
// AUFBAU:
// - GRUPPEN_PASST_DAZU: der "Passt dazu"-Vorschlag je Warengruppe
//   (die Gruppenregel). Gilt fuer jedes Produkt der Gruppe, das keine
//   eigene passtDazu-Liste fuehrt.
// - ZUORDNUNG: je SKU die Warengruppe, die kuratierten Alternativen
//   (naturgemaess je Produkt verschieden: "andere Groesse", "andere
//   Falzung", "gleiche Einsatzgruppe") und optional eine eigene
//   passtDazu-Liste. Eine eigene Liste UEBERSTEUERT die Gruppenregel
//   fuer genau dieses Produkt, ohne die Regel selbst anzutasten.
//
// HARTE REGELN (durchgesetzt in CrossSelling.tsx, nicht hier):
// - Produkte mit Preis 0 (auf Anfrage) erscheinen NIE als Empfehlung.
//   Deshalb stehen hier bewusst auch keine: Stand 09.08.2026 betrifft
//   das u. a. alle Handschuhe, beide Glasreiniger, die Papierwischtuecher
//   und den Recycling-Abfallsack - wo eine Gruppenregel nur solche
//   Kandidaten hat, faellt der Punkt ersatzlos weg (Bericht an Rami).
// - Die gesperrten Artikel (GESPERRTE_SKUS) sind ausgeschlossen, auch
//   wenn sie spaeter wieder Preise bekommen.
// - Leere Bloecke verschwinden, keine Platzhalter.
//
// NICHT ERFUELLBAR AUS DEM SORTIMENT (gemeldet, nicht erfunden):
// - "Paketband" (passt dazu bei Muellsaecken 120 L): kein Artikel.
// - "Handschuhe" als Empfehlung: alle Handschuhe stehen auf Anfrage.
// - Warengruppe Staubsauger-Deos: derzeit keine Artikel im Sortiment.
//
// NACHTRAG, VORGEMERKT (Rami, 09.08.2026 - NICHT vorab bauen):
// Sobald die Handschuhe Preise haben (Ausloeser: SKU-Lieferung des
// Lieferanten), bekommen sie eine EIGENE Gruppenregel:
//   passt dazu: Reiniger und Muellsaecke.
//   Alternativen: untereinander nach Material (Nitril/Latex/Vinyl).
// Gleichzeitig werden Handschuhe wieder als passt-dazu-Ziel in den
// bestehenden Gruppen ergaenzt (muellbeutel-klein, muellsaecke-120,
// reiniger - siehe Gruppenregeln oben).

/** Gesperrte Artikel - erscheinen NIE als Empfehlung (Vorgabe Rami). */
export const GESPERRTE_SKUS: ReadonlySet<string> = new Set([
  "AL-21171",
  "AL-21176",
  "AL-32556",
  "RS-11385", // Sanomat
]);

export type Warengruppe =
  | "muellbeutel-klein"
  | "muellsaecke-120"
  | "toilettenpapier"
  | "papierhandtuecher"
  | "kuechenrollen"
  | "seifen"
  | "reiniger"
  | "zubehoer"
  | "staubsauger-deos";

/**
 * "Passt dazu" je Warengruppe (Gruppenregel, kuratierte Auswahl):
 * - muellbeutel-klein: Hygienebeutel, 120 L. (Handschuhe: alle auf Anfrage.)
 * - muellsaecke-120: leer. (Paketband gibt es nicht, Handschuhe auf Anfrage.)
 * - toilettenpapier: Hygienebeutel, Handseife, Papierhandtuecher.
 * - papierhandtuecher: Handseife, Kuechenrollen.
 * - kuechenrollen: Oberflaechenreiniger (Schirocco Clean), Muellbeutel 30 L.
 * - seifen: Papierhandtuecher, Toilettenpapier.
 * - reiniger: Kuechenrollen, Handspruehflasche. (Handschuhe auf Anfrage.)
 * - zubehoer: der passende Reiniger - naturgemaess je Produkt verschieden,
 *   deshalb hier leer und je SKU uebersteuert.
 * - staubsauger-deos: Muellbeutel klein. (Derzeit keine Artikel der Gruppe.)
 */
export const GRUPPEN_PASST_DAZU: Record<Warengruppe, string[]> = {
  "muellbeutel-klein": ["56941", "20010"],
  "muellsaecke-120": [],
  toilettenpapier: ["56941", "STE-106123", "402292"],
  papierhandtuecher: ["STE-106123", "416596"],
  kuechenrollen: ["DS-00724-1000", "44904"],
  seifen: ["402292", "401977"],
  reiniger: ["416596", "DS-00883"],
  zubehoer: [],
  "staubsauger-deos": ["44904"],
};

export type Zuordnung = {
  gruppe: Warengruppe;
  /** Hoechstens 2. Kuratiert nach der Gruppenregel (Groesse/Staerke/Falzung/Einsatzgruppe). */
  alternativen: string[];
  /** Hoechstens 3. Wenn gesetzt: uebersteuert GRUPPEN_PASST_DAZU fuer dieses Produkt. */
  passtDazu?: string[];
};

/**
 * Zuordnung je SKU. Produkte ohne Eintrag zeigen keine Bloecke
 * (Stand 09.08.2026 sind das: Produkte ohne Artikelnummer, Handschuhe
 * ohne Gruppenregel, Hygienebeutel, Kosmetiktuecher, Papierwischtuecher,
 * 240-L-Sack - Begruendung im Bericht).
 */
export const ZUORDNUNG: Record<string, Zuordnung> = {
  // ---- Muellbeutel klein (6 bis 60 L) -------------------------------
  // Alternative: andere Groesse oder Universal Plus.
  "54928": { gruppe: "muellbeutel-klein", alternativen: ["44904", "49908"] },
  "44904": { gruppe: "muellbeutel-klein", alternativen: ["49908", "54928"] },
  "49908": { gruppe: "muellbeutel-klein", alternativen: ["44904", "54928"] },
  "59983": { gruppe: "muellbeutel-klein", alternativen: ["44904", "49908"] },
  "59984": { gruppe: "muellbeutel-klein", alternativen: ["49908", "44904"] },

  // ---- Muellsaecke 120 L --------------------------------------------
  // Alternative nach Staerke (Typ 60 / Typ 70 Premium / Typ 100).
  // "Passt dazu" bleibt leer: Paketband existiert nicht, Handschuhe
  // stehen auf Anfrage - der Block verschwindet (Regel: keine Platzhalter).
  "10010": { gruppe: "muellsaecke-120", alternativen: ["12070", "20010"] },
  "12070": { gruppe: "muellsaecke-120", alternativen: ["10010", "AL-12060"] },
  "20010": { gruppe: "muellsaecke-120", alternativen: ["12070", "10010"] },
  "AL-12060": { gruppe: "muellsaecke-120", alternativen: ["12070", "10010"] },
  "DE-29071-120": { gruppe: "muellsaecke-120", alternativen: ["20010", "10010"] },

  // ---- Toilettenpapier ----------------------------------------------
  // Alternative: Kleinrolle oder Jumbo (jeweils das andere Format zuerst).
  "110255": { gruppe: "toilettenpapier", alternativen: ["CU-3380CN", "401977"] },
  "401977": { gruppe: "toilettenpapier", alternativen: ["404578", "110255"] },
  "404578": { gruppe: "toilettenpapier", alternativen: ["401977", "110255"] },
  "CU-3380CN": { gruppe: "toilettenpapier", alternativen: ["110255", "401977"] },
  "CWS-1700332": { gruppe: "toilettenpapier", alternativen: ["401977", "CU-3380CN"] },
  "PA-416619-K": { gruppe: "toilettenpapier", alternativen: ["401977", "404578"] },

  // ---- Papierhandtuecher --------------------------------------------
  // Alternative: andere Falzung.
  "402292": { gruppe: "papierhandtuecher", alternativen: ["416602"] },
  "416602": { gruppe: "papierhandtuecher", alternativen: ["402292"] },
  "KC-6638": { gruppe: "papierhandtuecher", alternativen: ["402292", "416602"] },

  // ---- Kuechenrollen ------------------------------------------------
  // Alternative laut Regel: Papierwischtuecher - der einzige Kandidat
  // (TO-130073) steht auf Anfrage, der Block verschwindet daher.
  "416596": { gruppe: "kuechenrollen", alternativen: ["TO-130073"] },
  "AB-6080": { gruppe: "kuechenrollen", alternativen: ["TO-130073"] },

  // ---- Seifen -------------------------------------------------------
  // Alternative untereinander (aehnliches Gebinde zuerst).
  "CWS-C490000": { gruppe: "seifen", alternativen: ["STE-106123", "DI-101108340"] },
  "DI-101108340": { gruppe: "seifen", alternativen: ["STE-106672", "CWS-C490000"] },
  "STE-106123": { gruppe: "seifen", alternativen: ["CWS-C490000", "STE-106672"] },
  "STE-106672": { gruppe: "seifen", alternativen: ["DI-101108340", "STE-106123"] },

  // ---- Reiniger -----------------------------------------------------
  // Alternative innerhalb derselben Einsatzgruppe.
  // Sanitaer:
  "BU-T464-0001RA": { gruppe: "reiniger", alternativen: ["DS-00104-1000", "DI-7512833"] },
  "DI-7512833": { gruppe: "reiniger", alternativen: ["BU-T464-0001RA", "DS-00104-1000"] },
  "DS-00104-1000": { gruppe: "reiniger", alternativen: ["BU-T464-0001RA", "DI-7512833"] },
  "DB-1542000-750": { gruppe: "reiniger", alternativen: ["DS-00104-1000", "BU-T464-0001RA"] },
  "DI-100892014": { gruppe: "reiniger", alternativen: ["DI-7512833", "DS-00104-1000"] },
  // Wischpflege:
  "BU-G235-0001RA": { gruppe: "reiniger", alternativen: ["BU-S780-0001RA", "DI-7513138"] },
  "BU-S780-0001RA": { gruppe: "reiniger", alternativen: ["BU-G235-0001RA", "DI-7513138"] },
  "DI-7513138": { gruppe: "reiniger", alternativen: ["BU-G235-0001RA", "BU-S780-0001RA"] },
  // Grundreiniger:
  "BU-G440-0001RA": { gruppe: "reiniger", alternativen: ["DS-00261"] },
  "DS-00261": { gruppe: "reiniger", alternativen: ["BU-G440-0001RA"] },
  "JK-j400510": { gruppe: "reiniger", alternativen: ["DS-00261", "BU-G440-0001RA"] },
  // Universal:
  "DS-00114-1": { gruppe: "reiniger", alternativen: ["DS-00724-1000"] },
  "DS-00724-1000": { gruppe: "reiniger", alternativen: ["DS-00114-1"] },
  // Glas (beide auf Anfrage - Alternativen-Block verschwindet):
  "BU-G522-0001RA": { gruppe: "reiniger", alternativen: ["DS-00137-1000"] },
  "DS-00137-1000": { gruppe: "reiniger", alternativen: ["BU-G522-0001RA"] },
  // Spuelen. Uebersteuert: eine Handspruehflasche passt zum Spuelen
  // nicht, die Gruppenregel bleibt fuer die anderen Reiniger unveraendert.
  "DB-1128000": { gruppe: "reiniger", alternativen: ["JK-j56115a"], passtDazu: ["416596"] },
  "JK-j56115a": { gruppe: "reiniger", alternativen: ["DB-1128000"], passtDazu: ["416596"] },
  // Spezial:
  "BU-G502-0200VL": { gruppe: "reiniger", alternativen: ["AC-01008"] },
  "AC-01008": { gruppe: "reiniger", alternativen: ["BU-G502-0200VL"] },
  "DI-7010209": { gruppe: "reiniger", alternativen: [] }, // keine vergleichbare Edelstahlpflege

  // ---- Zubehoer -----------------------------------------------------
  // "Passt dazu": der passende Reiniger, je Produkt kuratiert.
  "DS-00883": { gruppe: "zubehoer", alternativen: [], passtDazu: ["BU-T464-0001RA", "DS-00724-1000"] },
  "DI-7515482": { gruppe: "zubehoer", alternativen: [], passtDazu: ["DI-7512833"] },
  "VP-142290": { gruppe: "zubehoer", alternativen: [], passtDazu: ["DB-1128000"] },
  "AB-1000003318": { gruppe: "zubehoer", alternativen: [], passtDazu: ["DS-00114-1"] },
  "AC-APOL4040BL": { gruppe: "zubehoer", alternativen: [], passtDazu: ["DI-7010209"] },
  "VP-133920": { gruppe: "zubehoer", alternativen: [], passtDazu: ["BU-G235-0001RA"] },
  "3M-7100248037": { gruppe: "zubehoer", alternativen: [], passtDazu: ["DB-1128000"] },
  // Fensterabzieher: passender Reiniger waeren die Glasreiniger - beide
  // auf Anfrage, der Block verschwindet (gemeldet).
  "VP-500209": { gruppe: "zubehoer", alternativen: [], passtDazu: ["BU-G522-0001RA"] },
};

/** Aufgeloeste Empfehlung fuer eine SKU, oder null ohne Zuordnung. */
export function empfehlungFuer(
  sku: string | null | undefined
): { alternativen: string[]; passtDazu: string[] } | null {
  if (!sku) return null;
  const z = ZUORDNUNG[sku];
  if (!z) return null;
  return {
    alternativen: z.alternativen,
    passtDazu: z.passtDazu ?? GRUPPEN_PASST_DAZU[z.gruppe],
  };
}
