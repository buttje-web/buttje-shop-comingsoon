#!/usr/bin/env python3
"""
Kontrast der KI-Ueberlagerung im Film messen - ueber ALLEN Bildern.

  python3 scripts/film-label-kontrast.py

WARUM ANDERS ALS BEI DEN BILDERN: Unter einem Standbild liegt immer
dasselbe, unter einem Film alle 1441 Bilder nacheinander. Der
schlechteste Wert entscheidet, nicht der haeufigste. Gemessen wird
deshalb ueber den ganzen Film, vier Bilder je Sekunde, und je Bild der
hellste Punkt in dem Bereich, den die Ueberlagerung spaeter bedeckt.

DER BEREICH ist nicht geraten, sondern aus der Anzeige gerechnet. Der
Film ist 1080x1920, der Kasten hoechstens 380 CSS-Pixel breit und
mindestens 351 (Handy, Container-Innenabstand). Beide Faelle sind
abgedeckt; das Seitenverhaeltnis stimmt exakt, object-cover schneidet
nichts weg.

Bilder vorher ziehen:
  ffmpeg -i public/video/entsorgung-full.mp4 -vf fps=4 /tmp/film/f%04d.jpg

Abhaengigkeiten: pillow, numpy, imageio-ffmpeg
"""
from pathlib import Path

import numpy as np
from PIL import Image

BILDER = sorted(Path("/tmp/film").glob("f*.jpg"))
FILM_B, FILM_H = 1080, 1920
KASTEN = [380.0, 351.0]      # breiteste und schmalste Anzeige
LABEL_B, LABEL_H = 86.5, 18.0
RAND = 8.0

SCHRIFT = np.array([0xF4, 0xF4, 0xF6], dtype=np.float64)
GRUND = np.array([0x0E, 0x0E, 0x12], dtype=np.float64)


def relative_helligkeit(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def kontrast(a, b):
    la, lb = relative_helligkeit(a), relative_helligkeit(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def bereich(oben):
    """Labelflaeche in Filmpunkten, Vereinigung ueber beide Kastenbreiten."""
    x0 = y0 = 1e9
    x1 = y1 = -1e9
    for b in KASTEN:
        s = b / FILM_B
        x0 = min(x0, (b - RAND - LABEL_B) / s)
        x1 = max(x1, (b - RAND) / s)
        if oben:
            y0, y1 = min(y0, RAND / s), max(y1, (RAND + LABEL_H) / s)
        else:
            hoehe = b / 0.5625
            y0 = min(y0, (hoehe - RAND - LABEL_H) / s)
            y1 = max(y1, (hoehe - RAND) / s)
    return int(x0), int(y0), int(np.ceil(x1)), int(np.ceil(y1))


def messen(oben, deckung):
    x0, y0, x1, y1 = bereich(oben)
    schlechtester = (99.0, None, None)
    werte = []
    for p in BILDER:
        teil = np.asarray(Image.open(p).convert("RGB"), dtype=np.float64)[y0:y1, x0:x1]
        i = int(np.argmax(relative_helligkeit(teil).ravel()))
        unter = teil.reshape(-1, 3)[i]
        k = kontrast(SCHRIFT, deckung * GRUND + (1 - deckung) * unter)
        werte.append(k)
        if k < schlechtester[0]:
            schlechtester = (k, p.name, unter)
    w = np.array(werte)
    lage = "oben rechts" if oben else "unten rechts"
    print(f"  {lage}, Kasten {deckung*100:.0f} Prozent  "
          f"Bereich x {x0}..{x1} y {y0}..{y1}")
    print(f"    schlechtester Wert {schlechtester[0]:.2f}:1 bei {schlechtester[1]} "
          f"(Untergrund {schlechtester[2][0]:.0f}/{schlechtester[2][1]:.0f}/"
          f"{schlechtester[2][2]:.0f})")
    print(f"    Median {np.median(w):.2f}:1, unter 4,5:1 in "
          f"{int((w < 4.5).sum())} von {len(w)} Bildern")
    return schlechtester[0]


def main():
    print(f"{len(BILDER)} Bilder, vier je Sekunde")
    # Reinweiss ist die ungueenstigste Flaeche, die es ueberhaupt geben
    # kann. Was dagegen haelt, haelt gegen jedes Bild des Films.
    for d in (0.55, 0.60, 0.65):
        weiss = kontrast(SCHRIFT, d * GRUND + (1 - d) * np.array([255.0, 255, 255]))
        print(f"\nDeckung {d*100:.0f} Prozent  ueber Reinweiss {weiss:.2f}:1"
              f"  {'haelt' if weiss >= 4.5 else 'HAELT NICHT'}")
        for oben in (True, False):
            messen(oben, d)


if __name__ == "__main__":
    main()
