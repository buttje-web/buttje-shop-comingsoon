/*
  Startseite in fuenf Breiten aufnehmen und die Lage der KI-Kennzeichnung
  vermessen.

    node scripts/ki-label-messen.mjs 3121

  Erzeugt in /tmp/ki-label je Breite zwei Abzuege - einen mit Label fuer
  die Beurteilung, einen OHNE Label als Messgrundlage - und dazu
  messung.json mit Lage, Sichtbarkeit und Scrollbreite.
  Ausgewertet wird das von scripts/ki-label-kontrast.py.

  "Sichtbar" heisst hier geprueft, nicht angenommen: der Kasten muss
  vollstaendig im Fenster UND vollstaendig im Bildbereich liegen, zu dem
  er gehoert. Beim Hero ist das die zweite Bedingung, die zaehlt - dort
  haengt das Bild ab 1280 ueber die Fensterkante hinaus.
*/
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { writeFileSync } from "node:fs";

const port = process.argv[2] || "3121";
const ziel = "/tmp/ki-label";
const BREITEN = [1440, 1280, 1024, 768, 390];
const SKALA = 2;

mkdirSync(ziel, { recursive: true });
const browser = await chromium.launch();
const daten = [];

for (const breite of BREITEN) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: 900 },
    deviceScaleFactor: SKALA,
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

  // Kacheln liegen lazy. Einmal durchscrollen, sonst steht im Abzug ein
  // leerer Kasten und die Messung liefe gegen Nichts.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].filter((i) => !i.complete).map(
        (i) => new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(400);

  const labels = page.locator('span:text-is("KI-generiert")');
  const anzahl = await labels.count();
  const stellen = [];
  for (let i = 0; i < anzahl; i++) {
    const el = labels.nth(i);
    const k = await el.boundingBox();
    const info = await el.evaluate((n, w) => {
      // Bezugsflaeche: beim Hero und bei den Kacheln das <img> im selben
      // Kasten, in der Filmsektion das <video> mit seinem Standbild. Der
      // sichtbare Bildbereich ist der Schnitt aus dieser Flaeche und dem
      // Fenster - genau daran wird die Sichtbarkeit geprueft.
      const kasten = n.parentElement;
      const img = kasten.querySelector("img, video");
      const r = n.getBoundingClientRect();
      const b = img.getBoundingClientRect();
      const sicht = {
        links: Math.max(b.left, 0), oben: Math.max(b.top, 0),
        rechts: Math.min(b.right, w), unten: Math.min(b.bottom, 1e9),
      };
      return {
        name: ((img.getAttribute("src") || img.getAttribute("poster") || "")
          .match(/([^/]+?)(-\d+)?\.(webp|png|jpg)$/) || [])[1],
        sichtbar: r.left >= sicht.links - 0.5 && r.right <= sicht.rechts + 0.5
          && r.top >= sicht.oben - 0.5 && r.bottom <= sicht.unten + 0.5,
        abstandRechts: Math.round((sicht.rechts - r.right) * 10) / 10,
        abstandUnten: Math.round((sicht.unten - r.bottom) * 10) / 10,
        schrift: getComputedStyle(n).fontSize,
        // Deckung und Schriftfarbe kommen aus dem Browser, nicht aus einer
        // Annahme im Auswerteskript - der Film hat einen dichteren Kasten
        // als die Standbilder, und das darf die Rechnung nicht uebersehen.
        kasten: getComputedStyle(n).backgroundColor,
        farbe: getComputedStyle(n).color,
      };
    }, breite);
    stellen.push({ ...info, x: k.x, y: k.y + await page.evaluate(() => window.scrollY),
                   b: k.width, h: k.height });
  }

  const mass = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));

  await page.screenshot({ path: `${ziel}/mit-${breite}.png`, fullPage: true });
  await page.addStyleTag({
    content: 'span:has(> :not(*)) { }',
  });
  await page.evaluate(() => {
    document.querySelectorAll("span").forEach((n) => {
      if (n.textContent === "KI-generiert") n.style.visibility = "hidden";
    });
  });
  await page.screenshot({ path: `${ziel}/ohne-${breite}.png`, fullPage: true });

  daten.push({
    breite, skala: SKALA, abzug: `ohne-${breite}.png`, stellen,
    scrollWidth: mass.scrollWidth,
    scrollt: mass.scrollWidth > mass.innerWidth + 1,
  });
  console.log(`${breite}: ${anzahl} Label, Schrift ${stellen[0]?.schrift}, `
    + `Kasten ${stellen[0]?.b.toFixed(1)}x${stellen[0]?.h.toFixed(1)} px, `
    + `scrollWidth ${mass.scrollWidth}`);
  await ctx.close();
}

writeFileSync(`${ziel}/messung.json`, JSON.stringify(daten, null, 1));
await browser.close();
