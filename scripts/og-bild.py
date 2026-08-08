#!/usr/bin/env python3
"""Erzeugt das Vorschaubild fuer geteilte Links: public/og/og-standard.jpg.

QUELLE  public/hero/hero-final-v2.png (1678 x 937)
ZIEL    public/og/og-standard.jpg, 1200 x 630 - das Mass, das die
        grossen Plattformen erwarten.

AUSSCHNITT: Das Ziel ist mit 1,905 breiter als die Quelle mit 1,791. Es
muss also Hoehe weg, nicht Breite - und zwar genau 56 Bildpunkte. Die
volle Breite bleibt, weil links die Ware und rechts die Figur steht; ein
seitlicher Schnitt wuerde eines von beiden verlieren. Die 56 Punkte gehen
zu 40 oben und 16 unten, damit ueber dem Kopf und unter den Fuessen Luft
bleibt.

KI-KENNZEICHNUNG, EINGEBRANNT: Auf der Seite ist die Kennzeichnung ein
HTML-Element (siehe app/components/KiLabel.tsx). Bei einem geteilten Link
gibt es kein HTML - Facebook, WhatsApp, LinkedIn und Slack zeigen nur die
Bilddatei. Deshalb steht der Hinweis hier IN der Datei. Er ist damit auch
dann sichtbar, wenn das Bild ohne unsere Seite auftaucht.

Groesse: 28 Punkte in einer 1200 Punkte breiten Datei. Die Plattformen
zeigen das Bild je nach Ansicht zwischen etwa 500 und 1200 Punkten Breite;
bei 500 sind daraus noch rund 12 Punkte - dieselbe Groesse, die das Label
auf der Seite hat.

Aufruf: python3 scripts/og-bild.py
"""
from PIL import Image, ImageDraw, ImageFont

QUELLE = "public/hero/hero-final-v2.png"
ZIEL = "public/og/og-standard.jpg"
SCHRIFT = "/System/Library/Fonts/Supplemental/Arial.ttf"

BREITE, HOEHE = 1200, 630
TEXT = "KI-generiert"
SCHRIFTGRAD = 28
RAND = 22          # Abstand des Kastens zur Bildkante
POLSTER_X = 14
POLSTER_Y = 9
# Grundton und Textfarbe wie am Hero: --base #0e0e12, --text #f4f4f6.
# Deckung 0,65 statt 0,55 - das Label steht hier ueber dem hellsten Teil
# des Motivs (Strickjacke) und laesst sich spaeter nicht mehr nachregeln.
KASTEN = (14, 14, 18)
KASTEN_DECKUNG = 0.65
TEXTFARBE = (244, 244, 246)


def leuchtdichte(rgb):
    """Relative Helligkeit nach WCAG."""
    def kanal(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (kanal(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def kontrast(a, b):
    la, lb = leuchtdichte(a), leuchtdichte(b)
    hell, dunkel = max(la, lb), min(la, lb)
    return (hell + 0.05) / (dunkel + 0.05)


def main():
    quelle = Image.open(QUELLE).convert("RGB")
    qb, qh = quelle.size

    # Hoehe auf das Zielverhaeltnis bringen, volle Breite behalten.
    ziel_hoehe = round(qb * HOEHE / BREITE)
    weg = qh - ziel_hoehe
    oben = round(weg * 40 / 56)
    bild = quelle.crop((0, oben, qb, oben + ziel_hoehe))
    bild = bild.resize((BREITE, HOEHE), Image.LANCZOS)
    print(f"Quelle {qb}x{qh} -> Ausschnitt {qb}x{ziel_hoehe} "
          f"(oben {oben}, unten {weg - oben}) -> {BREITE}x{HOEHE}")

    schrift = ImageFont.truetype(SCHRIFT, SCHRIFTGRAD)
    messer = ImageDraw.Draw(bild)
    l, o, r, u = messer.textbbox((0, 0), TEXT, font=schrift)
    tb, th = r - l, u - o

    kb = tb + 2 * POLSTER_X
    kh = th + 2 * POLSTER_Y
    kx = BREITE - RAND - kb
    ky = HOEHE - RAND - kh

    # Kontrast gegen den Bildinhalt AN DIESER STELLE messen, nicht raten.
    hinter = bild.crop((kx, ky, kx + kb, ky + kh))
    import numpy as np
    mittel = tuple(int(round(x)) for x in np.asarray(hinter).reshape(-1, 3).mean(axis=0))
    gemischt = tuple(round(KASTEN[i] * KASTEN_DECKUNG + mittel[i] * (1 - KASTEN_DECKUNG))
                     for i in range(3))
    print(f"Untergrund im Kasten {mittel}, mit Kasten {gemischt}, "
          f"Kontrast zur Schrift {kontrast(gemischt, TEXTFARBE):.2f}:1")

    # Kasten halbdeckend auflegen, dann den Text darauf.
    schicht = Image.new("RGBA", bild.size, (0, 0, 0, 0))
    ImageDraw.Draw(schicht).rectangle(
        [kx, ky, kx + kb, ky + kh],
        fill=(*KASTEN, round(255 * KASTEN_DECKUNG)),
    )
    bild = Image.alpha_composite(bild.convert("RGBA"), schicht).convert("RGB")
    ImageDraw.Draw(bild).text(
        (kx + POLSTER_X - l, ky + POLSTER_Y - o), TEXT,
        font=schrift, fill=TEXTFARBE,
    )

    import os
    os.makedirs(os.path.dirname(ZIEL), exist_ok=True)
    # JPEG statt PNG: 874 KB gegen 137 KB bei einer mittleren Abweichung von
    # 0,88 Tonwerten im dunklen Grund - unter der Schwelle, ab der Banden
    # sichtbar werden. subsampling=0 haelt die Kanten der Schrift scharf.
    # JPEG lesen ausserdem alle Vorschau-Dienste, WebP nicht durchgaengig.
    bild.save(ZIEL, quality=92, subsampling=0, optimize=True)
    print(f"geschrieben: {ZIEL}  {os.path.getsize(ZIEL) / 1024:.0f} KB  "
          f"Kasten {kb}x{kh} bei ({kx},{ky})")


if __name__ == "__main__":
    main()
