"""Buehne-Batch: alle Rohbilder freistellen + auf Buehne komponieren.

Basis: abgenommener Prototyp scripts/produktbild-buehne.py (STE-106123),
Look-Parameter unveraendert. Ergaenzt um:
- Eingangs-Normalisierung (Alpha auf Weiss flatten, proportional auf
  1600x1600 mit weissem Rand statt Verzerrung)
- Qualitaets-Gate nach Freistellung -> review-needed.txt statt Komposit
- Risiko-Heuristik (besondere-kandidaten.txt)
- Wiederaufnahme: fertige Ausgaben werden uebersprungen
- Kontaktbogen ueber alle 1:1-Ergebnisse

Ausgabe: {SKU}_2048.png (1:1) und {SKU}_1080x1920.png (9:16)
"""
import os
import sys
import traceback
import numpy as np
import cv2
from PIL import Image, ImageFilter, ImageDraw
from rembg import remove, new_session

SRC_DIR = "/Users/buttje/buttje-shop/produktbilder-roh"
# Aufruf: batch.py [modell] [ausgabeordner] — Defaults = v1-Lauf
MODEL = sys.argv[1] if len(sys.argv) > 1 else "isnet-general-use"
OUT_DIR = sys.argv[2] if len(sys.argv) > 2 else "/Users/buttje/buttje-shop/produktbilder-buehne"

BG_TOP = np.array([22, 22, 28], dtype=np.float32)
BG_BOTTOM = np.array([10, 10, 13], dtype=np.float32)

SESSION = None  # wird in main() bzw. vom Importeur via new_session(...) gesetzt


