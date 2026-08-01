// Redaktionelle Produktinhalte und Fachdaten, je SKU.
//
// WOHER: Die Abschnittstexte kommen von Rami (Batch 1a, 13 Chemie-Produkte).
// Die Fachdaten (pH, GISBAU, Inhalt) stammen aus den Hersteller-Datenblaettern,
// gesammelt in outputs/produktdaten-datenblaetter.md.
//
// WARUM HIER UND NICHT ALS SHOPIFY-METAFELD: Die Box mischt ohnehin Werte, die
// es in Shopify nicht gibt (pH, GISBAU-Code). Alles an einer Stelle zu halten
// ist nachvollziehbarer als eine halbe Wahrheit im Shop und die andere Haelfte
// im Code. Hersteller, SKU, EAN und VE kommen weiterhin live aus Shopify.
//
// Produkte ohne Eintrag rendern wie bisher: Headline, Bild, Kaufbereich.

export type Produktinhalt = {
  /** Aufmacher-Absatz unter der Headline. */
  aufmacher: string;
  anwendung?: string;
  dosierung?: string;
  /** Abschnitt "Gut zu wissen" — Warnhinweise, Handhabung, Haltbarkeit. */
  gutZuWissen?: string;
  /** Nur rendern, wenn belegt. Keine Auslobung ohne Nachweis im Datenblatt. */
  zertifikate?: string;
  /** Fuer die Produktdaten-Box; Felder einzeln optional. */
  technik?: {
    inhalt?: string;
    ph?: string;
    gisbau?: string;
    /**
     * Weitere Zeilen fuer die Box, in dieser Reihenfolge angehaengt.
     * Gedacht fuer Warengruppen mit ganz anderen Kennzahlen als Chemie —
     * Papier braucht Lagen, Blatt und Rollenlaenge, nicht pH und GISBAU.
     */
    weitere?: [string, string][];
  };
};

