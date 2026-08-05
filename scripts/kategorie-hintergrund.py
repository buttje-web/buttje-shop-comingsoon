#!/usr/bin/env python3
"""
Hintergruende der Kategoriebilder vereinheitlichen.

  python3 scripts/kategorie-hintergrund.py            # messen, nichts schreiben
  python3 scripts/kategorie-hintergrund.py --schreiben # <name>-final.png anlegen

Die Bilder stammen aus verschiedenen Durchgaengen und haben deshalb
verschiedene Schwarztoene, Farbstiche und Lichtverlaeufe. Nebeneinander
wirken sie dadurch nicht wie eine Serie. Dieses Skript zieht den
Hintergrund aller Bilder auf denselben Grundton und dieselbe Lichtform.

VERFAHREN: dasselbe wie beim Hero (scripts/hero-hintergrund.py), also
Uebertragung statt Freistellung. Fuer jeden Bildpunkt

    ergebnis = alpha * original + (1 - alpha) * uebertrag

alpha ist die Deckung des Vordergrunds: 1 in den Gegenstaenden, dort
bleibt das Original bitgenau. 0 im freien Feld. uebertrag legt alles,
was NICHT zum glatten Hintergrund gehoert, auf die neue Flaeche:
heller als der alte Grund additiv (Spiegelungen, Streulicht), dunkler
multiplikativ ueber die Helligkeit (Schatten). Beide Zweige treffen
sich bei "gleich hell" exakt im neuen Grundton, der Uebergang ist
stetig. Daher entstehen an Objektkanten weder helle noch dunkle Saeume:
halb gedeckte Bildpunkte werden nicht ausgeschnitten, sondern auf dem
neuen Grund neu aufgebaut.

BODEN: Der gerechnete Boden sitzt bei ALLEN Bildern auf derselben
relativen Hoehe und ist um denselben Betrag heller als die Wand.
Begruendung: Eine Messung der echten Wand-Boden-Kante wurde versucht
und verworfen. Diese Stillleben haben im freien Hintergrund keine
saubere Kante - je nach Bild springt die Schaetzung zwischen 55 und
94 Prozent der Bildhoehe, und zwar nicht, weil die Motive so
unterschiedlich waeren, sondern weil in mehreren Bildern am freien
Rand schlicht kein Licht auf dem Boden liegt. Ein je Bild anders
angesetzter Boden haette genau das zerstoert, was der Auftrag
verlangt: den gleichen Lichtaufbau ueber alle sechs.
Die sichtbare Bodenwirkung entsteht ohnehin nicht aus dieser
Aufhellung - sie betraegt 5,5 Prozent, also unter einem Tonwert -,
sondern aus Spiegelungen und Schatten der Gegenstaende. Die bleiben
ueber den Uebertrag erhalten, jeweils dort, wo sie im Original
liegen.

ZUSCHNITT: alle Bilder auf dasselbe Seitenverhaeltnis, beschnitten
statt verzerrt. Der Ausschnitt wird um die Gegenstaende gelegt, nicht
starr um die Bildmitte.

Abhaengigkeiten: pillow, numpy, scipy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

WURZEL = Path(__file__).resolve().parent.parent
ORDNER = WURZEL / "public/kategorie"
BILDER = ["papier", "zubehoer", "chemie", "handschuhe",
          "entsorgung-a", "entsorgung-b", "seifen"]

GRUNDTON = np.array([0x0E, 0x0E, 0x12], dtype=np.float32)   # --base
ABFALL_MITTE = 0.060    # Aufhellung zur Bildmitte hin
ABFALL_BODEN = 0.055    # Boden gegenueber der Wand, bei ALLEN gleich
HORIZONT = 0.62         # Wand-Boden-Kante, Anteil der Bildhoehe, bei allen gleich
UEBERGANG = 0.22        # Breite des Uebergangs, Anteil der Bildhoehe

ZIEL_VERHAELTNIS = 1.5  # 3:2
ZIEL_BREITE, ZIEL_HOEHE = 1344, 896

NAH, FERN = 60, 300     # Umkreis, in dem Streulicht uebernommen wird
GRAD = 5


def glatt(t):
    t = np.clip(np.asarray(t, dtype=np.float32), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def scheibe(r):
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return xx * xx + yy * yy <= r * r


def altes_feld(im, runden=8):
    """Robuster Polynomfit des vorhandenen Hintergrunds."""
    H, W, _ = im.shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    u = xs / (W - 1) * 2 - 1
    v = ys / (H - 1) * 2 - 1
    A = np.stack([(u ** i * v ** j).ravel()
                  for i in range(GRAD + 1) for j in range(GRAD + 1) if i + j <= GRAD], 1)
    # Startmenge: schmaler Rahmen am Bildrand. Dort steht bei diesen
    # Stillleben nie ein Gegenstand.
    rand = 0.07
    saat = ((xs < W * rand) | (xs > W * (1 - rand)) |
            (ys < H * rand) | (ys > H * (1 - rand)))
    gueltig = saat.ravel().copy()
    bg = None
    for _ in range(runden):
        bg = np.stack([(A @ np.linalg.lstsq(A[gueltig], im[..., c].ravel()[gueltig],
                                            rcond=None)[0]).reshape(H, W) for c in range(3)], -1)
        abstand = np.linalg.norm(im - bg, axis=2)
        rest = np.median(abstand[saat])
        gueltig = (abstand < max(3.0 * rest, 5.0)).ravel()
    return bg, abstand, rest


def objektmaske(sig, fehl=None):
    roh = (sig > 18) | (sig < -12)
    roh = ndi.binary_closing(roh, scheibe(5))
    roh = ndi.binary_fill_holes(roh)
    roh = ndi.binary_opening(roh, scheibe(3))
    lab, n = ndi.label(roh)
    behalten = np.zeros_like(roh)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() >= 400 and np.percentile(np.abs(sig[m]), 98) > 22:
            behalten |= m
    return ndi.binary_fill_holes(behalten)


def neues_feld(H, W):
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    dx = (xs - (W - 1) / 2) / ((W - 1) / 2)
    dy = (ys - (H - 1) / 2) / ((H - 1) / 2)
    r = np.clip(np.hypot(dx, dy) / np.sqrt(2.0), 0.0, 1.0)
    mitte = 0.5 * (1.0 + np.cos(np.pi * r))
    d = H * UEBERGANG
    boden = glatt((ys - (H * HORIZONT - d / 2)) / d)
    gewinn = 1.0 + ABFALL_MITTE * mitte + ABFALL_BODEN * boden
    return GRUNDTON[None, None, :] * gewinn[..., None]


def vereinheitlichen(im):
    H, W, _ = im.shape
    alt, abstand, rest = altes_feld(im)
    sig = im.mean(2) - alt.mean(2)
    kern = objektmaske(sig)

    # Restfeld weit weg von den Gegenstaenden herausrechnen. In ihrer Naehe
    # steckt darin das Streulicht, das erhalten bleiben soll.
    entfernung = ndi.distance_transform_edt(~kern)
    frei = (np.abs(sig) < 6) & (entfernung > NAH)
    fm = frei.astype(np.float32)
    korr = (ndi.gaussian_filter((im - alt) * fm[..., None], (70, 70, 0)) /
            np.maximum(ndi.gaussian_filter(fm, 70), 1e-4)[..., None])
    alt = alt + korr * glatt((entfernung - NAH) / (FERN - NAH))[..., None]
    sig = im.mean(2) - alt.mean(2)

    neu = neues_feld(H, W)

    a_kern = np.asarray(Image.fromarray((kern * 255).astype(np.uint8))
                        .filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255.0
    alpha = np.maximum(a_kern, glatt((np.abs(sig) - 10.0) / (45.0 - 10.0)))[..., None]

    hell_alt = np.maximum(alt.mean(2), 1e-3)
    verh = np.clip(im.mean(2) / hell_alt, 0.0, 1.0)[..., None]
    schatten = glatt((-sig - 3.0) / 12.0)[..., None]
    uebertrag = (1.0 - schatten) * (neu + (im - alt)) + schatten * (neu * verh)

    erg = alpha * im + (1 - alpha) * uebertrag
    return erg, kern, alt, rest


def zuschnitt(erg, kern):
    """Auf ZIEL_VERHAELTNIS beschneiden, Fenster um die Gegenstaende gelegt."""
    H, W, _ = erg.shape
    ys, xs = np.where(kern)
    if not len(ys):
        ys, xs = np.array([0, H - 1]), np.array([0, W - 1])
    oben, unten, links, rechts = ys.min(), ys.max(), xs.min(), xs.max()

    if W / H > ZIEL_VERHAELTNIS:      # zu breit: seitlich beschneiden
        nb, nh = int(round(H * ZIEL_VERHAELTNIS)), H
        mitte = (links + rechts) / 2
        x0 = int(round(np.clip(mitte - nb / 2, 0, W - nb)))
        y0 = 0
    else:                              # zu hoch: oben und unten beschneiden
        nb, nh = W, int(round(W / ZIEL_VERHAELTNIS))
        # Unterkante der Gegenstaende ist wichtiger als die Oberkante: dort
        # stehen Standflaeche, Schatten und Spiegelung.
        unten_rand = min(H - unten, int(nh * 0.10))
        y0 = int(round(np.clip(unten + unten_rand - nh, 0, H - nh)))
        x0 = 0
    return (x0, y0, x0 + nb, y0 + nh)


def main():
    schreiben = "--schreiben" in sys.argv
    print(f'{"Bild":14s} {"Quelle":11s} {"Feld alt: Mittel R/G/B":24s} {"min":>6s} {"max":>6s} '
          f'{"Stich":>6s} {"Rest":>5s}  Zuschnitt')
    for n in BILDER:
        q = ORDNER / f"{n}.png"
        im = np.asarray(Image.open(q).convert("RGB"), dtype=np.float32)
        H, W, _ = im.shape
        erg, kern, alt, rest = vereinheitlichen(im)

        frei = np.abs(im.mean(2) - alt.mean(2)) < 6
        mw = im[frei].mean(0)
        lum = alt.mean(2)[frei]
        stich = float(mw.max() - mw.min())
        k = zuschnitt(erg, kern)
        print(f'{n:14s} {W}x{H:<6d} {mw[0]:7.2f}{mw[1]:7.2f}{mw[2]:7.2f}      '
              f'{lum.min():6.2f} {lum.max():6.2f} {stich:6.2f} {rest:5.2f}  '
              f'{k[2]-k[0]}x{k[3]-k[1]} ab ({k[0]},{k[1]})')

        if schreiben:
            bild = Image.fromarray(np.clip(erg + 0.5, 0, 255).astype(np.uint8)).crop(k)
            bild = bild.resize((ZIEL_BREITE, ZIEL_HOEHE), Image.LANCZOS)
            bild.save(ORDNER / f"{n}-final.png")
    if schreiben:
        print(f"geschrieben: {len(BILDER)} Dateien <name>-final.png, je "
              f"{ZIEL_BREITE}x{ZIEL_HOEHE}")


if __name__ == "__main__":
    main()
