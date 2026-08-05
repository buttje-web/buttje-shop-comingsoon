#!/usr/bin/env python3
"""
Kartonaufdruck fuer das Hero-Motiv.

Setzt "shop.buttje.at" + "VERSAND MIT DISKRETION" perspektivisch auf die
Kartonflaechen des Buehnenbildes. Arbeitet immer auf einer Kopie — die
Quelldatei wird nie ueberschrieben.

  python3 scripts/hero-kartonaufdruck.py

Ergebnis: public/hero/hero-mit-aufdruck.png

Vorgehen je Flaeche:
  1. Text flach in ein Rechteck rendern (Inter, dieselbe Schrift wie im Shop)
  2. Deckung ungleichmaessig machen (Schablonen-/Stempeloptik)
  3. Rechteck perspektivisch auf das Flaechen-Viereck legen
  4. Multiplikativ auftragen und an die Beleuchtung der Flaeche koppeln

Die Flaechen-Vierecke sind auf hero-rohbild-v2.png (1678x937) eingemessen.
Bei einem anderen Motiv muessen sie neu bestimmt werden — dafuer reicht es,
die Eckpunkte der Kartonflaechen in Bildkoordinaten abzulesen.

Abhaengigkeiten: pillow, numpy
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WURZEL = Path(__file__).resolve().parent.parent

QUELLE = WURZEL / "public/hero/hero-rohbild-v2.png"
ZIEL = WURZEL / "public/hero/hero-mit-aufdruck.png"
# Latin-Teilmenge von Inter, aus dem Build des Shops gezogen. Damit steht auf
# dem Karton dieselbe Schrift wie in der Navigation — nicht irgendeine
# aehnlich aussehende.
SCHRIFT = WURZEL / "scripts/assets/inter-latin-subset.ttf"

ZEILE1 = "shop.buttje.at"
ZEILE2 = "VERSAND MIT DISKRETION"

# Dunkles Schwarzbraun, kein reines Schwarz. Echter Kartondruck ist nie
# schwarz — die Farbe zieht in die Pappe ein und bleibt braunstichig.
TINTE = (38, 27, 21)

# Flaechen als Viereck (oben-links, oben-rechts, unten-rechts, unten-links)
# in Bildkoordinaten.
#   deckung  — Deckkraft des Drucks. Die vordere grosse Flaeche traegt den
#              kraeftigsten Druck, die hintere den schwaechsten: dort ist
#              weniger Licht und die Flaeche liegt weiter weg.
#   y_anteil — Hoehe des Textblocks auf der Flaeche (0 = oben, 1 = unten)
#   breite1  — Zielbreite von Zeile 1 als Anteil der Flaechenbreite.
#              Auf den beiden grossen Flaechen zwei Drittel, auf der
#              kleinen hinteren bleibt es bei der Haelfte: dort wuerde ein
#              breiterer Schriftzug bis an die Kanten stossen.
FLAECHEN = [
    dict(name="unten-gross", quad=[(219, 668), (430, 646), (430, 801), (219, 846)],
         deckung=0.88, y_anteil=0.42, breite1=0.667),
    dict(name="mitte", quad=[(220, 508), (398, 506), (398, 643), (220, 657)],
         deckung=0.82, y_anteil=0.45, breite1=0.667),
    dict(name="oben-rechts", quad=[(406, 469), (542, 452), (542, 598), (406, 614)],
         deckung=0.78, y_anteil=0.42, breite1=0.50),
]


def koeffizienten(ziel_quad, quell_rect):
    """Koeffizienten fuer Image.transform(PERSPECTIVE): Ziel -> Quelle."""
    m = []
    for (zx, zy), (qx, qy) in zip(ziel_quad, quell_rect):
        m.append([zx, zy, 1, 0, 0, 0, -qx * zx, -qx * zy])
        m.append([0, 0, 0, zx, zy, 1, -qy * zx, -qy * zy])
    A = np.array(m, dtype=float)
    B = np.array(quell_rect, dtype=float).reshape(8)
    return np.linalg.solve(A.T @ A, A.T @ B)


def schrift(groesse, gewicht):
    f = ImageFont.truetype(str(SCHRIFT), groesse)
    try:
        f.set_variation_by_axes([gewicht])
    except Exception:
        pass
    return f


def gesperrt(draw, xy, text, font, sperrung, fill):
    """Zeichnet Text mit zusaetzlicher Laufweite."""
    x, y = xy
    for z in text:
        draw.text((x, y), z, font=font, fill=fill)
        x += draw.textlength(z, font=font) + sperrung


def breite_gesperrt(draw, text, font, sperrung):
    return sum(draw.textlength(z, font=font) for z in text) + sperrung * (len(text) - 1)


def textebenen(bw, bh, breite1):
    """Zeile 1 und Zeile 2 als getrennte Alpha-Ebenen in Flaechenkoordinaten.

    Getrennt, weil die beiden Zeilen unterschiedlich stark verrauscht werden:
    Zeile 2 ist die duennere und wuerde unter demselben Rauschen wegbrechen.
    """
    e1 = Image.new("L", (bw, bh), 0)
    e2 = Image.new("L", (bw, bh), 0)
    d1, d2 = ImageDraw.Draw(e1), ImageDraw.Draw(e2)

    ziel1 = bw * breite1
    g = 10
    f1 = schrift(g, 900)
    while d1.textlength(ZEILE1, font=f1) < ziel1 and g < bh:
        g += 2
        f1 = schrift(g, 900)
    b1 = d1.textlength(ZEILE1, font=f1)

    # Zeile 2: etwa ein Drittel der Hoehe von Zeile 1. Waechst Zeile 1, waechst
    # Zeile 2 im selben Verhaeltnis mit.
    g2 = max(7, int(g / 3))
    f2 = schrift(g2, 600)
    sperr2 = g2 * 0.18
    b2 = breite_gesperrt(d2, ZEILE2, f2, sperr2)

    h1 = f1.getbbox(ZEILE1)[3] - f1.getbbox(ZEILE1)[1]
    d1.text(((bw - b1) / 2, -f1.getbbox(ZEILE1)[1]), ZEILE1, font=f1, fill=255)

    y2 = h1 + g * 0.42
    gesperrt(d2, ((bw - b2) / 2, y2 - f2.getbbox(ZEILE2)[1]), ZEILE2, f2, sperr2, 255)

    hoehe = int(y2 + (f2.getbbox(ZEILE2)[3] - f2.getbbox(ZEILE2)[1]) + 2)
    return e1, e2, hoehe


def unregelmaessig(alpha, seed, grob_tiefe=0.18, fein_tiefe=0.08, weich=0.6):
    """Schablonenoptik: grobe Flecken, feines Korn, leicht ausgefranste Kanten."""
    rng = np.random.default_rng(seed)
    w, h = alpha.size

    grob = Image.fromarray((rng.random((h // 8 + 2, w // 8 + 2)) * 255).astype(np.uint8))
    grob = grob.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
    grob = np.asarray(grob, dtype=np.float32) / 255.0
    grob = (1.0 - grob_tiefe) + grob_tiefe * grob

    fein = rng.random((h, w)).astype(np.float32)
    fein = (1.0 - fein_tiefe) + fein_tiefe * fein

    a = np.asarray(alpha, dtype=np.float32) / 255.0 * grob * fein

    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    # Ganz leichte Weichzeichnung: gestempelte Kanten sind nie messerscharf.
    return out.filter(ImageFilter.GaussianBlur(weich))


def main():
    basis = Image.open(QUELLE).convert("RGB")
    W, H = basis.size
    arr = np.asarray(basis, dtype=np.float32)
    tinte = np.array(TINTE, dtype=np.float32) / 255.0

    for i, f in enumerate(FLAECHEN):
        quad = f["quad"]
        # Arbeitsaufloesung der flachen Flaeche: 3x der sichtbaren Breite,
        # damit die perspektivische Stauchung keine Treppen erzeugt.
        bw = int(max(abs(quad[1][0] - quad[0][0]), abs(quad[2][0] - quad[3][0])) * 3)
        bh = int(max(abs(quad[3][1] - quad[0][1]), abs(quad[2][1] - quad[1][1])) * 3)

        e1, e2, texthoehe = textebenen(bw, bh, f["breite1"])
        # Zeile 1 traegt das volle Rauschen. Zeile 2 bekommt weniger Rauschen
        # und weniger Weichzeichnung und steht damit eine Spur kraeftiger in
        # der Deckung — ohne mehr Farbe aufzutragen als Zeile 1.
        e1 = unregelmaessig(e1, seed=1000 + i)
        e2 = unregelmaessig(e2, seed=2000 + i, grob_tiefe=0.10, fein_tiefe=0.05, weich=0.45)

        flach = np.clip(np.asarray(e1, dtype=np.float32) + np.asarray(e2, dtype=np.float32), 0, 255)
        flach = Image.fromarray(flach.astype(np.uint8))

        # Textblock vertikal auf der Flaeche positionieren
        block = Image.new("L", (bw, bh), 0)
        block.paste(flach.crop((0, 0, bw, texthoehe)),
                    (0, int(bh * f["y_anteil"] - texthoehe / 2)))

        rect = [(0, 0), (bw, 0), (bw, bh), (0, bh)]
        maske = block.transform((W, H), Image.PERSPECTIVE,
                                koeffizienten(quad, rect), Image.BICUBIC)

        m = np.asarray(maske, dtype=np.float32) / 255.0 * f["deckung"]

        # An die Beleuchtung koppeln: helle Stellen tragen den Druck voll,
        # schattige deutlich schwaecher.
        lumi = (0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]) / 255.0
        m = m * np.clip((lumi - 0.05) / 0.30, 0.45, 1.0)

        m3 = m[..., None]
        # Multiplikativ: Druckfarbe dunkelt die Flaeche ab, die Pappstruktur
        # bleibt sichtbar. Ein deckendes Fuellen wuerde wie ein Aufkleber wirken.
        arr = arr * (1.0 - m3) + (arr * tinte[None, None, :]) * m3

    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(ZIEL)
    print("geschrieben:", ZIEL)


if __name__ == "__main__":
    main()
