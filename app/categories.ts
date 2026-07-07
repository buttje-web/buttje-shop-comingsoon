// Die 6 Shop-Kategorien. Produkte werden per Kategorie-Tag gefiltert.
// headline / intro sind Platzhalter bis zu den finalen Texten (Teil 4).

export type Category = {
  slug: string; // URL-Segment
  tag: string; // Shopify-Kategorie-Tag
  label: string; // Anzeigename (Navigation)
  headline: string; // Kategorie-Headline (Teil 4)
  intro: string; // Intro-Text (Teil 4)
  // Optionales Header-Video (autoplay/muted/loop). Ohne Video: Platzhalter.
  video?: { src: string; poster: string };
};

export const CATEGORIES: Category[] = [
  {
    slug: "entsorgung",
    tag: "entsorgung",
    label: "Entsorgung",
    headline: "Müllsäcke, die mehr aushalten als dein Team am Montagmorgen.",
    intro:
      "Von dünn und billig bis Bauschutt-erprobt. Jede Stärke, jede Größe, immer ehrlich beschriftet. Der Dreck sucht sich nicht aus, wann er kommt. Der richtige Sack schon.",
    // Hochformat-Fassung: ganzer Film bis zur letzten Szene (Endgrafik weg),
    // mit eingebrannten Untertiteln und Tonspur (Ton-Knopf im Player).
    video: { src: "/video/entsorgung-portrait.mp4", poster: "/video/poster-portrait.jpg" },
  },
  {
    slug: "papier",
    tag: "papier",
    label: "Papier",
    headline: "Von grau und gnadenlos günstig bis vierlagig hochweiß.",
    intro:
      "Toilettenpapier, Handtuchpapier, Küchenrollen. Für jedes Objekt die richtige Lage, für jedes Budget die richtige Rolle. Papier ist nicht glamourös. Fehlt es, ist es das einzige Thema.",
  },
  {
    slug: "chemie",
    tag: "chemie",
    label: "Chemie",
    headline: "Kein Wundermittel. Keine Zaubersprüche. Nur Zeug, das funktioniert.",
    intro:
      "Dr. Schnell, Buzil, TASKI, Diversey. Die Marken, mit denen Profis seit Jahrzehnten putzen. Wir haben sie alle, zum Nettopreis, ohne Gedöns.",
  },
  {
    slug: "seifen",
    tag: "seife",
    label: "Seifen",
    headline: "Saubere Hände, saubere Sache.",
    intro:
      "Vom Fünf-Liter-Kanister bis zur Pumpflasche. Wäscht wie ein Weltmeister, riecht nach Feierabend. Für Hände, die den ganzen Tag arbeiten.",
  },
  {
    slug: "handschuhe",
    tag: "handschuhe",
    label: "Handschuhe",
    headline: "Damit deine Hände nach Feierabend noch aussehen wie Hände.",
    intro:
      "Nitril, Latex, Vinyl, Arbeitsschutz. In echten Größen, in ehrlicher Qualität. Einweg oder unkaputtbar, du entscheidest.",
  },
  {
    slug: "zubehoer",
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
