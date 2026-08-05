#!/usr/bin/env python3
"""
Die senkrechte Kante im freien Hintergrund des Heros einebnen.

  python3 scripts/hero-kante-weg.py               # nur rechnen und messen
  python3 scripts/hero-kante-weg.py --schreiben

ANLASS: Im freien Grund steht bei x 803 bis 812 eine senkrechte Kante,
Sprung 3,6 Tonwerte auf 14 Bildpunkten, dahinter ein rund 250 px
breites helleres Band. Sie steckt schon im Rohbild; die aeussere
Korrektur hat sie kleiner, aber auch haerter gemacht (vorher 4,8
Tonwerte ueber 38 px). Am Bildschirm liegt sie bei 1440 auf x 1010.
Freigabe zum Eingriff: 05.08.2026, ausdruecklich nur dafuer.

WARUM KEIN POLYNOM: Der erste Durchgang (scripts/hero-grundton.py)
legte eine Flaeche 4. Grades durch den Hintergrund. Ein Polynom kann
einen Sprung nicht abbilden, es glaettet nur darum herum - deshalb
blieb die Kante damals stehen.

VERFAHREN: Das Hintergrundfeld wird zweimal geschaetzt, beide Male als
MASKIERTE Weichzeichnung, also gewichtet mit der Maske des freien
Grundes:
    feld_eng   Radius  14 px   folgt der Kante
    feld_weit  Radius 300 px   folgt nur dem grossen Lichtverlauf
Abgezogen wird die Differenz. Damit verschwindet, was zwischen diesen
beiden Groessen liegt - die Kante und das Band -, waehrend die
grossraeumige Lichtform des Bildes unangetastet bleibt. Ein einfaches
Einebnen auf einen festen Ton wuerde auch die gewollte Vignette
mitnehmen.

WAS GESCHUETZT IST, doppelt:
  - Helligkeitsrampe: ab Tonwert HELL_AUS wirkt die Korrektur gar
    nicht mehr. Ware, Figur und Kartonaufdruck liegen darueber.
  - Abstandsrampe: in unmittelbarer Naehe der Gegenstaende wird nicht
    korrigiert, damit Streulicht und Schatten bleiben, wie sie sind.
Zusaetzlich ist der Betrag der Korrektur hart begrenzt (GRENZE).

KEIN KORN NACHGELEGT, obwohl eingeplant. Es waere nicht nur
ueberfluessig, sondern schaedlich: die Korrektur ist die Differenz
zweier Weichzeichnungen mit Radius 14 und 300, sie enthaelt also
nichts unterhalb von 14 Bildpunkten und kann Korn gar nicht
wegnehmen. Gemessen im freien Grund: 4,239 Tonwerte vorher, 4,241
nachher. Ein erster Durchgang MIT nachgelegtem Korn verschob dunkle
Hintergrundpunkte um bis zu 9 Tonwerte, ohne dass es dafuer einen
Grund gab; das wurde verworfen.

Abhaengigkeiten: pillow, numpy, scipy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "public/hero/hero-final-v2.png"

ENG, WEIT = 14.0, 300.0   # Radien der beiden Feldschaetzungen
OBJEKT = 40.0             # ab hier gilt ein Bildpunkt als Gegenstand
HELL_EIN, HELL_AUS = 26.0, 44.0   # Rampe, ab der die Korrektur ausblendet
NAH, FERN = 4.0, 20.0     # Abstandsrampe um die Gegenstaende
GRENZE = 4.0              # mehr als so viele Tonwerte wird nie verschoben


def glatt(t):
    t = np.clip(np.asarray(t, dtype=np.float64), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def maskiert(bild, maske, radius):
    """Weichzeichnung, die nur die maskierten Punkte beruecksichtigt."""
    z = ndi.gaussian_filter(bild * maske[..., None], (radius, radius, 0))
    n = ndi.gaussian_filter(maske, radius)
    return z / np.maximum(n, 1e-6)[..., None]


def rechnen(im):
    lum = im.mean(2)

    # Freier Grund: alles, was dunkel ist und nicht am Rand eines
    # Gegenstands klebt. Die Maske dient nur der Feldschaetzung.
    kern = lum > OBJEKT
    kern = ndi.binary_closing(kern, np.ones((7, 7)))
    kern = ndi.binary_fill_holes(kern)
    frei = (~kern).astype(np.float64)

    feld_eng = maskiert(im, frei, ENG)
    feld_weit = maskiert(im, frei, WEIT)
    korrektur = np.clip(feld_eng - feld_weit, -GRENZE, GRENZE)

    # Schutz 1: Helligkeit. Schutz 2: Abstand zu den Gegenstaenden.
    w_hell = 1.0 - glatt((lum - HELL_EIN) / (HELL_AUS - HELL_EIN))
    entfernung = ndi.distance_transform_edt(~kern)
    w_fern = glatt((entfernung - NAH) / (FERN - NAH))
    w = (w_hell * w_fern)[..., None]

    erg = im - korrektur * w

    # Korn wird NICHT nachgelegt, siehe Kopf dieser Datei. Gemessen
    # wird es trotzdem, als Nachweis, dass keines verloren geht.
    def korn(a):
        rest = a - ndi.uniform_filter(a, size=(7, 7, 1))
        return float(np.std(rest[frei > 0.5]))
    return erg, korrektur * w, kern, (korn(im), korn(erg))


def sprung(a, links=(740, 790), rechts=(840, 890)):
    return a[rechts[0]:rechts[1]].mean() - a[links[0]:links[1]].mean()


def main():
    im = np.asarray(Image.open(QUELLE).convert("RGB"), dtype=np.float64)
    erg, delta, kern, korn = rechnen(im)

    print(f"Korn im freien Grund: {korn[0]:.3f} vorher, {korn[1]:.3f} nachher")
    print(f"{'y':>6} {'vorher':>8} {'nachher':>8}")
    v, n = [], []
    for y in range(12, 430, 20):
        a = im[y - 12:y + 13].mean(axis=(0, 2))
        b = erg[y - 12:y + 13].mean(axis=(0, 2))
        v.append(sprung(a)); n.append(sprung(b))
        print(f"{y:6d} {v[-1]:+8.2f} {n[-1]:+8.2f}")
    print(f"{'Mittel':>6} {np.mean(v):+8.2f} {np.mean(n):+8.2f}")
    print(f"{'Betrag':>6} {np.max(np.abs(v)):8.2f} {np.max(np.abs(n)):8.2f}  (groesster Betrag)")

    d = np.abs(erg - im).max(2)
    for schwelle in (60, 45, 30):
        m = im.mean(2) > schwelle
        print(f"heller als Tonwert {schwelle}: groesste Aenderung {d[m].max():.2f} "
              f"Tonwerte auf {int((d[m] > 1).sum())} Bildpunkten ueber 1")
    frei = ~kern
    mw = erg[frei].reshape(-1, 3).mean(0)
    print(f"Grundton des freien Feldes nachher: {mw[0]:.2f}/{mw[1]:.2f}/{mw[2]:.2f}")
    mv = im[frei].reshape(-1, 3).mean(0)
    print(f"Grundton des freien Feldes vorher:  {mv[0]:.2f}/{mv[1]:.2f}/{mv[2]:.2f}")

    if "--schreiben" in sys.argv:
        Image.fromarray(np.clip(erg + 0.5, 0, 255).astype(np.uint8)).save(QUELLE)
        print(f"geschrieben: {QUELLE}")


if __name__ == "__main__":
    main()
