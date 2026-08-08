/*
  Die Filmsektion der Startseite vermessen.

    node scripts/film-messen.mjs 3251 vorher

  Legt in /tmp/film-sektion je Breite einen Abzug der Sektion ab und
  meldet Spaltenbreiten, Gesamthoehe, Zeilenzahl von Ueberschrift und
  Absaetzen sowie waagrechtes Scrollen. Zwei Laeufe, einmal vor und
  einmal nach dem Umbau, ergeben den Vergleich.

  Die Zeilen zaehlt ein Range ueber die Textknoten, nicht Hoehe durch
  Zeilenhoehe - das bleibt richtig, auch wenn jemand an der
  Schriftgroesse dreht.
*/
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const port = process.argv[2] || "3251";
const tag = process.argv[3] || "stand";
const ziel = "/tmp/film-sektion";
const BREITEN = [1440, 1280, 1024, 768, 390];

mkdirSync(ziel, { recursive: true });
const browser = await chromium.launch();
const daten = [];

for (const breite of BREITEN) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: 1000 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);

  const m = await page.evaluate(() => {
    const zeilen = (n) => {
      const r = document.createRange(); r.selectNodeContents(n);
      return [...r.getClientRects()].filter((k) => k.height > 1).length;
    };
    const video = document.querySelector("video");
    // Die Filmsektion ist die <section>, in der das <video> steht.
    const sektion = video.closest("section");
    const s = sektion.getBoundingClientRect();
    const h2 = sektion.querySelector("h2");
    const p = [...sektion.querySelectorAll("p")];
    // Textspalte und Videospalte: die beiden Kinder des Rasters, sonst
    // die Sektion selbst.
    const raster = h2.closest("div").parentElement;
    const zweispaltig = getComputedStyle(raster).gridTemplateColumns
      .split(" ").filter(Boolean).length > 1;
    const spalten = zweispaltig
      ? [...raster.children].map((c) => Math.round(c.getBoundingClientRect().width * 10) / 10)
      : [Math.round(h2.parentElement.getBoundingClientRect().width * 10) / 10];
    const kasten = video.parentElement.parentElement.getBoundingClientRect();
    return {
      sektionHoehe: Math.round(s.height * 10) / 10,
      spalten, zweispaltig,
      video: { b: Math.round(kasten.width * 10) / 10, h: Math.round(kasten.height * 10) / 10 },
      zeilenH2: zeilen(h2),
      zeilenP: p.map((n) => zeilen(n)),
      texte: p.map((n) => n.textContent),
      oben: Math.round(s.top + window.scrollY),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });

  const sek = page.locator("section").filter({ has: page.locator("video") });
  await sek.screenshot({ path: `${ziel}/${tag}-${breite}.png` });

  daten.push({ breite, ...m });
  console.log(`${String(breite).padStart(4)}  Sektion ${String(m.sektionHoehe).padStart(6)} px  `
    + `Spalten ${m.spalten.join(" + ")}  Video ${m.video.b}x${m.video.h}  `
    + `h2 ${m.zeilenH2} Zeilen, Absaetze ${m.zeilenP.join("/")}  `
    + `Scrollen ${m.scrollWidth > m.innerWidth + 1 ? "JA" : "nein"}`);
  await ctx.close();
}

writeFileSync(`${ziel}/${tag}.json`, JSON.stringify(daten, null, 1));
await browser.close();
