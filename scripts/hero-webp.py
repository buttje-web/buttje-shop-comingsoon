#!/usr/bin/env python3
"""
WebP-Fassungen eines Hero-Motivs erzeugen.

  python3 scripts/hero-webp.py public/hero/hero-final-v2.png hero-final

Erzeugt <praefix>-<breite>.webp neben der Quelle, eine Datei je gewuenschter
Breite. Breiten oberhalb der Quellbreite werden UEBERSPRUNGEN, nicht
hochgerechnet — hochskaliert waere die Datei groesser und schlechter als das
Original.

Die Qualitaet wird je Breite so weit gesenkt, bis die Datei unter GRENZE
liegt. Untergrenze MIN_Q, darunter wird nicht gegangen; passt es dann immer
noch nicht, meldet das Skript das und schreibt die Datei trotzdem.

Abhaengigkeiten: pillow
"""
import sys
from pathlib import Path

from PIL import Image

BREITEN = [2560, 1920, 1280, 768]
GRENZE = 250 * 1024
START_Q, MIN_Q = 88, 55


def main(quelle, praefix):
    q = Path(quelle)
    im = Image.open(q).convert("RGB")
    print(f"Quelle {q.name}: {im.width}x{im.height}")

    breiten = [b for b in BREITEN if b <= im.width]
    fehlt = [b for b in BREITEN if b > im.width]
    if fehlt:
        print("  uebersprungen (waere Hochskalierung): " + ", ".join(map(str, fehlt)))
    # Die volle Breite gehoert dazu, sonst faellt der Browser auf breiten
    # Schirmen auf die PNG-Fassung zurueck.
    if im.width not in breiten:
        breiten.insert(0, im.width)

    for b in breiten:
        h = round(im.height * b / im.width)
        skal = im if b == im.width else im.resize((b, h), Image.LANCZOS)
        ziel = q.with_name(f"{praefix}-{b}.webp")
        for qual in range(START_Q, MIN_Q - 1, -3):
            skal.save(ziel, "WEBP", quality=qual, method=6)
            if ziel.stat().st_size <= GRENZE:
                break
        gr = ziel.stat().st_size
        marke = "" if gr <= GRENZE else "   ACHTUNG ueber der Grenze"
        print(f"  {ziel.name:24s} {b}x{h}  Q{qual}  {gr/1024:7.1f} KB{marke}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/hero/hero-final-v2.png",
         sys.argv[2] if len(sys.argv) > 2 else "hero-final")
