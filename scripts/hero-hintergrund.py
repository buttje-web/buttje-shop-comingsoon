#!/usr/bin/env python3
"""
Hintergrund des Hero-Motivs vollstaendig ersetzen.

  python3 scripts/hero-hintergrund.py

Quelle:   public/hero/hero-mit-aufdruck.png
Ergebnis: public/hero/hero-final.png

Der alte Studiohintergrund (violetter Farbstich, Vignette, schwarze
Fehlflaeche oben links) wird nicht retuschiert, sondern verworfen und durch
eine gerechnete Flaeche ersetzt. Frau und Gegenstaende bleiben an
derselben Stelle, in derselben Groesse, Farbe, Helligkeit und Kontrast.
Schlagschatten und Bodenspiegelungen wandern mit.

ABLAUF
  1. Modell des ALTEN Hintergrunds
     Der Studiohintergrund ist ein glattes Feld. Ein Polynom 5. Grades je
     Kanal, robust gefittet (Ausreisser = Vordergrund werden runden-weise
     verworfen), beschreibt ihn auf etwa zwei Tonwerte genau. Die schwarze
     Fehlflaeche wird ausgeschlossen: dort steht keine Hintergrundinformation.

  2. Neuer Hintergrund
     Grundton exakt #0e0e12, darauf ein sehr weicher, neutraler Abfall von
     der Bildmitte nach aussen und im unteren Bilddrittel eine Bodenflaeche,
     die minimal heller ist als die Wand. Der Uebergang laeuft ueber 240 px
     — es gibt keine Horizontlinie.

  3. Uebertragung statt Ausschneiden
     Fuer jeden Bildpunkt gilt

         ergebnis = alpha * original + (1 - alpha) * uebertrag

     alpha ist die Deckung des Vordergrunds. In den Objekten ist alpha = 1,
     dort bleibt das Original bitgenau erhalten. Im freien Hintergrund ist
     alpha = 0.

     uebertrag traegt alles, was NICHT zum glatten Hintergrund gehoert, auf
     die neue Flaeche:
         heller als der alte Hintergrund -> additiv   (Spiegelungen,
                                                       Streulicht)
         dunkler                         -> multiplikativ (Schatten)
     Beide Zweige treffen sich bei "gleich hell" exakt im neuen Grundton,
     der Uebergang ist stetig. Genau daher entsteht an den Kanten kein
     heller und kein dunkler Saum: ein halb gedecktes Haar wird nicht
     freigestellt, sondern auf dem neuen Grund neu aufgebaut.

  4. alpha
     alpha ist das Maximum aus
        - einer weichen Rampe ueber dem Abstand zum alten Hintergrund
          (deckt alle deutlich helleren oder dunkleren Stellen ab) und
        - einer Kernmaske fuer die Objekte, die die Rampe allein nicht
          traegt (dunkle Sackerlfolie, Handschuhe, Schuhe).
     Die Kernmaske wird um Bodenspiegelungen bereinigt: heller Bereich
     unterhalb des tiefsten kraeftigen Punktes derselben Bildspalte ist
     Spiegelung, nicht Gegenstand.

Abhaengigkeiten: pillow, numpy, scipy
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "public/hero/hero-mit-aufdruck.png"
ZIEL = WURZEL / "public/hero/hero-final.png"

# Seitengrund des Shops, --base in app/globals.css
GRUNDTON = np.array([0x0E, 0x0E, 0x12], dtype=np.float32)

ABFALL_MITTE = 0.060   # Helligkeitsabfall von der Bildmitte nach aussen
ABFALL_BODEN = 0.055   # Boden gegenueber der Wand
# Summe im Extremfall 1.076, also hoechstens 7,6 Prozent ueber dem Grundton.

BODEN_VON, BODEN_BIS = 660, 900   # weicher Uebergang Wand -> Boden in px

# Schwarze Fehlflaeche oben links, eingemessen: harte Kante bei x=407 / y=419.
# Der Ersatz greift ein paar Pixel darueber hinaus, sonst bleibt die dunkle
# Kante als Strich stehen; danach laeuft er ueber FEHL_WEICH px aus.
FEHL_X, FEHL_Y, FEHL_WEICH = 412, 424, 10

# Umkreis um die Gegenstaende, in dem Streulicht und Schatten des Originals
# uebernommen werden. Weiter draussen wird das Feld des alten Hintergrunds
# restlos herausgerechnet — dort steht nur der neue Grundton.
NAH, FERN = 60, 260

KORN = 1.3   # Streuung des gerechneten Korns, gemessen am Korn des Originals


def scheibe(r):
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return xx * xx + yy * yy <= r * r


def glatt(t):
    """smoothstep, 0..1 mit waagrechter Tangente an beiden Enden."""
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def alter_hintergrund(im, fehl, grad=5, runden=8):
    """Robuster Polynomfit des alten Studiohintergrunds."""
    H, W, _ = im.shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    u = xs / (W - 1) * 2 - 1
    v = ys / (H - 1) * 2 - 1
    A = np.stack([(u ** i * v ** j).ravel()
                  for i in range(grad + 1) for j in range(grad + 1) if i + j <= grad], 1)

    # Startmenge: Bildbereiche, in denen sicher kein Gegenstand steht.
    saat = ((xs > 1420) | ((ys < 380) & (xs > 430)) | ((xs < 60) & (ys > 430))) & ~fehl
    gueltig = saat.ravel().copy()

    bg = None
    for _ in range(runden):
        bg = np.stack([(A @ np.linalg.lstsq(A[gueltig], im[..., c].ravel()[gueltig],
                                            rcond=None)[0]).reshape(H, W) for c in range(3)], -1)
        abstand = np.linalg.norm(im - bg, axis=2)
        rest = np.median(abstand[saat])
        gueltig = ((abstand < max(3.0 * rest, 5.0)) & ~fehl).ravel()
    print(f"  Hintergrundmodell: Restabweichung im freien Feld {rest:.2f} von 255")
    return bg


def kernmaske(im, bg, fehl):
    """Deckende Objekte. Bewusst grosszuegig, aber ohne Bodenspiegelungen."""
    H, W, _ = im.shape
    ys = np.mgrid[0:H, 0:W][0]
    sig = im.mean(2) - bg.mean(2)

    roh = (sig > 28) | ((sig < -14) & ~fehl)
    roh = ndi.binary_closing(roh, scheibe(5))
    roh = ndi.binary_fill_holes(roh)
    roh = ndi.binary_opening(roh, scheibe(3))

    # Bodenspiegelung: heller Bereich unterhalb des tiefsten kraeftigen
    # Punktes derselben Spalte. Ein Gegenstand, der hell genug ist, um
    # gespiegelt zu werden, hat in seiner eigenen Spalte immer einen
    # kraeftigen Punkt — die Spiegelung darunter hat keinen.
    stark = sig > 45
    tiefste = np.where(stark.any(0), (H - 1) - stark[::-1].argmax(0), H)
    roh &= ~((ys > tiefste[None, :] + 12) & (sig > 0))

    # Was nirgends deutlich vom Hintergrund abweicht, ist Schatten, nicht Ding.
    lab, n = ndi.label(roh)
    behalten = np.zeros_like(roh)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() >= 600 and np.percentile(np.abs(sig[m]), 98) > 28:
            behalten |= m
    return ndi.binary_fill_holes(behalten)


def neuer_hintergrund(H, W):
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    dx = (xs - (W - 1) / 2) / ((W - 1) / 2)
    dy = (ys - (H - 1) / 2) / ((H - 1) / 2)
    r = np.clip(np.hypot(dx, dy) / np.sqrt(2.0), 0.0, 1.0)
    mitte = 0.5 * (1.0 + np.cos(np.pi * r))            # 1 in der Mitte, 0 in der Ecke
    boden = glatt((ys - BODEN_VON) / (BODEN_BIS - BODEN_VON))
    gewinn = 1.0 + ABFALL_MITTE * mitte + ABFALL_BODEN * boden
    print(f"  neuer Hintergrund: Aufhellung {gewinn.min():.3f} bis {gewinn.max():.3f}")
    return GRUNDTON[None, None, :] * gewinn[..., None]


def main():
    im = np.asarray(Image.open(QUELLE).convert("RGB"), dtype=np.float32)
    H, W, _ = im.shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)

    fehl_hart = (xs < FEHL_X) & (ys < FEHL_Y)
    alt = alter_hintergrund(im, fehl_hart)
    neu = neuer_hintergrund(H, W)

    sig = im.mean(2) - alt.mean(2)
    kern = kernmaske(im, alt, fehl_hart)
    print(f"  Kernmaske: {kern.mean() * 100:.1f} Prozent der Bildflaeche")

    # Weiche Kante. 1,2 px reichen: die Rampe unten macht den Uebergang
    # ohnehin stufenlos, ein breiterer Saum wuerde Haare aufweichen.
    a_kern = np.asarray(Image.fromarray((kern * 255).astype(np.uint8))
                        .filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255.0
    a_rampe = glatt((np.abs(sig) - 14.0) / (65.0 - 14.0))
    alpha = np.maximum(a_kern, a_rampe)

    # Restfeld des alten Hintergrunds. Das Polynom trifft die Wand auf etwa
    # zwei Tonwerte genau, der Rest ist eine sehr grosszuegige Welle — genau
    # der Farbstich, der verschwinden soll. Sie wird aus dem freien Feld
    # geschaetzt und dem Modell zugeschlagen.
    # ABER: nur weit weg von den Gegenstaenden. In ihrer Naehe steckt in
    # demselben Restfeld das Streulicht und der weiche Schatten — das soll
    # bleiben.
    abstand = ndi.distance_transform_edt(~kern)
    frei = (alpha < 0.05) & ~fehl_hart & (abstand > NAH)
    fm = frei.astype(np.float32)
    zaehler = ndi.gaussian_filter(( im - alt) * fm[..., None], (80, 80, 0))
    nenner = ndi.gaussian_filter(fm, 80)
    korrektur = zaehler / np.maximum(nenner, 1e-4)[..., None]
    alt = alt + korrektur * glatt((abstand - NAH) / (FERN - NAH))[..., None]

    sig = im.mean(2) - alt.mean(2)
    alpha = np.maximum(alpha, glatt((np.abs(sig) - 14.0) / (65.0 - 14.0)))[..., None]

    # Uebertrag.
    #   additiv        neu + (original - alt)
    #     richtig fuer alles, was Licht HINZUFUEGT: Spiegelungen im Boden,
    #     Streulicht von den Kartons auf die Wand. Traegt die Farbe des
    #     Reflexes mit und ist im freien Feld verzerrungsfrei.
    #   multiplikativ  neu * (Helligkeit original / Helligkeit alt)
    #     richtig fuer alles, was Licht WEGNIMMT: Schlagschatten. Additiv
    #     gerechnet wuerde ein tiefer Schatten ins Negative laufen.
    #     Bewusst ueber die Helligkeit, nicht kanalweise: der alte Grund hat
    #     im Gruenkanal kaum Wert, kanalweise geteilt wuerde jedes Koernchen
    #     dort um das Doppelte verstaerkt — genau der Farbstich, der weg soll.
    # Umgeschaltet wird nicht hart, sondern ueber eine Rampe: erst ab einer
    # echten Abdunklung uebernimmt der multiplikative Zweig ganz.
    hell_alt = np.maximum(alt.mean(2), 1e-3)
    verh = np.clip(im.mean(2) / hell_alt, 0.0, 1.0)[..., None]
    schatten = glatt((-sig - 3.0) / (15.0 - 3.0))[..., None]
    uebertrag = (1.0 - schatten) * (neu + (im - alt)) + schatten * (neu * verh)

    # Die Fehlflaeche traegt keine verwertbare Information. Dort steht der
    # neue Hintergrund pur, mit gerechnetem Korn statt des Korns des
    # Originals, damit die Naht nicht als saubere Flaeche auffaellt.
    rng = np.random.default_rng(7)
    korn = rng.normal(0.0, KORN, size=(H, W, 3)).astype(np.float32)
    f = np.minimum(glatt((FEHL_X + FEHL_WEICH - xs) / FEHL_WEICH),
                   glatt((FEHL_Y + FEHL_WEICH - ys) / FEHL_WEICH))[..., None]
    uebertrag = uebertrag * (1 - f) + (neu + korn) * f
    # In der Fehlflaeche darf auch kein Rest des Originals durchkommen:
    # sie ist gleichmaessig schwarz und wuerde die Flaeche zuziehen.
    alpha = alpha * (1 - f)

    erg = alpha * im + (1 - alpha) * uebertrag

    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(erg + 0.5, 0, 255).astype(np.uint8)).save(ZIEL)
    print("geschrieben:", ZIEL)


if __name__ == "__main__":
    main()