export const PRODUKTINHALTE: Record<string, Produktinhalt> = {
  "BU-G440-0001RA": {
    aufmacher:
      "Der hier wird gerufen, wenn der normale Reiniger nur noch lacht. Werkstattboden, Großküche, Brandsanierung. Danach sieht es aus, als wäre nie etwas gewesen.",
    anwendung:
      "Intensiv- und Grundreinigung in Industrie, Werkstatt und Großküche. Auch für lösemittelempfindliche Böden und den Einsatz im Hochdruckreiniger geeignet.",
    dosierung:
      "Unterhaltsreinigung 50 ml auf 10 l Wasser, Grundreinigung 50 bis 200 ml auf 10 l, stark verschmutzt 1:5 bis 1:10.",
    gutZuWissen:
      "Stark alkalisch (pH 13,5). Augenschutz verwenden, nicht auf alkaliempfindlichen Oberflächen einsetzen.",
    zertifikate:
      "Halal-zertifiziert (HALAL CONTROL), HACCP-konform, 98,8 % leicht biologisch abbaubar.",
    technik: { inhalt: "1 l", ph: "13,5 (Konzentrat)", gisbau: "GG 40" },
  },
  "BU-T464-0001RA": {
    aufmacher:
      "Sanitärbereich ist kein Wunschkonzert. Der hier nimmt Kalk, Urinstein und schlechte Laune in einem Durchgang mit.",
    anwendung:
      "Tägliche und intensive Sanitärreinigung auf säurebeständigen Oberflächen im gesamten Nassbereich.",
    dosierung:
      "Unterhaltsreinigung 20 bis 50 ml auf 10 l Wasser, hartnäckige Verschmutzung höher dosiert bis pur. Sprühflasche 50 ml auf 600 ml.",
    gutZuWissen:
      "Stark sauer. Nur auf säurebeständigen Materialien verwenden, Augen- und Hautschutz tragen.",
    zertifikate: "97,8 % leicht biologisch abbaubar.",
    technik: { inhalt: "1 l", ph: "0,5 (Konzentrat)", gisbau: "GS 80" },
  },
  "BU-G235-0001RA": {
    aufmacher:
      "Die Wischpflege für jeden Tag. Kein Drama, kein Schichtaufbau, einfach ein Boden, der gepflegt aussieht.",
    anwendung:
      "Wischpflege für alle wasserbeständigen Böden: PVC, Kautschuk, Linoleum, versiegeltes Parkett und Kork, Betonwerkstein, Naturstein. Auch im Reinigungsautomaten.",
    dosierung: "Unterhaltsreinigung 50 ml auf 10 l Wasser, bei Bedarf bis 150 ml.",
    zertifikate:
      "Geprüft für Sportböden nach DIN 18032-2 (FMPA). Kein Gefahrstoff.",
    technik: { inhalt: "1 l", ph: "7,0 (Konzentrat)", gisbau: "GU 40" },
  },
  "BU-S780-0001RA": {
    aufmacher:
      "Gebaut für Hallenböden, auf denen täglich Betrieb ist. Macht sauber und pflegt in einem Durchgang.",
    anwendung:
      "Wischpflege für Sportböden in Sport-, Turn- und Mehrzweckhallen sowie wasserbeständige Beläge. Geeignet für Einscheiben- und High-Speed-Maschinen.",
    dosierung:
      "Unterhaltsreinigung 20 bis 100 ml auf 10 l Wasser, Intensivreinigung 500 bis 1.000 ml auf 10 l, Einpflege 1:3.",
    zertifikate:
      "Geprüft für Sportböden nach DIN 18032-2 (FMPA), 87,2 % leicht biologisch abbaubar.",
    technik: { inhalt: "1 l", ph: "8,0 (Konzentrat)", gisbau: "GU 70" },
  },
  "BU-G502-0200VL": {
    aufmacher:
      "Kaugummi unterm Tisch, Etikett am Glas, Lack am Boden. Aufsprühen, tupfen, Thema beendet.",
    anwendung:
      "Fleckentferner für lösemittelbeständige, farbechte Oberflächen. Entfernt Kaugummi, Klebstoff- und Etikettenreste, Lack, Teer, Schuhcreme, Tinte, Wachs und Öle.",
    dosierung:
      "Pur aufsprühen, kurz einwirken lassen, von außen nach innen wegtupfen.",
    gutZuWissen:
      "Vor Anwendung an unauffälliger Stelle testen. Nach Anbruch innerhalb von 6 Monaten verbrauchen. Hochentzündliches Aerosol, von Zündquellen fernhalten.",
    technik: { inhalt: "200 ml" },
  },
  "DS-00114-1": {
    aufmacher:
      "Der Klassiker unter den Universalreinigern. Wenn ein Produkt im Putzwagen stehen darf, dann dieses.",
    anwendung:
      "Universalreiniger für alle wasserbeständigen glatten und strukturierten Oberflächen, auch antistatische Beläge. Plexiglas bis 5 % Dosierung.",
    dosierung:
      "Unterhaltsreinigung 25 ml auf 10 l Wasser (0,25 %), Sprühreinigung 0,25 bis 0,5 %, Grundreinigung 1:20.",
    zertifikate: "Kein Gefahrstoff.",
    technik: { inhalt: "1 l", ph: "10,5 (Konzentrat)", gisbau: "GU 50" },
  },
  "DS-00104-1000": {
    aufmacher:
      "Kalk, Urinstein, Rost, Zementschleier. Vier Gegner, ein Produkt, kein Rückspiel.",
    anwendung:
      "Sanitärreiniger für alle säurebeständigen Materialien in Sanitärräumen und Nasszellen. Entfernt Kalk, Kesselstein, Urinstein, Rost, Zementschleier und Kalkseife. Mit nachgewiesen deodorierender Wirkung.",
    dosierung:
      "WC pur, maximal 5 Minuten einwirken lassen. Unterhaltsreinigung 0,25 bis 0,5 %, Grundreinigung 10 % bis pur.",
    gutZuWissen:
      "Sauer. Nicht auf säureempfindlichen Materialien wie Marmor verwenden.",
    technik: { inhalt: "1 l", ph: "0,5 (Konzentrat)", gisbau: "GS 35" },
  },
  "DI-7513138": {
    aufmacher:
      "Reinigt und pflegt in einem Durchgang, ohne Schichten aufzubauen. Der Boden bleibt, wie er sein soll: unauffällig gut.",
    anwendung:
      "Wischpflege ohne Schichtaufbau, polierbar. Für wasserbeständige Böden inklusive PU-Beläge. Nicht auf unversiegeltem Holz oder Kork.",
    dosierung:
      "Wischen ab 50 ml auf 10 l Wasser, Scheuersaugmaschine 100 bis 200 ml auf 10 l, Sprühmethode 100 ml auf 500 ml.",
    technik: { inhalt: "1 l", ph: "9 (Konzentrat), 8 (Anwendungslösung)", gisbau: "GU 80" },
  },
  "DI-7512833": {
    aufmacher:
      "Täglicher Sanitärunterhalt ohne Nebengeräusche. Chrom und Edelstahl bleiben, der Kalk geht.",
    anwendung:
      "Saurer Sanitärunterhaltsreiniger für säurefeste Oberflächen inklusive Chrom und Edelstahl. Nicht auf Marmor, Terrazzo oder Travertin.",
    dosierung: "Sprühflasche 40 ml auf 500 ml Wasser, Eimer 50 ml auf 10 l.",
    zertifikate:
      "A.I.S.E.-konform, zugelassen für die Flugzeuginnenreinigung (AMS 1550B).",
    technik: { inhalt: "1 l", ph: "2,58 (Konzentrat), 4 (8-%-Lösung)", gisbau: "GS 10" },
  },
  "DI-100892014": {
    aufmacher:
      "Entkalkt die Geräte, die den Laden am Laufen halten. Pflanzenbasiert, damit das Gewissen mitspielt.",
    anwendung:
      "Entkalker für Küchengeräte: Bain-Marie, Heißwassergeräte, Steamer, Tee- und Kaffeebehälter. Vorsicht bei Kupfer, Messing und Aluminium.",
    dosierung:
      "Sprühmethode 50 bis 200 ml auf 750 ml, Tauchreinigung 30 bis 50 ml pro Liter, mindestens 5 Minuten einwirken.",
    zertifikate:
      "100 % biologisch abbaubar (OECD 301B), pflanzenbasiert, frei von Duft- und Farbstoffen.",
    technik: { inhalt: "1 l", ph: "2 (Konzentrat)" },
  },
  "DB-1128000": {
    aufmacher:
      "Ein Liter, rund 9.750 Teller. Wer nachrechnet, bestellt nichts anderes mehr.",
    anwendung:
      "Parfümfreies Handspülmittel für Spülküchen in lebensmittelverarbeitenden Betrieben.",
    dosierung:
      "Leichte Verschmutzung 0,4 ml pro Liter, starke Verschmutzung 2 ml pro Liter. Ergiebigkeit ca. 9.750 Teller pro Liter nach IKW-Testmethode.",
    zertifikate:
      "Konform mit LMHV und VO (EG) 852/2004, HACCP-geeignet durch wasserlösliche Farbe.",
    technik: { inhalt: "1 l", ph: "7,7 (Konzentrat)" },
  },
  "DB-1542000-750": {
    aufmacher:
      "Gel bleibt, wo es gebraucht wird, statt einfach durchzulaufen. Kalk und Rost haben fünf Minuten.",
    anwendung:
      "Reinigen und Entkalken in einem Arbeitsgang: Toiletten, Urinale, Bidets. Löst Kalk, Rost und Seifenreste.",
    dosierung:
      "Pur ins Becken, 5 Minuten einwirken, bei hartnäckigen Ablagerungen bis 1 Stunde. Metallische Becken maximal 1 Minute.",
    gutZuWissen:
      "Stark sauer, enthält Salzsäure. Nicht mit chlorhaltigen Produkten mischen.",
    technik: { inhalt: "750 ml", ph: "1,4 (1-%-Lösung)" },
  },
  "AC-01008": {
    aufmacher:
      "Der Unterschied zwischen einem Fleck und einem Problem ist, wie schnell der hier im Einsatz war.",
    anwendung:
      "Teppich- und Polsterreiniger für farb- und wasserbeständige textile Beläge in Hotels, Schulen, Kinos und Objekten. Für Fleckentfernung, Sprühextraktion und Bonnet-Verfahren.",
    dosierung:
      "Vorreinigung und Fleck 1:12 mit kaltem Wasser, Sprühextraktion 80 bis 100 ml auf 10 l.",
    gutZuWissen:
      "Farbechtheit vor der ersten Anwendung an verdeckter Stelle prüfen.",
    technik: { inhalt: "1 l", ph: "6,5–7,5 (Konzentrat)" },
  },
  // ---- Batch 2: Papier (Texte von Rami, Fachdaten aus den Hersteller-
  // Datenblaettern; bei Abweichung gilt der Hersteller) ----------------------
  "401977": {
    aufmacher:
      "2.000 Blatt pro Packung. Rechnen Sie den Blattpreis aus, dann reden wir weiter.",
    anwendung:
      "Standard-Toilettenpapier für Spender mit Hülse, Objektbereich und Büro.",
    technik: {
      inhalt: "8 Rollen = 2.000 Blatt / 224 m",
      weitere: [
        ["Lagen", "3-lagig"],
        ["Material", "Zellstoff"],
        ["Blatt je Rolle", "250"],
        ["Länge je Rolle", "28 m"],
        ["Rollendurchm.", "11 cm"],
        ["Hülse", "4,2 cm"],
        ["Prägung", "Lily"],
        ["Spender", "Papernet 417812, 403616"],
      ],
    },
  },
  "404578": {
    aufmacher:
      "Vier Lagen sind kein Luxus. Sie sind die Entscheidung, dass am stillen Ort nicht gespart wird.",
    anwendung:
      "Komfort-Toilettenpapier für Bereiche mit Anspruch: Kanzlei, Empfang, Chefetage.",
    technik: {
      inhalt: "8 Rollen = 1.200 Blatt / 150 m",
      weitere: [
        ["Lagen", "4-lagig"],
        ["Farbe", "hochweiß"],
        ["Blatt je Rolle", "150"],
        ["Länge je Rolle", "18,75 m"],
        ["Rollendurchm.", "11 cm"],
        ["Prägung", "Lily"],
      ],
    },
  },
  "110255": {
    aufmacher:
      "120 Meter pro Rolle. Nachfüllen wird vom Tagesgeschäft zum Quartalstermin.",
    anwendung:
      "Großrollen für Tork-T2-Spendersysteme in stark frequentierten Sanitärbereichen.",
    zertifikate:
      "EU Ecolabel, FSC-zertifiziert, Werk nach ISO 9001 und ISO 14001.",
    technik: {
      inhalt: "12 Rollen = 1.440 m",
      weitere: [
        ["Lagen", "3-lagig"],
        ["Blatt je Rolle", "600"],
        ["Länge je Rolle", "120 m"],
        ["Breite", "9,7 cm"],
        ["Spender", "Tork T2-Serie (u. a. 555000, 555500)"],
      ],
    },
  },
  "CWS-1700332": {
    aufmacher:
      "3.600 Meter in einem Karton. Das Nachbestell-Thema ist damit für lange erledigt.",
    anwendung:
      "Großrollen für CWS-Spendersysteme, Recyclingqualität für den Objektbereich.",
    technik: {
      inhalt: "36 Rollen = 3.600 m",
      weitere: [
        ["Lagen", "2-lagig"],
        ["Material", "Recycling"],
        ["Länge je Rolle", "100 m"],
      ],
    },
  },
  "CU-3380CN": {
    aufmacher: "Eine Rolle, 380 Meter. Manche Probleme löst man mit Größe.",
    anwendung:
      "Maxi-Jumbo-Rollen für Großrollenspender in stark genutzten Sanitärräumen.",
    technik: {
      inhalt: "6 Rollen = 2.280 m",
      weitere: [
        ["Lagen", "2-lagig"],
        ["Länge je Rolle", "380 m"],
      ],
    },
  },
  "402292": {
    aufmacher:
      "Ein Blatt, trockene Hände, weiter. Mehr muss ein Handtuchspender nicht können.",
    anwendung:
      "Einzelblatt-Entnahme für gängige V-Falz-Spender in Sanitär- und Waschräumen.",
    technik: {
      inhalt: "15 Packungen à 210 Blatt = 3.150 Blatt",
      weitere: [
        ["Lagen", "2-lagig"],
        ["Material", "Zellstoff"],
        ["Farbe", "hochweiß"],
        ["Blattmaß", "21 x 24 cm"],
        ["gefaltet", "24 x 10,5 cm"],
        ["Prägung", "Wave"],
        ["Spender", "Papernet 416143, 417204"],
      ],
    },
  },
  "416602": {
    aufmacher:
      "W-Falz heißt: das nächste Blatt steht schon bereit. Kein Zupfen, kein Stau.",
    anwendung:
      "Interfold-Falthandtücher für W-Falz-Spender, volle Entnahme mit einer Hand.",
    technik: {
      inhalt: "20 Packungen à 150 Blatt = 3.000 Blatt",
      weitere: [
        ["Lagen", "2-lagig"],
        ["Farbe", "weiß"],
      ],
    },
  },
  "416596": {
    aufmacher:
      "Steht in jeder Teeküche, fehlt immer genau dann, wenn was passiert. Deshalb im Vorrat.",
    anwendung:
      "Küchenrolle für Teeküche, Pausenraum und schnelle Zwischenreinigung.",
    technik: {
      inhalt: "4 Rollen = 44 m",
      weitere: [
        ["Lagen", "3-lagig"],
        ["Material", "Zellstoff"],
        ["Blatt je Rolle", "51"],
        ["Länge je Rolle", "11 m"],
        ["Rollendurchm.", "10,5 cm"],
      ],
    },
  },
};

