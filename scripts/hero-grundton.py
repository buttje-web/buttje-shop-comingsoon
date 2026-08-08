#!/usr/bin/env python3
"""
Leeren Hintergrund eines Hero-Motivs auf den Seitengrundton ziehen.

  python3 scripts/hero-grundton.py public/hero/hero-final-v2.png

Zweck: Das Motiv laeuft auf der Seite randlos aus. Liegt sein Grund auch nur
zwei, drei Tonwerte neben --base (#0e0e12), zeichnet sich das Bild als
dunkleres Rechteck auf der Seite ab. Dieses Skript hebt AUSSCHLIESSLICH die
freie Flaeche auf den Sollwert.

Was es NICHT tut: freistellen, retuschieren, Schatten oder Spiegelungen
rechnen, Farben der Gegenstaende veraendern. Der Eingriff ist eine additive
Verschiebung von wenigen Tonwerten, und sie wirkt nur dort, wo das Bild dem
glatten Hintergrundfeld entspricht.

Verfahren
  1. Das vorhandene Hintergrundfeld als Polynom 4. Grades je Kanal schaetzen,
     robust: Gegenstaende fliegen rundenweise als Ausreisser heraus.
  2. Verschiebung = Sollton - geschaetztes Feld. Das ist ein sehr glattes
     Feld von wenigen Tonwerten.
  3. Verschiebung nur dort auftragen, wo der Bildpunkt nahe am Feld liegt.
     Gewicht 1 bei Abstand unter NAH, 0 ab FERN. Gegenstaende und ihre
     Kanten bleiben damit unberuehrt.

Abhaengigkeiten: pillow, numpy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SOLL = np.array([0x0E, 0x0E, 0x12], dtype=np.float32)   # --base in app/globals.css
NAH, FERN = 4.0, 12.0                                    # Tonwertabstand zum Feld
# Die echte Korrektur liegt bei wenigen Tonwerten. Alles Groessere kommt
# nicht vom Grundton, sondern davon, dass das Polynom ueber den
# Gegenstaenden extrapoliert. Deshalb hart begrenzt.
GRENZE = 5.0
GRAD = 4


def glatt(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def feld(im, grad=GRAD, runden=8):
    H, W, _ = im.shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    u = xs / (W - 1) * 2 - 1
    v = ys / (H - 1) * 2 - 1
    A = np.stack([(u ** i * v ** j).ravel()
                  for i in range(grad + 1) for j in range(grad + 1) if i + j <= grad], 1)
    # Startmenge: Raender, dort steht bei diesem Motiv nur Hintergrund.
    gueltig = ((xs > W * 0.85) | (ys < H * 0.35)).ravel()
    for _ in range(runden):
        bg = np.stack([(A @ np.linalg.lstsq(A[gueltig], im[..., c].ravel()[gueltig],
                                            rcond=None)[0]).reshape(H, W) for c in range(3)], -1)
        abstand = np.linalg.norm(im - bg, axis=2)
        gueltig = (abstand < max(3.0 * np.median(abstand[abstand < 30]), 5.0)).ravel()
    return bg, abstand


def main(pfad):
    p = Path(pfad)
    im = np.asarray(Image.open(p).convert("RGB"), dtype=np.float32)
    bg, abstand = feld(im)

    gewicht = (1.0 - glatt((abstand - NAH) / (FERN - NAH)))[..., None]
    verschiebung = np.clip(SOLL[None, None, :] - bg, -GRENZE, GRENZE)
    print("  Verschiebung im freien Feld: %.2f bis %.2f Tonwerte"
          % (verschiebung.min(), verschiebung.max()))
    print("  betroffene Flaeche (Gewicht > 0,5): %.1f Prozent"
          % ((gewicht[..., 0] > 0.5).mean() * 100))

    erg = im + gewicht * verschiebung
    Image.fromarray(np.clip(erg + 0.5, 0, 255).astype(np.uint8)).save(p)
    print("geschrieben:", p)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/hero/hero-final-v2.png")
