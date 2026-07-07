// Client-seitige Produktsuche: Normalisierung, Tippfehler-Toleranz, Ranking.
// Läuft komplett im Browser — Suchbegriffe verlassen den Client nicht.
// (Kein "server-only": wird von Client-Komponenten importiert.)

export type SuchEintrag = {
  handle: string;
  titel: string;
  sku: string | null;
  vendor: string | null;
  ve: string | null;
  teaser: string | null;
  tags: string[];
  beschreibung: string;
  bild: string | null;
  bildAlt: string | null;
};

/** Kleinschreibung, Umlaute/ss vereinheitlicht, Sonderzeichen zu Leerzeichen.
 *  "Müllbeutel", "Muellbeutel" und "MÜLLBEUTEL" landen alle bei "mullbeutel". */
export function normalisiere(s: string): string {
  return s
    .toLowerCase()
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    .replaceAll("ß", "s")
    .replaceAll("ae", "a")
    .replaceAll("oe", "o")
    .replaceAll("ue", "u")
    .replaceAll("ss", "s")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Levenshtein mit Abbruch oberhalb von `max` (Rueckgabe max+1). */
function editDistanz(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let zeilenMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      zeilenMin = Math.min(zeilenMin, cur[j]);
    }
    if (zeilenMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Erlaubte Tippfehler je Wortlaenge (kurze Worte muessen exakt sitzen). */
function toleranz(len: number): number {
  if (len >= 9) return 2;
  if (len >= 5) return 1;
  return 0;
}

type Vorbereitet = {
  eintrag: SuchEintrag;
  skuNorm: string;
  titelNorm: string;
  titelTokens: string[];
  nebenfelder: string; // vendor + tags + ve (normalisiert)
  beschreibungNorm: string;
};

export function bereiteVor(index: SuchEintrag[]): Vorbereitet[] {
  return index.map((e) => {
    const titelNorm = normalisiere(e.titel);
    return {
      eintrag: e,
      skuNorm: e.sku ? normalisiere(e.sku).replace(/\s+/g, "") : "",
      titelNorm,
      titelTokens: titelNorm.split(" "),
      nebenfelder: normalisiere([e.vendor ?? "", ...e.tags, e.ve ?? ""].join(" ")),
      beschreibungNorm: normalisiere(e.beschreibung),
    };
  });
}

/** Suche mit Ranking: exakte SKU > Titel > Marke/Kategorie/VE > Beschreibung > Fuzzy.
 *  Alle Suchworte muessen treffen (UND-Logik), Fuzzy zaehlt als Treffer. */
export function suche(vorbereitet: Vorbereitet[], roh: string): SuchEintrag[] {
  const q = normalisiere(roh);
  if (!q) return [];
  const qKompakt = q.replace(/\s+/g, "");
  const tokens = q.split(" ");

  const bewertet: { e: SuchEintrag; score: number }[] = [];
  for (const p of vorbereitet) {
    let score = 0;
    // Einkaeufer-Pfad: exakte Artikelnummer schlaegt alles.
    if (p.skuNorm && p.skuNorm === qKompakt) score += 10000;

    let alleTreffen = true;
    for (const t of tokens) {
      let best = 0;
      if (p.skuNorm && p.skuNorm.includes(t)) best = Math.max(best, 400);
      for (const tt of p.titelTokens) {
        if (tt === t) best = Math.max(best, 350);
        else if (tt.startsWith(t)) best = Math.max(best, 300);
      }
      if (best < 300 && p.titelNorm.includes(t)) best = Math.max(best, 250);
      if (p.nebenfelder.includes(t)) best = Math.max(best, 150);
      if (p.beschreibungNorm.includes(t)) best = Math.max(best, 60);
      if (best === 0) {
        // Tippfehler-Toleranz gegen Titelworte, dann Nebenfelder
        const max = toleranz(t.length);
        if (max > 0) {
          for (const tt of p.titelTokens) {
            if (editDistanz(t, tt, max) <= max) { best = Math.max(best, 180); break; }
          }
          if (best === 0) {
            for (const nt of p.nebenfelder.split(" ")) {
              if (nt && editDistanz(t, nt, max) <= max) { best = Math.max(best, 40); break; }
            }
          }
        }
      }
      if (best === 0) { alleTreffen = false; break; }
      score += best;
    }
    if (alleTreffen) bewertet.push({ e: p.eintrag, score });
  }

  bewertet.sort((a, b) => b.score - a.score || a.e.titel.localeCompare(b.e.titel, "de"));
  return bewertet.map((b) => b.e);
}