# ------------------------------------------------------------ Eingang
def lade_normalisiert(path):
    """Bild laden, evtl. Alpha auf Weiss flatten, proportional in 1600er-Quadrat."""
    img = Image.open(path)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        white = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(white, img)
    img = img.convert("RGB")
    w, h = img.size
    scale = 1600 / max(w, h)
    img = img.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGB", (1600, 1600), (255, 255, 255))
    canvas.paste(img, ((1600 - img.width) // 2, (1600 - img.height) // 2))
    return canvas


# ------------------------------------------------------------ Freisteller (wie Prototyp)
def freistellen(img):
    rgb = np.array(img)
    cut = remove(img, session=SESSION, alpha_matting=False, post_process_mask=False)
    alpha = np.array(cut)[:, :, 3].astype(np.float32)
    mask = (alpha > 127).astype(np.uint8)

    inv = 1 - mask
    n, labels, stats, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    h, w = mask.shape
    filled = mask.copy()
    echte_loecher = []  # bewusst transparent gelassene Durchblicke
    for i in range(1, n):
        x, y, ww, hh, area = stats[i]
        if x == 0 or y == 0 or x + ww == w or y + hh == h:
            continue
        if alpha[labels == i].mean() < 30:
            echte_loecher.append(int(area))
            continue
        filled[labels == i] = 1

    m = cv2.erode((filled * 255).astype(np.uint8), np.ones((3, 3), np.uint8), 1)
    m = cv2.GaussianBlur(m.astype(np.float32), (5, 5), 1.2)
    out = np.dstack([rgb, np.clip(m, 0, 255).astype(np.uint8)])
    return out, filled, alpha, echte_loecher


# ------------------------------------------------------------ Qualitaets-Gate
def gate(filled, echte_loecher):
    """Liefert (ok, grund) und Kennzahlen fuer die Risiko-Heuristik."""
    h, w = filled.shape
    frac = filled.sum() / (h * w)
    if frac < 0.02:
        return False, f"Maske leer/zu klein ({frac:.1%} der Flaeche)"
    if frac > 0.90:
        return False, f"Maske fast ganzes Bild ({frac:.1%} der Flaeche)"

    n, labels, stats, _ = cv2.connectedComponentsWithStats(filled, connectivity=8)
    areas = sorted(stats[1:, 4], reverse=True)
    if len(areas) > 1 and areas[0] / sum(areas) < 0.85:
        return False, f"Maske fragmentiert (groesstes Teil nur {areas[0] / sum(areas):.0%})"

    ys, xs = np.nonzero(filled)
    bbox_area = (xs.max() - xs.min() + 1) * (ys.max() - ys.min() + 1)
    for a in echte_loecher:
        if a > 0.12 * bbox_area:
            return False, f"grosses Loch im Produktbereich ({a / bbox_area:.0%} der Produktflaeche)"
    return True, ""


def risiko_kennzahlen(alpha, filled, echte_loecher):
    """Heuristik fuer rembg-Risiko: Durchblicke + hoher Halbtransparenz-Anteil."""
    semi = ((alpha > 25) & (alpha < 230)).sum()
    semi_frac = semi / max(filled.sum(), 1)
    gruende = []
    if len([a for a in echte_loecher if a > 500]) > 0:
        gruende.append(f"{len([a for a in echte_loecher if a > 500])} Durchblick(e) im Produkt (Griff/Buegel)")
    if semi_frac > 0.10:
        gruende.append(f"hoher Halbtransparenz-Anteil in der Maske ({semi_frac:.0%})")
    return gruende


# ------------------------------------------------------------ Buehne (wie Prototyp, unveraendert)
def baue_buehne(cut, W, H):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = (yy / H)[..., None]
    bg = BG_TOP * (1 - t) + BG_BOTTOM * t

    a = np.array(cut)
    ys, xs = np.nonzero(a[:, :, 3] > 8)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    prod = cut.crop((x0, y0, x1 + 1, y1 + 1))
    pw, ph = prod.size

    target_h = int(H * (0.66 if W == H else 0.50))
    scale = target_h / ph
    # Breite Produkte: nie an den Bildrand stossen, sonst ueber Breite skalieren
    max_w = int(W * 0.86)
    if pw * scale > max_w:
        scale = max_w / pw
    tw, th = int(pw * scale), int(ph * scale)
    prod = prod.resize((tw, th), Image.LANCZOS)
    px = (W - tw) // 2
    floor_y = int(H * 0.80)
    py = floor_y - th
    cx = px + tw / 2

    apex_y = -H * 0.15
    spread = 0.38 * W * ((yy - apex_y) / H)
    spread = np.maximum(spread, 1)
    dx = np.abs(xx - cx)
    cone = np.exp(-0.5 * (dx / spread) ** 2)
    fade = np.clip(1.15 - yy / (floor_y * 1.15), 0, 1)
    bg += (cone * fade)[..., None] * np.array([34, 34, 40], dtype=np.float32)

    floor = (yy > floor_y).astype(np.float32)
    floor_soft = cv2.GaussianBlur(floor, (0, 0), 6)
    bg *= (1 - 0.35 * floor_soft[..., None])
    ex = (xx - cx) / (0.42 * W)
    ey = (yy - floor_y) / (0.06 * H)
    pool = np.exp(-(ex ** 2 + ey ** 2)) * (yy >= floor_y)
    bg += pool[..., None] * np.array([26, 26, 31], dtype=np.float32)

    rng = np.random.default_rng(106123)
    bg += rng.normal(0, 1.1, bg.shape).astype(np.float32)
    stage = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8))

    refl = prod.transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(5))
    ra = np.array(refl).astype(np.float32)
    grad = np.linspace(0.18, 0.0, ra.shape[0]) ** 1.4
    ra[:, :, 3] = np.array(refl)[:, :, 3] * grad[:, None]
    refl = Image.fromarray(ra.astype(np.uint8))
    stage.paste(refl, (px, floor_y), refl)

    sx = (xx - cx) / (0.46 * tw)
    sy = (yy - floor_y) / (0.022 * H)
    sh_np = np.exp(-(sx ** 2 + sy ** 2)) * 0.62
    shadow = Image.fromarray((sh_np * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
    stage.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), shadow)

    stage.paste(prod, (px, py), prod)

    pa = np.array(prod)[:, :, 3].astype(np.float32) / 255
    shifted = np.roll(pa, 7, axis=0)
    shifted[:7] = 0
    rim = np.clip(pa - shifted, 0, 1)
    rim = cv2.GaussianBlur(rim, (0, 0), 2.5)
    rim_row = np.zeros((th, tw), np.float32)
    rim_row[: int(th * 0.30)] = 1
    rim = rim * cv2.GaussianBlur(rim_row, (0, 0), 25) * 0.30
    rim_img = Image.fromarray((np.clip(rim, 0, 1) * 255).astype(np.uint8))
    stage.paste(Image.new("RGB", (tw, th), (235, 236, 244)), (px, py), rim_img)

    return stage


