/*
  Kopfbilder der Kategorieseiten vermessen.

    node scripts/kopfbild-messen.mjs 3131

  Legt in /tmp/kopfbild je Kategorie und Breite zwei Abzuege ab - einen
  mit Label zur Beurteilung, einen OHNE Label als Messgrundlage - und
  dazu messung.json. Ausgewertet wird das von
  scripts/ki-label-kontrast.py (dieselbe Rechnung wie auf der
  Startseite, nur ein anderer Ordner).

  Mitgemessen wird die ZEILENZAHL DER HEADLINE, einmal im neuen Raster
  und einmal im alten. Die Bildspalte ist von minmax(280px,360px) auf
  minmax(320px,480px) gewachsen, die Textspalte also schmaler geworden;
  wo eine Headline dadurch eine Zeile mehr braucht, muss das gemeldet
  werden. Gezaehlt wird ueber die Zeilenkaesten eines Range, nicht ueber
  Hoehe durch Zeilenhoehe - das bleibt richtig, auch wenn jemand spaeter
  an der Schriftgroesse dreht.
*/
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const port = process.argv[2] || "3131";
const ziel = "/tmp/kopfbild";
const SLUGS = ["entsorgung", "papier", "chemie", "seifen", "handschuhe", "zubehoer"];
const BREITEN = [1440, 1280, 1024, 768, 390];
const ALTES_RASTER = "1fr minmax(280px, 360px)";
const SKALA = 2;

mkdirSync(ziel, { recursive: true });
const browser = await chromium.launch();
const daten = [];

for (const breite of BREITEN) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: 1000 },
    deviceScaleFactor: SKALA,
  });
  const page = await ctx.newPage();
  const stellen = [];
  let scrollt = null, scrollWidth = null;

  for (const slug of SLUGS) {
    await page.goto(`http://127.0.0.1:${port}/kategorie/${slug}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      window.scrollTo(0, 400); window.scrollTo(0, 0);
      await Promise.all([...document.images].filter((i) => !i.complete).map(
        (i) => new Promise((r) => { i.onload = i.onerror = r; })));
    });
    await page.waitForTimeout(250);

    const info = await page.evaluate((altesRaster) => {
      const zeilen = (h1) => {
        const r = document.createRange();
        r.selectNodeContents(h1);
        return [...r.getClientRects()].filter((k) => k.height > 1).length;
      };
      const h1 = document.querySelector("h1");
      const neu = zeilen(h1);
      // Altes Raster nur zum Messen setzen, sofort wieder zuruecknehmen.
      const raster = h1.closest("div").parentElement;
      const vorher = raster.style.gridTemplateColumns;
      const breit = getComputedStyle(raster).gridTemplateColumns.split(" ").length > 1;
      let alt = neu;
      if (breit) {
        raster.style.gridTemplateColumns = altesRaster;
        alt = zeilen(h1);
        raster.style.gridTemplateColumns = vorher;
      }
      const img = document.querySelector('img[src^="/kategorie/"]');
      const kasten = img.parentElement;
      const k = kasten.getBoundingClientRect();
      return {
        zeilenNeu: neu, zeilenAlt: alt, zweispaltig: breit,
        kastenB: Math.round(k.width), kastenH: Math.round(k.height * 10) / 10,
        geladen: img.currentSrc.split("/").pop(),
        alt: img.getAttribute("alt"),
        ariaHidden: img.hasAttribute("aria-hidden"),
      };
    }, ALTES_RASTER);

    const label = page.locator('span:text-is("KI-generiert")').first();
    const kasten = await label.boundingBox();
    const lage = await label.evaluate((n, w) => {
      const img = n.parentElement.querySelector("img");
      const r = n.getBoundingClientRect(), b = img.getBoundingClientRect();
      const s = { links: Math.max(b.left, 0), oben: Math.max(b.top, 0),
                  rechts: Math.min(b.right, w), unten: b.bottom };
      return {
        sichtbar: r.left >= s.links - 0.5 && r.right <= s.rechts + 0.5
          && r.top >= s.oben - 0.5 && r.bottom <= s.unten + 0.5,
        abstandRechts: Math.round((s.rechts - r.right) * 10) / 10,
        abstandUnten: Math.round((s.unten - r.bottom) * 10) / 10,
        schrift: getComputedStyle(n).fontSize,
        kasten: getComputedStyle(n).backgroundColor,
        farbe: getComputedStyle(n).color,
      };
    }, breite);

    const mass = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    scrollWidth = mass.scrollWidth;
    scrollt = mass.scrollWidth > mass.innerWidth + 1;

    await page.screenshot({ path: `${ziel}/mit-${slug}-${breite}.png` });
    await page.evaluate(() => {
      document.querySelectorAll("span").forEach((n) => {
        if (n.textContent === "KI-generiert") n.style.visibility = "hidden";
      });
    });
    await page.screenshot({ path: `${ziel}/ohne-${slug}-${breite}.png` });

    stellen.push({ name: slug, ...info, ...lage, abzug: `ohne-${slug}-${breite}.png`,
                   x: kasten.x, y: kasten.y, b: kasten.width, h: kasten.height });
    console.log(`${breite} ${slug.padEnd(11)} Kasten ${info.kastenB}x${info.kastenH} `
      + `Datei ${info.geladen.padEnd(26)} Zeilen alt ${info.zeilenAlt} neu ${info.zeilenNeu}`
      + `${info.zeilenNeu > info.zeilenAlt ? "  <-- eine Zeile mehr" : ""}`);
  }
  daten.push({ breite, skala: SKALA, stellen, scrollWidth, scrollt });
  await ctx.close();
}

writeFileSync(`${ziel}/messung.json`, JSON.stringify(daten, null, 1));
await browser.close();
