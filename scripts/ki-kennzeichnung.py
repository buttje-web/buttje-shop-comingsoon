#!/usr/bin/env python3
"""
Sichtbare KI-Kennzeichnung in ein Bild einbrennen.

  python3 scripts/ki-kennzeichnung.py                # rechnen und messen
  python3 scripts/ki-kennzeichnung.py --schreiben

ANLASS: Artikel 50 der EU-KI-Verordnung, anwendbar seit 02.08.2026.
Fotorealistische KI-Bilder muessen sichtbar gekennzeichnet sein. Ein
Hinweis im Alt-Text genuegt nicht, weil sehende Nutzer ihn nicht
wahrnehmen. Die Kennzeichnung gehoert deshalb IN die Datei, nicht als
HTML-Element daneben - so bleibt sie erhalten, wenn jemand das Bild
herunterlaedt oder weitergibt.

GROESSE, nicht frei gewaehlt, sondern gerechnet:
Das Label muss in der KLEINSTEN ausgelieferten Darstellung noch
lesbar sein. Fuer den Hero ist das die Handy-Ansicht: dort steht das
Motiv in einem 390 px breiten Kasten, der Massstab ist also
390/1678 = 0,2324. Fuer 12 CSS-Pixel in der Anzeige braucht es
12 / 0,2324 = 52 px Schrifthoehe in der Datei.

KEIN ICON: public/icons/ai-generated.svg existiert im Repo nicht.
Auftragsgemaess wird dann nur mit Text gearbeitet und nichts
improvisiert.

Abhaengigkeiten: pillow, numpy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

WURZEL = Path(__file__).resolve().parent.parent
SCHRIFT = WURZEL / "scripts/assets/inter-latin-subset.ttf"
TEXT = "KI-generiert"

# Helligkeit des Labels. 150 waere das rechnerische Minimum fuer 4,5:1
# an der dunkelsten Stelle unter dem auslaufenden Verlauf; 200 laesst
# Luft und bleibt trotzdem gedeckt, also kein reines Weiss.
FARBE = (200, 200, 204)

# (Datei, Schriftgroesse, x, y der linken oberen Ecke des Textes)
AUFTRAEGE = [
    (WURZEL / "public/hero/hero-final-v2.png", 52, 830, 75),
]


def relative_helligkeit(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return float(0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2])


def kontrast(a, b):
    la, lb = relative_helligkeit(a), relative_helligkeit(b)
    hell, dunkel = max(la, lb), min(la, lb)
    return (hell + 0.05) / (dunkel + 0.05)


def schrift(px, gewicht=600):
    f = ImageFont.truetype(str(SCHRIFT), px)
    try:
        f.set_variation_by_axes([gewicht])
    except Exception:
        pass
    return f


def main():
    schreiben = "--schreiben" in sys.argv
    for pfad, groesse, x, y in AUFTRAEGE:
        bild = Image.open(pfad).convert("RGB")
        vorher = np.asarray(bild, dtype=np.float32)
        f = schrift(groesse)
        d = ImageDraw.Draw(bild)
        kasten = d.textbbox((x, y), TEXT, font=f)
        d.text((x, y), TEXT, font=f, fill=FARBE)
        nachher = np.asarray(bild, dtype=np.float32)

        # Kontrast gegen den ORTLICHEN Untergrund, gemessen im Original
        # rings um den Schriftzug, nicht gegen einen angenommenen Wert.
        a, b, c, e = kasten
        ring = np.concatenate([
            vorher[max(0, b - 14):b, a:c].reshape(-1, 3),
            vorher[e:e + 14, a:c].reshape(-1, 3),
            vorher[b:e, max(0, a - 14):a].reshape(-1, 3),
            vorher[b:e, c:c + 14].reshape(-1, 3)])
        grund = ring.mean(0)
        print(f"{pfad.name}")
        print(f"  Schriftgroesse {groesse} px, Kasten x {a}..{c}, y {b}..{e} "
              f"({c-a}x{e-b} px)")
        print(f"  Untergrund an Ort und Stelle {grund[0]:.1f}/{grund[1]:.1f}/{grund[2]:.1f}")
        print(f"  Kontrast Label gegen Untergrund: {kontrast(FARBE, grund):.2f}:1")

        d2 = np.abs(nachher - vorher).max(2)
        aussen = d2.copy()
        aussen[b:e, a:c] = 0
        print(f"  Aenderung ausserhalb des Labelkastens: max {aussen.max():.0f} Tonwerte "
              f"auf {int((aussen > 0).sum())} Bildpunkten")
        if schreiben:
            bild.save(pfad)
            print(f"  geschrieben: {pfad}")


if __name__ == "__main__":
    main()
