#!/usr/bin/env python3
"""
Kontrast der KI-Kennzeichnung messen - am gerenderten Bildschirm, nicht am
Bild.

  node scripts/ki-label-messen.mjs 3121   # Startseite messen
  python3 scripts/ki-label-kontrast.py    # Kontraste daraus rechnen

  node scripts/kopfbild-messen.mjs 3131            # Kategorieseiten messen
  python3 scripts/ki-label-kontrast.py /tmp/kopfbild

WARUM AM BILDSCHIRM UND NICHT AN DER DATEI: Unter dem Label liegt nicht
die Bilddatei, sondern das, was der Browser daraus macht - skaliert,
beschnitten (object-cover), beim Hero zusaetzlich mit dem Verlauf
darueber. Ein Wert aus der Datei waere eine Schaetzung. Gemessen wird
deshalb der Bildschirmabzug derselben Seite mit ausgeblendetem Label:
genau die Bildpunkte, die spaeter unter dem Kasten liegen.

GEMESSEN WIRD DER HELLSTE PUNKT, nicht der Mittelwert. Der Kasten hebt
den Kontrast an; entscheidend ist die Stelle, an der er am wenigsten
hilft.

Rechenweg je Punkt:
  unter  = Bildpunkt aus dem Abzug
  kasten = Deckung * Kastenfarbe + (1 - Deckung) * unter
  kontrast = (L(Schriftfarbe) + 0,05) / (L(kasten) + 0,05)
L ist die relative Helligkeit nach WCAG 2.

Deckung, Kastenfarbe und Schriftfarbe werden nicht angenommen, sondern
aus dem Browser uebernommen (getComputedStyle). Das ist keine Feinheit:
die Standbilder tragen 55 Prozent Deckung, der Filmplayer 65, und eine
fest verdrahtete Zahl haette den Unterschied verschluckt.

Abhaengigkeiten: pillow, numpy
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent
ABZUG = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/ki-label")

def rgba(s):
    """rgba(14, 14, 18, 0.55) -> (Farbe, Deckung). Aus dem Browser, nicht
    aus einer Annahme: der Filmplayer hat einen dichteren Kasten als die
    Standbilder, und das darf hier nicht untergehen."""
    z = [float(t) for t in s[s.index("(") + 1:s.index(")")].split(",")]
    return np.array(z[:3], dtype=np.float64), (z[3] if len(z) > 3 else 1.0)


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
          f'{"hellster Punkt":14s} {"Deckung":6s} {"unter Kasten":14s} {"Kontrast":>9s}  sichtbar')
    schlechteste = {}
    for eintrag in daten:
        breite = eintrag["breite"]
        s = eintrag["skala"]
        # Startseite: ein Abzug fuer alle sieben Stellen. Kategorieseiten:
        # je Stelle eine eigene Seite und damit ein eigener Abzug.
        gemeinsam = eintrag.get("abzug")
        for stelle in eintrag["stellen"]:
            abzug = np.asarray(
                Image.open(ABZUG / (stelle.get("abzug") or gemeinsam)).convert("RGB"),
                dtype=np.float64)
            x, y, b, h = (stelle["x"], stelle["y"], stelle["b"], stelle["h"])
            teil = abzug[int(round(y * s)):int(round((y + h) * s)),
                         int(round(x * s)):int(round((x + b) * s))]
            # Hellster Punkt nach Helligkeit, nicht nach Kanal - ein
            # einzelner heller Kanal macht den Punkt noch nicht hell.
            i = int(np.argmax(relative_helligkeit(teil).ravel()))
            unter = teil.reshape(-1, 3)[i]
            kasten, deckung = rgba(stelle["kasten"])
            schrift, _ = rgba(stelle["farbe"])
            ueber = deckung * kasten + (1 - deckung) * unter
            k = float(kontrast(schrift, ueber))
            schlechteste[breite] = min(schlechteste.get(breite, 99), k)
            print(f'{breite:7d} {stelle["name"]:12s} '
                  f'{x:6.0f} {y:6.0f} {b:4.0f} {h:4.0f}   '
                  f'{unter[0]:4.0f}{unter[1]:4.0f}{unter[2]:4.0f}   '
                  f'{deckung*100:3.0f}%  '
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
