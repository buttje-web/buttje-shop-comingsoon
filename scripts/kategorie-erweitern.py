#!/usr/bin/env python3
"""
Kategoriebild auf 3:2 bringen, indem die Leinwand erweitert wird.

  python3 scripts/kategorie-erweitern.py chemie             # nur rechnen
  python3 scripts/kategorie-erweitern.py chemie --schreiben

ANLASS: Beim Vereinheitlichen wurde chemie oben beschnitten und dabei
Ware angeschnitten - dem Kanister fehlte der Tragegriff, der blauen
Flasche der Verschluss. Auf einer Kategoriekachel liest sich das als
Fehler.

REGEL, die daraus folgt: An diesen Bildern wird keine Ware
beschnitten. Der Hintergrund ist gleichmaessig dunkel und laesst sich
fortsetzen, also wird das Format ueber eine breitere Leinwand
erreicht. Beschnitten wird nur, wenn ausschliesslich leerer Grund
wegfaellt.

WARUM WAND UND BODEN DURCHLAUFEN: Der Hintergrund wird ohnehin
komplett neu gerechnet (scripts/kategorie-hintergrund.py), und zwar
fuer die GESAMTE neue Leinwand in einem Stueck. Bodenkante, Abfall
zur Mitte und Grundton laufen dadurch von selbst durch die
angesetzten Streifen weiter, auf derselben Hoehe wie im Bild.

Die Streifen entstehen durch SPIEGELUNG des jeweiligen Bildrandes.
Ein aus dem geschaetzten Feld gerechneter Streifen waere naheliegend,
erzeugt aber eine sichtbare Naht: das Feld ist eine geglaettete
Naeherung, der echte Bildrand weicht davon ab. Der Streifen laege
dann auf dem Sollwert, das Bild daneben darunter - und genau das
sieht man als senkrechte Kante. Gespiegelt traegt der Streifen
dieselbe Abweichung wie die Flaeche, an die er anschliesst.
Gespiegelt wird nur, wenn am betreffenden Rand ausschliesslich leerer
Grund steht; sonst bricht das Skript ab.

Abhaengigkeiten: pillow, numpy, scipy
"""
import importlib.util
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

WURZEL = Path(__file__).resolve().parent.parent
ORDNER = WURZEL / "public/kategorie"

_spec = importlib.util.spec_from_file_location("kh", WURZEL / "scripts/kategorie-hintergrund.py")
kh = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(kh)

GRENZE = 0.25   # mehr Erweiterung als das lassen wir nicht zu


def erweitern(name, schreiben):
    q = ORDNER / f"{name}.png"
    im = np.asarray(Image.open(q).convert("RGB"), dtype=np.float32)
    H, W, _ = im.shape
    ziel_b = int(round(H * kh.ZIEL_VERHAELTNIS))
    zusatz = ziel_b - W
    print(f"{name}: Original {W}x{H}, Verhaeltnis {W/H:.3f}")
    if zusatz <= 0:
        print("  bereits breit genug, keine Erweiterung noetig")
        return
    print(f"  Ziel {ziel_b}x{H}, Erweiterung {zusatz} px "
          f"= {zusatz / W * 100:.1f} Prozent der Bildbreite")
    if zusatz / W > GRENZE:
        print(f"  ABBRUCH: ueber der Grenze von {GRENZE*100:.0f} Prozent")
        return

    alt, _, _ = kh.altes_feld(im)
    kern = kh.objektmaske(im.mean(2) - alt.mean(2))
    ys, xs = np.where(kern)
    # Die Gegenstaende sollen in der neuen Leinwand mittig stehen.
    links = int(round(np.clip((ziel_b - (xs.max() - xs.min() + 1)) / 2 - xs.min(),
                              0, zusatz)))
    rechts = zusatz - links
    print(f"  Gegenstaende x {xs.min()}..{xs.max()}, y {ys.min()}..{ys.max()}")
    print(f"  angesetzt: links {links} px, rechts {rechts} px")

    # Die Streifen werden GESPIEGELT, nicht gerechnet.
    # Ein gerechneter Streifen aus dem geschaetzten Feld sieht auf dem
    # Papier richtig aus und erzeugt trotzdem eine sichtbare Naht: das
    # Feld ist eine geglaettete Naeherung, der echte Rand des Bildes
    # weicht davon ab - bei chemie ist die untere linke Ecke deutlich
    # dunkler als das Modell. Der Streifen laege dann auf dem Sollwert,
    # das Bild daneben darunter, und genau das sieht man als Kante.
    # Gespiegelt traegt der Streifen dieselbe Abweichung wie die Flaeche,
    # an die er anschliesst, und die Naht verschwindet.
    # Zulaessig ist das nur, weil an beiden Raendern ausschliesslich
    # leerer Grund steht - gepruefte Bedingung, siehe unten.
    if links > xs.min() or rechts > W - 1 - xs.max():
        print("  ABBRUCH: der zu spiegelnde Rand enthaelt Ware")
        return
    ext = np.empty((H, ziel_b, 3), dtype=np.float32)
    ext[:, links:links + W] = im
    if links:
        ext[:, :links] = im[:, links:0:-1][:, -links:] if links > 1 else im[:, :1]
    if rechts:
        ext[:, links + W:] = im[:, W - 2:W - 2 - rechts:-1]

    erg, kern2, _, rest = kh.vereinheitlichen(ext)
    print(f"  Restabweichung des Feldes: {rest:.2f} Tonwerte")

    bild = Image.fromarray(np.clip(erg + 0.5, 0, 255).astype(np.uint8))
    bild = bild.resize((kh.ZIEL_BREITE, kh.ZIEL_HOEHE), Image.LANCZOS)
    print(f"  {ziel_b}x{H} -> {kh.ZIEL_BREITE}x{kh.ZIEL_HOEHE}, "
          f"Faktor {kh.ZIEL_BREITE/ziel_b:.4f} (verkleinert, nicht hochgerechnet)")
    if schreiben:
        bild.save(ORDNER / f"{name}-final.png")
        print(f"  geschrieben: {name}-final.png")


if __name__ == "__main__":
    namen = [a for a in sys.argv[1:] if not a.startswith("--")]
    for n in namen or ["chemie"]:
        erweitern(n, "--schreiben" in sys.argv)
