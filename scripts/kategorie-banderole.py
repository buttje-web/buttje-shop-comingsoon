#!/usr/bin/env python3
"""
Liter- und Stueckangaben von den Muellsackrollen entfernen.

  python3 scripts/kategorie-banderole.py             # nur pruefen
  python3 scripts/kategorie-banderole.py --schreiben # Bilder schreiben

ANLASS: Auf den Banderolen stehen erfundene Produktdaten
("120 Liter", "10 Stueck"). Auf einer Kategoriekachel koennen die als
Angebot gelesen werden. Die Banderole bleibt als Flaeche erhalten,
nur die Beschriftung faellt weg.

WARUM DIE FLAECHEN VON HAND STEHEN: Ein automatischer Schriftsucher
ueber das ganze Bild wurde gebaut und verworfen. Er fand die Schrift
zuverlaessig, hielt aber auch den Glanz auf der Sackfolie fuer
Schrift - 59.000 Bildpunkte in 19 Bloecken statt der gesuchten fuenf.
Die acht Banderolen sind stattdessen eingemessen und stehen unten.
Das ist nachpruefbar und trifft nichts, was nicht gemeint ist.

VERFAHREN, kein Klonstempel und kein Weichzeichner:
Die Banderole ist eine glatte, gewoelbte Flaeche. Durch ihre
schriftfreien Punkte wird eine Flaeche 3. Grades gelegt und die
Schrift damit ueberschrieben. Zwei Punkte entscheiden ueber das
Ergebnis:
  - Die Schrift hat einen weichen Saum, der das Band ringsum leicht
    abdunkelt. Punkte innerhalb von 16 px um die Schrift zaehlen
    deshalb NICHT als Referenz. Ohne das wird die Fuellung zu dunkel
    und die Retusche zeichnet sich als Schatten in Schriftform ab.
  - Gefuellt wird 5 px ueber die Schrift hinaus, damit dieser Saum
    mit verschwindet.
Darauf kommt Korn in der Staerke, die auf derselben Banderole
gemessen wurde; ohne das bliebe die Stelle unnatuerlich glatt.

Schrift ist alles, was deutlich heller ist als der Bandton an
derselben Stelle UND nicht am Rand des Vierecks haengt. Die zweite
Bedingung erledigt die Folienzipfel, die in manchen Ecken ins Viereck
ragen: sie sind heller als jeder Buchstabe, beruehren aber immer den
Rand.

MIT ENTFERNT wird der duenne Zierstrich unter der Zahl. Er gehoert
zum Textblock und stuende allein sinnlos da.

Abhaengigkeiten: pillow, numpy, scipy
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

WURZEL = Path(__file__).resolve().parent.parent
ORDNER = WURZEL / "public/kategorie"

# Eingemessen auf den fertigen Bildern, 1344x896.
# (x0, y0, x1, y1) je Textblock, eng um die Schrift gelegt und damit fast
# ganz auf der Banderole, aber mit Luft nach oben: beruehrt die grosse
# Zahl den Rand des Vierecks, faellt sie beim Randtest mit heraus.
# Wo eine Ecke doch auf die Folie faellt, faellt diese Folie beim Randtest
# heraus.
FLAECHEN = {
    "entsorgung-a-final": [
        (277, 242, 408, 383),    # gruene Rolle oben links
        (914, 306, 1058, 463),   # blaue Rolle stehend
        (628, 386, 748, 538),    # graue Rolle Mitte
        (244, 496, 383, 653),    # schwarze Rolle links
        (974, 550, 1093, 693),   # braune Rolle unten rechts
    ],
    "entsorgung-b-final": [
        (280, 392, 418, 548),    # gruene Rolle links
        (912, 382, 1058, 548),   # blaue Rolle stehend
        (612, 566, 743, 723),    # graue Rolle Mitte
    ],
}

FENSTER = 51     # Breite des Fensters fuer den Bandton, in Bildpunkten
HELLER = 15      # so viel heller als der Bandton gilt als Schrift
MIN_FLECK = 25   # kleinere Flecken sind Korn
SAUM_FUELL = 5   # so weit ueber die Schrift hinaus wird gefuellt
SAUM_REF = 16    # so weit um die Schrift herum taugt nichts als Referenz


def scheibe(r):
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return xx * xx + yy * yy <= r * r
SAUM = 4         # Sicherheitssaum um die Schrift



def masken(im, rechteck):
    """Schriftmaske und Bandmaske innerhalb eines Vierecks."""
    x0, y0, x1, y1 = rechteck
    lum = im[y0:y1, x0:x1].mean(2)

    # Bandton je Bildpunkt aus einem breiten WAAGRECHTEN Fenster. Breiter
    # als der dickste Buchstabenstrich, damit das Fenster auch mitten in
    # einer Ziffer noch Band links und rechts sieht. Ein quadratisches
    # Fenster oder ein fester Schwellwert scheitern hier: die Banderolen
    # haben quer ueber die Rolle einen deutlichen Helligkeitsverlauf, ein
    # fester Wert wuerde die helle Bandhaelfte fuer Schrift halten.
    grund = ndi.median_filter(lum, size=(1, FENSTER))
    hell = lum > grund + HELLER

    # Die Folienzipfel haengen am Rand des Vierecks, die Schrift nicht.
    lab, n = ndi.label(hell, structure=np.ones((3, 3)))
    schrift = np.zeros_like(hell)
    for i in range(1, n + 1):
        m = lab == i
        ys, xs = np.where(m)
        if (ys.min() == 0 or xs.min() == 0
                or ys.max() == m.shape[0] - 1 or xs.max() == m.shape[1] - 1):
            continue
        if m.sum() < MIN_FLECK:
            continue
        schrift |= m

    schrift = ndi.binary_fill_holes(schrift)
    schrift = ndi.binary_dilation(schrift, ndi.generate_binary_structure(2, 2),
                                  iterations=SAUM)
    return schrift, ~hell


def fuellen(im, rechteck, rng):
    x0, y0, x1, y1 = rechteck
    schrift, band = masken(im, rechteck)
    teil = im[y0:y1, x0:x1]
    H, B, _ = teil.shape

    # Die Schrift hat einen weichen Saum, der das Band ringsum leicht
    # abdunkelt. Als Referenz taugen deshalb nur Punkte, die WEITER weg
    # liegen - sonst zieht der Saum die Fuellung zu dunkel und die
    # Retusche zeichnet sich als Schatten in Schriftform ab.
    # GEFUELLT WIRD DIE GANZE BANDEROLE, nicht nur die Schrift. Ein
    # Flicken in Schriftform faellt immer auf, egal wie gut er getroffen
    # ist - das Auge findet die Kante. Wird die ganze Flaeche neu
    # aufgebaut, gibt es keine Kante im Inneren. Aussen deckt sie sich mit
    # dem Rand der Banderole, und der ist ohnehin eine harte Kante.
    # Was NICHT gefuellt wird: die Folie. Sie haengt am Rand des
    # Vierecks. Alles andere ausserhalb der Bandmaske sind Reste, die die
    # Schrifterkennung nicht erwischt hat - der Zierstrich zum Beispiel.
    # Die sollen mit weg, also gehoeren sie in die Fuellung.
    lab, n = ndi.label(~band, structure=np.ones((3, 3)))
    aussen = np.zeros_like(band)
    for i in range(1, n + 1):
        m = lab == i
        ys, xs = np.where(m)
        if (ys.min() == 0 or xs.min() == 0
                or ys.max() == m.shape[0] - 1 or xs.max() == m.shape[1] - 1):
            aussen |= m
    fuellen_maske = ndi.binary_closing(band, scheibe(SAUM_FUELL))
    fuellen_maske &= ~ndi.binary_dilation(aussen, scheibe(2))
    referenz = band & ~ndi.binary_dilation(schrift, scheibe(SAUM_REF))
    if referenz.sum() < 400 or not fuellen_maske.any():
        return 0, schrift

    # Flaeche 3. Grades durch die Referenzpunkte. Die Banderole ist eine
    # gewoelbte, glatte Flaeche - dafuer reicht das, und anders als eine
    # spaltenweise Fuellung erzeugt es keine senkrechten Streifen.
    yy, xx = np.mgrid[0:H, 0:B].astype(np.float32)
    u, v = xx / (B - 1) * 2 - 1, yy / (H - 1) * 2 - 1
    A = np.stack([(u ** i * v ** j).ravel()
                  for i in range(4) for j in range(4) if i + j <= 3], 1)
    r = referenz.ravel()
    flaeche = np.stack([(A @ np.linalg.lstsq(A[r], teil[..., c].ravel()[r],
                                             rcond=None)[0]).reshape(H, B)
                        for c in range(3)], -1)
    # Korn nur aus der hohen Frequenz, sonst geht der Fehler der
    # Flaechenanpassung als Rauschen mit ein und die Fuellung grieselt.
    rest = teil - ndi.uniform_filter(teil, size=(7, 7, 1))
    korn = float(np.std(rest[referenz]))

    m = fuellen_maske
    teil[m] = flaeche[m] + rng.normal(0.0, korn, size=(int(m.sum()), 3))
    return int(m.sum()), schrift


def main():
    schreiben = "--schreiben" in sys.argv
    rng = np.random.default_rng(11)
    for n, rechtecke in FLAECHEN.items():
        p = ORDNER / f"{n}.png"
        im = np.asarray(Image.open(p).convert("RGB"), dtype=np.float32).copy()
        pruef = im.copy()
        gesamt = 0
        for r in rechtecke:
            anz, schrift = fuellen(im, r, rng)
            gesamt += anz
            pruef[r[1]:r[3], r[0]:r[2]][schrift] = [255, 40, 40]
            print(f"  {n}  Flaeche x {r[0]:4d}..{r[2]:4d} y {r[1]:4d}..{r[3]:4d}  "
                  f"{anz:5d} Bildpunkte ersetzt")
        print(f"{n}: {gesamt} Bildpunkte in {len(rechtecke)} Banderolen")
        if schreiben:
            Image.fromarray(np.clip(im + 0.5, 0, 255).astype(np.uint8)).save(p)
            print(f"  geschrieben: {p.name}")
        else:
            Image.fromarray(np.clip(pruef, 0, 255).astype(np.uint8)).save(
                f"/tmp/pruef-{n}.png")


if __name__ == "__main__":
    main()
