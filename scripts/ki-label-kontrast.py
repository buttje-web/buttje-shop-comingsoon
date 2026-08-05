#!/usr/bin/env python3
"""
Kontrast der KI-Kennzeichnung messen - am gerenderten Bildschirm, nicht am
Bild.

  node scripts/ki-label-messen.mjs 3121   # misst und legt die Bilder ab
  python3 scripts/ki-label-kontrast.py    # rechnet die Kontraste daraus

WARUM AM BILDSCHIRM UND NICHT AN DER DATEI: Unter dem Label liegt nicht
die Bilddatei, sondern das, was der Browser daraus macht - skaliert,
beschnitten (object-cover), beim Hero zusaetzlich mit dem Verlauf
darueber. Ein Wert aus der Datei waere eine Schaetzung. Gemessen wird
deshalb der Bildschirmabzug derselben Seite mit ausgeblendetem Label:
genau die Bildpunkte, die spaeter unter dem Kasten liegen.

GEMESSEN WIRD DER HELLSTE PUNKT, nicht der Mittelwert. Der Kasten mit
55 Prozent Deckung hebt den Kontrast an; entscheidend ist die Stelle, an
der er am wenigsten hilft.

Rechenweg je Punkt:
  unter  = Bildpunkt aus dem Abzug
  kasten = 0,55 * #0e0e12 + 0,45 * unter
  kontrast = (L(#f4f4f6) + 0,05) / (L(kasten) + 0,05)
L ist die relative Helligkeit nach WCAG 2.

Abhaengigkeiten: pillow, numpy
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent
ABZUG = Path("/tmp/ki-label")

SCHRIFT = np.array([0xF4, 0xF4, 0xF6], dtype=np.float64)   # --text
KASTEN = np.array([0x0E, 0x0E, 0x12], dtype=np.float64)    # --base
DECKUNG = 0.55


def relative_helligkeit(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def kontrast(a, b):
    la, lb = relative_helligkeit(a), relative_helligkeit(b)
    hell, dunkel = np.maximum(la, lb), np.minimum(la, lb)
    return (hell + 0.05) / (dunkel + 0.05)


def main():
    daten = json.loads((ABZUG / "messung.json").read_text())
    print(f'{"Breite":>7} {"Stelle":12s} {"Label x/y/b/h":22s} '
          f'{"hellster Punkt":16s} {"unter Kasten":14s} {"Kontrast":>9s}  sichtbar')
    schlechteste = {}
    for eintrag in daten:
        breite = eintrag["breite"]
        s = eintrag["skala"]
        abzug = np.asarray(Image.open(ABZUG / eintrag["abzug"]).convert("RGB"),
                           dtype=np.float64)
        for stelle in eintrag["stellen"]:
            x, y, b, h = (stelle["x"], stelle["y"], stelle["b"], stelle["h"])
            teil = abzug[int(round(y * s)):int(round((y + h) * s)),
                         int(round(x * s)):int(round((x + b) * s))]
            # Hellster Punkt nach Helligkeit, nicht nach Kanal - ein
            # einzelner heller Kanal macht den Punkt noch nicht hell.
            i = int(np.argmax(relative_helligkeit(teil).ravel()))
            unter = teil.reshape(-1, 3)[i]
            ueber = DECKUNG * KASTEN + (1 - DECKUNG) * unter
            k = float(kontrast(SCHRIFT, ueber))
            schlechteste[breite] = min(schlechteste.get(breite, 99), k)
            print(f'{breite:7d} {stelle["name"]:12s} '
                  f'{x:6.0f} {y:6.0f} {b:4.0f} {h:4.0f}   '
                  f'{unter[0]:4.0f}{unter[1]:4.0f}{unter[2]:4.0f}     '
                  f'{ueber[0]:4.0f}{ueber[1]:4.0f}{ueber[2]:4.0f}    '
                  f'{k:7.2f}:1  {"ja" if stelle["sichtbar"] else "NEIN"}')
        print(f'{breite:7d} {"":12s} waagrechtes Scrollen: '
              f'{"JA" if eintrag["scrollt"] else "nein"} '
              f'(scrollWidth {eintrag["scrollWidth"]}, innerWidth {breite})')
    print()
    for breite, k in sorted(schlechteste.items(), reverse=True):
        print(f'  {breite:5d} px: schlechtester Kontrast {k:.2f}:1 '
              f'{"erfuellt" if k >= 4.5 else "VERFEHLT"} 4,5:1')


if __name__ == "__main__":
    main()
