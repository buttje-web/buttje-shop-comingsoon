// Die 6 Shop-Kategorien. Produkte werden per Kategorie-Tag gefiltert.
// headline / intro sind Platzhalter bis zu den finalen Texten (Teil 4).

export type Category = {
  slug: string; // URL-Segment
  tag: string; // Shopify-Kategorie-Tag
  label: string; // Anzeigename (Navigation)
  headline: string; // Kategorie-Headline (Teil 4)
  intro: string; // Intro-Text (Teil 4)
  // STILLGELEGT seit 05.08.2026: Das Kopfbild der Kategorieseite kommt jetzt
  // aus app/kategorie-bilder.ts, dasselbe Motiv wie auf der Startseite. Diese
  // Pfade zeigen auf die alten 9:16-Herstellerfotos (720x1280). Feld und
  // Dateien bleiben liegen, wie beim Feld `video` beschlossen: stilllegen,
  // nicht loeschen.
  bild?: string;
  // STILLGELEGT seit 01.08.2026: Kategorie-Videos werden nicht mehr gerendert.
  // Feld und Daten bleiben bewusst erhalten (Beschluss: stilllegen, nicht loeschen).
  //
  // ACHTUNG, die Pfade zeigen ins Leere. Seit 05.08.2026 liegen die Dateien
  // NICHT MEHR unter public/, sondern unter medien/archiv/ - siehe den
  // Hinweis am Feld video von entsorgung. Wer Kategorie-Videos reaktiviert,
  // muss sie vorher zurueckschieben.
  video?: { src: string; poster: string };
};

export const CATEGORIES: Category[] = [
  {
    slug: "entsorgung",
    bild: "/kategorie/entsorgung.webp",
    tag: "entsorgung",
    label: "Entsorgung",
    headline: "Müllsäcke, die mehr aushalten als Ihr Team am Montagmorgen.",
    intro:
      "Von dünn und billig bis Bauschutt-erprobt. Jede Stärke, jede Größe, immer ehrlich beschriftet. Der Dreck fragt nicht. Der richtige Sack antwortet trotzdem.",
    // Hochformat-Fassung: ganzer Film bis zur letzten Szene (Endgrafik weg),
    // mit eingebrannten Untertiteln und Tonspur (Ton-Knopf im Player).
    //
    // VERSCHOBEN am 05.08.2026 nach medien/archiv/entsorgung-portrait.mp4
    // und medien/archiv/poster-portrait.jpg. Grund: die Dateien wurden seit
    // der Stilllegung in keinem HTML mehr genannt, blieben unter public/
    // aber ueber ihre Adresse abrufbar - ein fotorealistisches KI-Video ohne
    // jede Kennzeichnung. Aufgehoben statt geloescht, der Schnitt ist
    // ausserhalb entstanden und hier nicht wiederherstellbar.
    // Zum Reaktivieren die beiden Dateien nach public/video/ zurueckschieben.
    video: { src: "/video/entsorgung-portrait.mp4", poster: "/video/poster-portrait.jpg" },
  },
  {
    slug: "papier",
    bild: "/kategorie/papier.webp",
    tag: "papier",
    label: "Papier",
    headline: "Von grau und gnadenlos günstig bis vierlagig hochweiß.",
    intro:
      "Toilettenpapier, Handtuchpapier, Küchenrollen. Für jedes Objekt die richtige Lage, für jedes Budget die richtige Rolle. Papier ist nicht glamourös. Fehlt es, ist es das einzige Thema.",
  },
  {
    slug: "chemie",
    bild: "/kategorie/chemie.webp",
    tag: "chemie",
    label: "Chemie",
    headline: "Kein Wundermittel. Keine Zaubersprüche. Nur Zeug, das funktioniert.",
    intro:
      "Dr. Schnell, Buzil, TASKI, Diversey. Die Marken, mit denen Profis seit Jahrzehnten putzen. Wir haben sie alle, zum Nettopreis, ohne Gedöns.",
  },
  {
    slug: "seifen",
    bild: "/kategorie/seifen.webp",
    tag: "seife",
    label: "Seifen",
    headline: "Saubere Hände, saubere Sache.",
    intro:
      "Vom Fünf-Liter-Kanister bis zur Pumpflasche. Wäscht wie ein Weltmeister, riecht nach Feierabend. Für Hände, die den ganzen Tag arbeiten.",
  },
  {
    slug: "handschuhe",
    bild: "/kategorie/handschuhe.webp",
    tag: "handschuhe",
    label: "Handschuhe",
    headline: "Damit Ihre Hände nach Feierabend noch aussehen wie Hände.",
    intro:
      "Nitril, Latex, Vinyl, Arbeitsschutz. In echten Größen, in ehrlicher Qualität. Einweg oder unkaputtbar. Sie entscheiden.",
  },
  {
    slug: "zubehoer",
    bild: "/kategorie/zubehoer.webp",
    tag: "zubehoer",
    label: "Zubehör",
    headline: "Unglamourös. Unverzichtbar. Unschlagbar praktisch.",
    intro:
      "Tücher, Pads, Rollen, Abzieher. Das Werkzeug hinter jedem sauberen Objekt. Keiner redet drüber, jeder braucht es.",
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
