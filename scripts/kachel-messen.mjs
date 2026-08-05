/*
  Die Kategoriekacheln der Startseite vermessen.

    node scripts/kachel-messen.mjs 3181 stufe2

  Legt in /tmp/kachel je Breite zwei Abzuege ab - einen mit Label zur
  Beurteilung, einen OHNE Label als Messgrundlage - und dazu
  messung.json fuer scripts/ki-label-kontrast.py.

  Gemessen wird, was bei einer Kachel entscheidet:
    Kachelbreite und -hoehe, Bildbreite, Hoehe einer ganzen Reihe,
    Zeilenzahl von Titel und Spruch, Gleichheit der sechs Hoehen,
    Seitenverhaeltnis des Bildkastens (Beschnittprobe) und
    waagrechtes Scrollen.

  Die Zeilen zaehlt ein Range ueber die Textknoten, nicht Hoehe durch
  Zeilenhoehe - das bleibt richtig, auch wenn jemand an der
  Schriftgroesse dreht.
*/
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const port = process.argv[2] || "3181";
const stufe = process.argv[3] || "stufe";
const ziel = "/tmp/kachel";
const BREITEN = [1440, 1280, 1024, 768, 390];
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
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].filter((i) => !i.complete).map(
      (i) => new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(400);

  const mass = await page.evaluate(() => {
    const zeilen = (n) => {
      const r = document.createRange();
      r.selectNodeContents(n);
      return [...r.getClientRects()].filter((k) => k.height > 1).length;
    };
    const kacheln = [...document.querySelectorAll('a[href^="/kategorie/"]')]
      .filter((a) => a.querySelector("img"));
    const w = kacheln.map((a) => {
      const k = a.getBoundingClientRect();
      const bild = a.querySelector("img").getBoundingClientRect();
      const spans = [...a.querySelectorAll("span")].filter((s) => s.textContent !== "KI-generiert");
      return {
        titel: spans[0].textContent,
        kachelB: Math.round(k.width * 10) / 10,
        kachelH: Math.round(k.height * 10) / 10,
        oben: Math.round(k.top + window.scrollY),
        bildB: Math.round(bild.width * 10) / 10,
        bildH: Math.round(bild.height * 10) / 10,
        bildVerhaeltnis: Math.round((bild.width / bild.height) * 1000) / 1000,
        zeilenTitel: zeilen(spans[0]),
        zeilenSpruch: zeilen(spans[1]),
        titelPx: getComputedStyle(spans[0]).fontSize,
        spruchPx: getComputedStyle(spans[1]).fontSize,
        ansehenPx: getComputedStyle(spans[2]).fontSize,
      };
    });
    // Hoehe einer ganzen Reihe: von der Oberkante der ersten Kachel bis
    // zur Unterkante der letzten in derselben Reihe, inklusive Abstand.
    const reihen = {};
    w.forEach((k) => { (reihen[k.oben] ||= []).push(k); });
    const reihenHoehen = Object.values(reihen).map((r) =>
      Math.max(...r.map((k) => k.kachelH)));
    return {
      kacheln: w,
      spalten: Object.values(reihen)[0].length,
      reihenHoehen,
      gleicheHoehe: new Set(w.map((k) => Math.round(k.kachelH))).size === 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });

  const stellen = [];
  const labels = page.locator('span:text-is("KI-generiert")');
  const anzahl = await labels.count();
  for (let i = 0; i < anzahl; i++) {
    const el = labels.nth(i);
    const k = await el.boundingBox();
    const info = await el.evaluate((n, w) => {
      const img = n.parentElement.querySelector("img, video");
      const r = n.getBoundingClientRect(), b = img.getBoundingClientRect();
      const s = { links: Math.max(b.left, 0), oben: Math.max(b.top, 0),
                  rechts: Math.min(b.right, w), unten: b.bottom };
      return {
        name: ((img.getAttribute("src") || img.getAttribute("poster") || "")
          .match(/([^/]+?)(-\d+)?\.(webp|png|jpg)$/) || [])[1],
        sichtbar: r.left >= s.links - 0.5 && r.right <= s.rechts + 0.5
          && r.top >= s.oben - 0.5 && r.bottom <= s.unten + 0.5,
        abstandRechts: Math.round((s.rechts - r.right) * 10) / 10,
        abstandUnten: Math.round((s.unten - r.bottom) * 10) / 10,
        schrift: getComputedStyle(n).fontSize,
        kasten: getComputedStyle(n).backgroundColor,
        farbe: getComputedStyle(n).color,
      };
    }, breite);
    stellen.push({ ...info, x: k.x, y: k.y + await page.evaluate(() => window.scrollY),
                   b: k.width, h: k.height });
  }

  await page.screenshot({ path: `${ziel}/${stufe}-mit-${breite}.png`, fullPage: true });
  await page.evaluate(() => {
    document.querySelectorAll("span").forEach((n) => {
      if (n.textContent === "KI-generiert") n.style.visibility = "hidden";
    });
  });
  await page.screenshot({ path: `${ziel}/${stufe}-ohne-${breite}.png`, fullPage: true });

  daten.push({ breite, skala: SKALA, abzug: `${stufe}-ohne-${breite}.png`, stellen,
               scrollWidth: mass.scrollWidth,
               scrollt: mass.scrollWidth > mass.innerWidth + 1, ...mass });
  const k = mass.kacheln[0];
  console.log(`${breite}  Kachel ${k.kachelB}x${k.kachelH}  Bild ${k.bildB}x${k.bildH} `
    + `(${k.bildVerhaeltnis})  Reihe ${mass.reihenHoehen[0]}  ${mass.spalten}-spaltig  `
    + `Titel ${k.titelPx}/${k.spruchPx}/${k.ansehenPx}  `
    + `gleich hoch: ${mass.gleicheHoehe ? "ja" : "NEIN"}  `
    + `Umbruch Titel/Spruch: ${mass.kacheln.map((x) => x.zeilenTitel).join("")}`
    + `/${mass.kacheln.map((x) => x.zeilenSpruch).join("")}`);
  await ctx.close();
}

writeFileSync(`${ziel}/messung.json`, JSON.stringify(daten, null, 1));
await browser.close();