# ------------------------------------------------------------ Kontaktbogen
def baue_kontaktbogen(out_dir):
    ergebnisse = sorted(f for f in os.listdir(out_dir) if f.endswith("_2048.png"))
    if not ergebnisse:
        return
    CELL, COLS = 280, 7
    rows = -(-len(ergebnisse) // COLS)
    sheet = Image.new("RGB", (COLS * CELL, rows * (CELL + 22)), (14, 14, 18))
    draw = ImageDraw.Draw(sheet)
    for idx, f in enumerate(ergebnisse):
        thumb = Image.open(f"{out_dir}/{f}").resize((CELL, CELL), Image.LANCZOS)
        cx_, cy_ = (idx % COLS) * CELL, (idx // COLS) * (CELL + 22)
        sheet.paste(thumb, (cx_, cy_))
        draw.text((cx_ + 6, cy_ + CELL + 4), f.replace("_2048.png", ""), fill=(190, 190, 200))
    sheet.save(f"{out_dir}/kontaktbogen.jpg", quality=88)


# ------------------------------------------------------------ Batch
EXT = (".jpg", ".jpeg", ".png", ".webp")


def main():
    global SESSION
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Modell: {MODEL} -> {OUT_DIR}", flush=True)
    SESSION = new_session(MODEL)

    dateien = sorted(f for f in os.listdir(SRC_DIR) if f.lower().endswith(EXT))
    review, risiko, fertig, uebersprungen = [], [], [], []

    # Risiko-Eintraege uebersprungener SKUs aus frueheren Laeufen uebernehmen
    bestehende_risiko = {}
    if os.path.exists(f"{OUT_DIR}/besondere-kandidaten.txt"):
        with open(f"{OUT_DIR}/besondere-kandidaten.txt") as f:
            for line in f:
                if line.strip():
                    bestehende_risiko[line.split("\t")[0]] = line.strip()

    # Manuell aussortierte SKUs (Ordner aussortiert/) nicht neu erzeugen
    aus_dir = f"{OUT_DIR}/aussortiert"
    aussortiert = set()
    if os.path.isdir(aus_dir):
        aussortiert = {f.split("_")[0] for f in os.listdir(aus_dir) if f.endswith(".png")}

    for i, fname in enumerate(dateien, 1):
        sku = os.path.splitext(fname)[0]
        out_sq = f"{OUT_DIR}/{sku}_2048.png"
        out_st = f"{OUT_DIR}/{sku}_1080x1920.png"
        if sku in aussortiert:
            review.append(f"{fname}\taussortiert nach visueller Pruefung (Freisteller unbrauchbar)")
            print(f"[{i}/{len(dateien)}] {sku}: aussortiert, uebersprungen", flush=True)
            continue
        if os.path.exists(out_sq) and os.path.exists(out_st):
            uebersprungen.append(sku)
            if fname in bestehende_risiko:
                risiko.append(bestehende_risiko[fname])
            print(f"[{i}/{len(dateien)}] {sku}: schon fertig, uebersprungen", flush=True)
            continue
        try:
            img = lade_normalisiert(f"{SRC_DIR}/{fname}")
            cut, filled, alpha, echte_loecher = freistellen(img)
            ok, grund = gate(filled, echte_loecher)
            if not ok:
                review.append(f"{fname}\t{grund}")
                print(f"[{i}/{len(dateien)}] {sku}: GATE -> {grund}", flush=True)
                continue
            gruende = risiko_kennzahlen(alpha, filled, echte_loecher)
            if gruende:
                risiko.append(f"{fname}\t{'; '.join(gruende)}")
            cut_img = Image.fromarray(cut)
            baue_buehne(cut_img, 2048, 2048).save(out_sq)
            baue_buehne(cut_img, 1080, 1920).save(out_st)
            fertig.append(sku)
            print(f"[{i}/{len(dateien)}] {sku}: ok", flush=True)
        except Exception:
            review.append(f"{fname}\tFehler: {traceback.format_exc(limit=1).splitlines()[-1]}")
            print(f"[{i}/{len(dateien)}] {sku}: FEHLER", flush=True)

    with open(f"{OUT_DIR}/review-needed.txt", "w") as f:
        f.write("\n".join(review) + ("\n" if review else ""))
    with open(f"{OUT_DIR}/besondere-kandidaten.txt", "w") as f:
        f.write("\n".join(risiko) + ("\n" if risiko else ""))

    baue_kontaktbogen(OUT_DIR)

    print(f"\nFERTIG: {len(fertig)} neu, {len(uebersprungen)} uebersprungen, "
          f"{len(review)} Review, {len(risiko)} Risiko-Kandidaten", flush=True)


if __name__ == "__main__":
    main()