/**
 * Sicherheitsdatenblätter, die als Herstelleroriginal in
 * buttje-shop/datenblaetter/sdb/ liegen (Herkunft geprüft 2026-08-01:
 * keine Altruan-Spuren in Text oder Metadaten).
 *
 * VERÖFFENTLICHT seit 2026-08-01 (Freigabe Rami nach sauberer
 * Herkunftsprüfung). Die Dateien liegen als Kopie unter
 * public/datenblaetter/<SKU>.pdf und sind damit öffentlich abrufbar;
 * die Originale bleiben zusätzlich in buttje-shop/datenblaetter/sdb/.
 *
 * Zurückdrehen: SDB_DOWNLOADS_AKTIV auf false setzen UND die Kopien aus
 * public/datenblaetter/ entfernen — der Schalter allein blendet nur den
 * Block aus, die URLs blieben sonst erreichbar.
 *
 * Neues SDB aufnehmen: PDF unter dem SKU-Namen in beide Ordner legen und
 * die SKU unten ergänzen. Vorher Herkunft prüfen (Herstelleroriginal,
 * keine Händlerspuren in Text oder Metadaten).
 */
export const SDB_DOWNLOADS_AKTIV = true;

export const SDB_VERFUEGBAR = new Set([
  "AC-01008", "BU-G440-0001RA", "BU-G502-0200VL", "BU-S780-0001RA",
  "BU-T464-0001RA", "DB-1128000", "DB-1542000-750", "DI-100892014",
  "DI-7513138", "DS-00104-1000",
]);

export function inhaltFuer(sku: string): Produktinhalt | null {
  return PRODUKTINHALTE[sku] ?? null;
}
