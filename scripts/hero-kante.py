#!/usr/bin/env python3
"""
Die senkrechte Kante im Hero suchen - erst in der Datei, dann am
Bildschirm.

  python3 scripts/hero-kante.py                 # Datei vermessen
  python3 scripts/hero-kante.py /tmp/hero/abzug-1440.png 1440

ANLASS: Im schwarzen Grund des Heros ist bei 1440 eine senkrechte
Kante zu sehen, etwa auf Hoehe der liegenden Muellsackrolle. Zwei
Verdaechtige: die Datei selbst oder der Verlauf, der ueber der linken
Bildhaelfte liegt.

VERFAHREN: waagrechte Helligkeitsprofile in mehreren Hoehen, jeweils
ueber ein schmales Band gemittelt, damit Korn nicht als Kante
erscheint. Gesucht wird die groesste Aenderung ueber eine kurze
Strecke - eine Kante ist ein Sprung auf wenigen Bildpunkten, ein
Verlauf ist eine Steigung ueber Hunderte.

Abhaengigkeiten: pillow, numpy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent
BAND = 21          # Hoehe des gemittelten Bandes in Bildpunkten
FENSTER = 12       # ueber so viele Bildpunkte wird der Sprung gemessen


def profil(im, y):
    """Waagrechtes Helligkeitsprofil, ueber ein Band gemittelt."""
    a = im[max(0, y - BAND // 2):y + BAND // 2 + 1].mean(axis=(0, 2))
    return a


def sprung(a):
    """Groesste Aenderung ueber FENSTER Bildpunkte und wo sie sitzt."""
    d = a[FENSTER:] - a[:-FENSTER]
    i = int(np.argmax(np.abs(d)))
    return i + FENSTER // 2, float(d[i])


def messen(pfad, breite=None):
    im = np.asarray(Image.open(pfad).convert("RGB"), dtype=np.float64)
    H, W, _ = im.shape
    print(f"{pfad}  {W}x{H}")
    print(f'{"y":>6} {"Mittel":>7} {"min":>6} {"max":>6} {"Spanne":>7} '
          f'{"groesster Sprung":>17} {"bei x":>7} {"Anteil":>7}')
    for anteil in (0.03, 0.08, 0.15, 0.25, 0.40, 0.55, 0.70, 0.85, 0.95):
        y = int(H * anteil)
        a = profil(im, y)
        x, d = sprung(a)
        print(f"{y:6d} {a.mean():7.2f} {a.min():6.2f} {a.max():6.2f} "
              f"{a.max()-a.min():7.2f} {d:+17.2f} {x:7d} {x/W:7.3f}")
    return im


if __name__ == "__main__":
    if len(sys.argv) > 1:
        messen(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else None)
    else:
        messen(WURZEL / "public/hero/hero-final-v2.png")
