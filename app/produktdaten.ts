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
  // ---- Batch 3: Entsorgung -------------------------------------------------
  // Bewusst OHNE Foliendicke bei AL-12060, 12070 und 10010: bei den beiden
  // Altruan-Saecken ist sie nur rechnerisch abgeleitet, bei 10010 nennt die
  // Herstellertabelle keinen Wert. Nur 56941 hat eine belegte Folienstaerke.
  "AL-12060": {
    aufmacher:
      "Typ 60 ist eine Tragfähigkeitsklasse, kein Schätzwert. Für den täglichen Büro- und Objektmüll die wirtschaftliche Wahl.",
    anwendung:
      "Standardabfallsack für 120-Liter-Behälter in Büro, Objekt und Gastronomie. Für trockenen bis normalen Mischmüll.",
    technik: { weitere: [["Material", "Recycling-LDPE"], ["Maße", "700 x 1100 mm"], ["Fassungsvermögen", "120 Liter"], ["Tragfähigkeit", "Typ 60"]] },
  },
  "12070": {
    aufmacher:
      "Die stärkere Klasse. Wenn der Inhalt Kanten hat oder das Gewicht keiner vorher wiegt.",
    anwendung:
      "Verstärkter Abfallsack für 120-Liter-Behälter bei schwerem oder kantigem Abfall.",
    technik: { weitere: [["Material", "Recycling-LDPE"], ["Maße", "700 x 1100 mm"], ["Fassungsvermögen", "120 Liter"], ["Tragfähigkeit", "Typ 70"]] },
  },
  "20010": {
    aufmacher:
      "DEISS aus Hamburg, seit Jahrzehnten der Name für Abfallsäcke im Objektgeschäft. Der Standard, auf den sich Profis einigen.",
    anwendung: "Abfallsack für 120-Liter-Behälter im täglichen Objekteinsatz.",
    technik: { weitere: [["Material", "Recycling-LDPE, EU-Herkunft"], ["Maße", "700 x 1100 mm"], ["Fassungsvermögen", "120 Liter"], ["Tragfähigkeit", "Typ 60"]] },
  },
  "54928": {
    aufmacher:
      "Der Beutel für den kleinen Korb unterm Schreibtisch. Unauffällig, bis er fehlt.",
    anwendung:
      "Müllbeutel für kleine Papierkörbe und Kosmetikeimer, Büro und Sanitärraum.",
    technik: { weitere: [["Material", "HDPE, 10–20 % Regenerat"], ["Maße", "310 x 370 mm"], ["Fassungsvermögen", "6 Liter"], ["Farbe", "grau"]] },
  },
  "59984": {
    aufmacher:
      "Transparent heißt kontrollierbar. In sensiblen Bereichen ist Durchsicht kein Design, sondern Vorschrift.",
    anwendung:
      "Müllbeutel für 60-Liter-Behälter, transparent für Bereiche mit Sichtkontrolle.",
    technik: { weitere: [["Material", "HDPE, 10–20 % Regenerat"], ["Maße", "600 x 720 mm"], ["Fassungsvermögen", "60 Liter"], ["Farbe", "transparent"]] },
  },
  "10010": {
    aufmacher:
      "Die oberste Klasse im Programm. Für Abfall, bei dem ein gerissener Sack keine Anekdote wäre, sondern ein Einsatz.",
    anwendung:
      "Schwerlast-Abfallsack für Bauschutt-nahen Abfall, Werkstatt und Außenbereich.",
    technik: { weitere: [["Länge", "ca. 99 cm"], ["Tragfähigkeit", "Typ 100"], ["Behälter rund", "bis Ø 44,5 cm"], ["Behälter eckig", "bis 70 cm Kantensumme"]] },
  },
  "44904": {
    aufmacher:
      "Easy-Opener heißt: der Beutel öffnet ohne Fingerspitzengefühl und Flüche. Klingt klein, spart täglich Zeit.",
    anwendung:
      "Müllbeutel für 30-Liter-Behälter, auch für feuchten Abfall geeignet.",
    technik: { weitere: [["Material", "HDPE-Spezialfolie, Easy-Opener"], ["Maße", "500 x 600 mm"], ["Fassungsvermögen", "30 Liter"], ["Farbe", "grau"]] },
  },
  "49908": {
    aufmacher:
      "Die verstärkte Ausführung in 60 Litern. Für alle, die den Beutel nur einmal anfassen wollen.",
    anwendung:
      "Müllbeutel für 60-Liter-Behälter im täglichen Einsatz, auch für feuchten Abfall.",
    technik: { weitere: [["Material", "HDPE"], ["Maße", "620 x 720 mm"], ["Fassungsvermögen", "60 Liter"], ["Farbe", "transparent"]] },
  },
  "56941": {
    aufmacher:
      "750 Stück im Karton, in Spenderboxen à 30. Ein Thema, das man genau einmal pro Quartal anfasst.",
    anwendung:
      "Hygienebeutel für Damen-Sanitärräume, Spenderboxen zum Aufstellen oder für Halterungen.",
    technik: {
      inhalt: "25 Boxen à 30 Beutel = 750 Stück",
      weitere: [["Material", "HDPE"], ["Maße", "80+70 x 230 mm"], ["Folienstärke", "11 my"]],
    },
  },

  // ---- Batch 4: Zubehör ----------------------------------------------------
  // Bei ENA Soft und dem Vileda-Schwammtuch stehen bewusst KEINE
  // Materialprozente, kein Flaechengewicht und keine Waschtemperatur:
  // diese Zahlen kursieren nur in Haendlershops, der Hersteller belegt sie nicht.
  "AC-APOL4040BL": {
    aufmacher:
      "Randlos heißt: keine Naht, die Schlieren zieht. Für Flächen, auf denen man jeden Wischer sieht.",
    anwendung:
      "Hochflor-Mikrofasertuch für Glas, Lack und Chrom, auch für Politur-Abtrag und Fahrzeugaufbereitung.",
    gutZuWissen:
      "Waschbar bei 60 °C, kein Weichspüler, kein Bleichmittel, sortenrein waschen.",
    technik: { weitere: [["Material", "85 % Polyester, 15 % Polyamid"], ["Maße", "40 x 40 cm"], ["Ausführung", "randlos, blau"], ["Gewicht je Tuch", "ca. 62 g"], ["Pflege", "60 °C, ohne Weichspüler"]] },
  },
  "DS-00883": {
    aufmacher: "Die Flasche zum System. Konzentrat ansetzen, aufsprühen, fertig.",
    anwendung:
      "Leerflasche mit Sprühkopf zum Ansetzen von Gebrauchslösungen, passend zum Dr.-Schnell-Programm (z. B. Forol).",
    technik: { inhalt: "600 ml Füllvolumen" },
  },
  "AB-1000003318": {
    aufmacher: "Das Arbeitstuch für jeden Tag. Waschen, wieder einsetzen, wiederholen.",
    anwendung:
      "Mikrofasertuch für die Unterhaltsreinigung von Oberflächen, feucht und trocken einsetzbar.",
    technik: { weitere: [["Maße", "40 x 40 cm"]] },
  },
  "DI-7515482": {
    aufmacher: "Für die Stellen, an denen das Tuch aufgibt. Angetrocknetes braucht Struktur.",
    anwendung:
      "Reinigungsschwamm mit Padseite für angetrocknete Verschmutzungen auf unempfindlichen Oberflächen.",
    gutZuWissen:
      "Padseite vor Einsatz auf kratzempfindlichen Flächen an unauffälliger Stelle testen.",
  },
  "VP-500209": {
    aufmacher: "Ein Zug von oben nach unten. Alles andere ist Nacharbeit.",
    anwendung:
      "Fensterabzieher für Glasflächen und glatte Oberflächen in der Gebäudereinigung.",
    technik: { weitere: [["Arbeitsbreite", "35 cm"]] },
  },
  "VP-133920": {
    aufmacher: "Staub gehört ins Tuch, nicht in die Luft. Trocken drüber, fertig.",
    anwendung:
      "Einweg-Staubbindetuch für die trockene Bodenreinigung auf glatten Belägen, vor dem Nasswischen.",
    technik: { weitere: [["Maße", "60 x 24 cm"]] },
  },
  "VP-142290": {
    aufmacher:
      "Das Schwammtuch, das in jeder Teeküche liegt. Hier in der Ausführung, die Profis nachkaufen.",
    anwendung:
      "Saugstarkes Schwammtuch für Küche, Theke und Oberflächen im täglichen Einsatz.",
    technik: { weitere: [["Größe", "Gr. 1"]] },
  },

  // ---- Batch 5: Seifen -----------------------------------------------------
  // CWS-C490000 traegt bewusst KEINE "neutral"-Auslobung ueber den Titel
  // hinaus — der Hersteller bestaetigt die Rezeptur fuer diese Artikelnummer
  // nicht (offener Alex-Punkt). STE-106672 behaelt die VE 20 Stueck/Karton,
  // obwohl der Hersteller 22 nennt; auch das ist ein Alex-Punkt.
  "STE-106123": {
    aufmacher:
      "Hautneutraler pH, dermatologisch bestätigt, ohne tierische Bestandteile. Der Kanister, der jeden Waschraum versorgt.",
    anwendung:
      "Handseife für nachfüllbare Druckspender in Waschräumen: Verwaltung, Schulen, Industrie, Hotel und Gastronomie, Pflege. Nur für den gewerblichen Gebrauch.",
    dosierung: "2 bis 3 ml auf angefeuchtete Hände, aufschäumen, abspülen.",
    gutZuWissen: "Vor Frost schützen, Lagerung 5 bis 30 °C.",
    zertifikate:
      "Hautverträglichkeit dermatologisch bestätigt, hautneutraler pH-Wert (4,1–5,8), ohne tierische Bestandteile, HACCP-geeignet, frei von Mikroplastik nach EU-Verordnung 2023/2055.",
    technik: { inhalt: "5 l", ph: "4,1–5,8 (hautneutral)" },
  },
  "STE-106672": {
    aufmacher: "Die Pumpflasche für Stellen ohne Spender. Hinstellen, fertig.",
    anwendung:
      "Cremeseife in der Pumpflasche für Teeküche, Gäste-WC und Einzelwaschplätze. Nur für den gewerblichen Gebrauch.",
    dosierung: "2 bis 3 ml auf angefeuchtete Hände, aufschäumen, abspülen.",
    zertifikate:
      "Hautverträglichkeit dermatologisch bestätigt, hautneutraler pH-Wert, ohne tierische Bestandteile.",
    technik: { inhalt: "500 ml", ph: "4,1–5,8 (hautneutral)" },
  },
  "CWS-C490000": {
    aufmacher: "Der Nachfüllkanister für CWS-Spendersysteme. Fünf Liter Ruhe.",
    anwendung:
      "Seifencreme zum Nachfüllen von Seifenspendern im Objektbereich.",
    technik: { inhalt: "5 l" },
  },
  "DI-101108340": {
    aufmacher:
      "Für Hände, die zwanzigmal am Tag gewaschen werden. Mild ist hier keine Geschmacksfrage, sondern Arbeitsschutz.",
    anwendung:
      "Milde Waschlotion für häufiges Händewaschen: Krankenhäuser, Küchen, lebensmittelverarbeitende Betriebe. Für die Dosierplattform W1 / Soft Care Line.",
    technik: {
      inhalt: "800 ml",
      ph: "ca. 5",
      weitere: [["Gebinde", "Kartusche"], ["Einstufung", "kosmetisches Mittel, kein Gefahrstoff"]],
    },
  },  // ---- Batch 1b: Chemie-Nachzuegler ---------------------------------------
  // Bewusst weggelassen: bei DS-00724 die Ecolabel-Lizenznummer und die
  // Rezyklat-Angabe (stehen nur auf der Produktseite, nicht im PDF), bei
  // JK-j56115a das EU Ecolabel (Zertifikat ist ein Scan ohne Textebene, nur
  // einfach belegt) und bei DI-7010209 der ganze Zertifikate-Abschnitt
  // (der Hersteller weist keine aus).
  "DS-00261": {
    aufmacher:
      "Wenn der Boden Jahre auf dem Buckel hat, hilft kein Wischen mehr. Der hier holt die Schichten runter, bis wieder Fliese da ist.",
    anwendung:
      "Grundreiniger für stark verschmutzte alkalibeständige Bodenbeläge, besonders keramische Fliesen und Feinsteinzeug, auch rau und mikroporös. Löst Fett, Öl und Eiweiß, schaumarm. Nicht auf alkaliempfindlichen Materialien.",
    dosierung:
      "Maschinelle Grundreinigung 10 % (1:9, kalt), Belag vorwässern, 500 bis 650 ml Lösung je m², ca. 5 Minuten einwirken, mit Einscheibenmaschine bearbeiten, absaugen, klar nachwaschen. Unterhaltsreinigung 0,25 bis 5 %.",
    gutZuWissen:
      "Stark alkalisch (pH 13,3), enthält Natronlauge. Augen- und Hautschutz tragen.",
    zertifikate: "RK-gelistet für keramische Beläge, HACCP-konform.",
    technik: { inhalt: "1 l", ph: "13,3 (Konzentrat)", gisbau: "GG 80" },
  },
  "DS-00724-1000": {
    aufmacher:
      "Grundreinigung für die Böden, die keine Lauge vertragen. Marmor, Linoleum, Gummi: hier räumt einer auf, ohne etwas kaputt zu machen.",
    anwendung:
      "Intensiv- und Grundreiniger für alle wasserfesten Hartböden, auch alkaliempfindliche wie Gummi, Linoleum, Marmor und Naturstein. Entfernt Wischpflegefilme und Schmutzaufbauten, auch zur Vorbereitung von Beschichtungen. Trocknet rückstandsfrei.",
    dosierung:
      "Maschinelle Intensivreinigung 10 % (1:9, kalt), 500 bis 650 ml Lösung je m², 10 bis 15 Minuten einwirken, mit Einscheibenmaschine bearbeiten, absaugen. Unterhaltsreinigung 0,25 bis 1 %.",
    zertifikate: "EU Ecolabel. Kein Gefahrstoff, frei von Butylglykol.",
    technik: { inhalt: "1 l", ph: "7,2 (Konzentrat)", gisbau: "GU 50" },
  },
  "DI-7010209": {
    aufmacher:
      "Edelstahl zeigt jeden Fingerabdruck. Der hier poliert die Front zurück in den Auslieferungszustand.",
    anwendung:
      "Gebrauchsfertige Edelstahlpflege für Flächen OHNE Lebensmittelkontakt: Kühl- und Gefrierschranktüren, Servierwagen, Geschirrspülmaschinen außen. Nur gewerblich.",
    dosierung:
      "Unverdünnt, nicht mit Wasser mischen. Sparsam auf ein sauberes trockenes Tuch sprühen und die gereinigte Fläche blank polieren.",
    gutZuWissen:
      "Nicht auf Flächen anwenden, auf denen Lebensmittel zubereitet werden. Ölbasiert.",
    technik: { inhalt: "750 ml" },
  },
  "JK-j56115a": {
    aufmacher:
      "Ein Tab, ein Spülgang, keine Diskussion. Phosphatfrei und ohne Duftstoffe, dafür mit Umweltzeichen.",
    anwendung:
      "Geschirrspültabs für Haushalts- und gewerbliche Spülmaschinen in Küche, Kantine und Lebensmittelverarbeitung. Für alkalibeständiges Spülgut aus Porzellan, Glas, Edelstahl und Kunststoff. Nicht für Aluminium und Silber; Kristallglas und handbemaltes Porzellan von Hand spülen.",
    dosierung:
      "1 Tab je Spülgang, Schutzfolie entfernen, Tab in die Dosierkammer. Salz und Klarspüler separat nach Wasserhärte.",
    gutZuWissen:
      "Enthält Enzyme (Protease, Amylase), kann allergische Reaktionen hervorrufen. Nicht über 35 °C lagern.",
    zertifikate:
      "Österreichisches Umweltzeichen (UZ 20), HACCP-einbindbar, Verkehrsfähigkeit im Lebensmittelbereich bescheinigt, halal- und kosher-konforme Inhaltsstoffe, phosphatfrei, frei von Duftstoffen.",
    technik: { inhalt: "60 Tabs", ph: "10,5 (Anwendungslösung 1 %)" },
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

/**
 * Die Zeilen der Produktdaten-Box als [Label, Wert].
 *
 * EINE Quelle fuer zwei Verbraucher: ProduktInfo rendert daraus die Box,
 * die Produktseite leitet daraus ab, welche Zeilen aus der alten
 * Herstellertabelle herausfallen. Wuerden beide getrennt gepflegt, waeren
 * Anzeige und Dubletten-Filter zwangslaeufig irgendwann auseinander.
 */
export function boxZeilen(
  sku: string,
  stamm: { hersteller?: string | null; ean?: string | null; ve?: string | null },
): [string, string][] {
  const inhalt = inhaltFuer(sku);
  if (!inhalt) return [];
  const t = inhalt.technik ?? {};
  const zeilen: [string, string | null | undefined][] = [
    ["Hersteller", stamm.hersteller],
    ["Artikelnr.", sku],
    ["EAN", stamm.ean],
    ["Einheit", stamm.ve],
    ["Inhalt", t.inhalt],
    ["pH-Wert", t.ph],
    ["GISBAU", t.gisbau],
    ...(t.weitere ?? []),
  ];
  return zeilen.filter((z): z is [string, string] => Boolean(z[1]));
}
