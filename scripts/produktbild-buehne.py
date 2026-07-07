"""Komposit-Pipeline "Buehne": Freisteller + inszenierter dunkler Hintergrund.

Schritte:
1. rembg (isnet-general-use), Loecher fuellen ausser echten Durchblicken
   (Kriterium: Roh-Alpha-Mittel < 30 = Modell sicher Hintergrund)
2. Buehne: near-black Verlauf, Spotlight-Kegel, Bodenflaeche mit Lichtpool,
   Reflexion, Kontaktschatten, dezente Lichtkante oben
3. Export 2048x2048 (1:1) und 1080x1920 (9:16)
"""
import os
import numpy as np
import cv2
from PIL import Image, ImageFilter
from rembg import remove, new_session

SRC = "/Users/buttje/buttje-shop/produktbilder-roh/STE-106123.jpg"
OUT_DIR = "/Users/buttje/buttje-shop/produktbilder-buehne"
D = "/private/tmp/claude-501/-Users-buttje/6177e0f1-43c3-417d-9f13-985fd57691bf/scratchpad"
os.makedirs(OUT_DIR, exist_ok=True)

BG_TOP = np.array([22, 22, 28], dtype=np.float32)      # #16161C leicht heller oben
BG_BOTTOM = np.array([10, 10, 13], dtype=np.float32)   # dunkler unten (Basis #0E0E12)


# ---------------------------------------------------------------- Freisteller
def freistellen():
    session = new_session("isnet-general-use")
    img = Image.open(SRC).convert("RGB").resize((1600, 1600), Image.LANCZOS)
    rgb = np.array(img)

    cut = remove(img, session=session, alpha_matting=False, post_process_mask=False)
    alpha = np.array(cut)[:, :, 3].astype(np.float32)
    mask = (alpha > 127).astype(np.uint8)

    inv = 1 - mask
    n, labels, stats, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    h, w = mask.shape
    filled = mask.copy()
    for i in range(1, n):
        x, y, ww, hh, area = stats[i]
        if x == 0 or y == 0 or x + ww == w or y + hh == h:
            continue  # beruehrt Rand = echter Hintergrund
        if alpha[labels == i].mean() < 30:
            continue  # Modell sicher: echter Durchblick (Griffloch)
        filled[labels == i] = 1  # Fehlmaske (z.B. weisses Etikett) fuellen

    m = cv2.erode((filled * 255).astype(np.uint8), np.ones((3, 3), np.uint8), 1)
    m = cv2.GaussianBlur(m.astype(np.float32), (5, 5), 1.2)
    out = np.dstack([rgb, np.clip(m, 0, 255).astype(np.uint8)])
    Image.fromarray(out).save(f"{D}/STE-106123_cutout_final.png")
    return Image.fromarray(out)


# ---------------------------------------------------------------- Buehne
def baue_buehne(cut, W, H):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    # --- Hintergrund: vertikaler Verlauf near-black
    t = (yy / H)[..., None]
    bg = BG_TOP * (1 - t) + BG_BOTTOM * t

    # --- Produkt skalieren/platzieren
    a = np.array(cut)
    ys, xs = np.nonzero(a[:, :, 3] > 8)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    prod = cut.crop((x0, y0, x1 + 1, y1 + 1))
    pw, ph = prod.size

    target_h = int(H * (0.66 if W == H else 0.50))
    scale = target_h / ph
    tw, th = int(pw * scale), target_h
    prod = prod.resize((tw, th), Image.LANCZOS)
    px = (W - tw) // 2
    floor_y = int(H * 0.80)           # Standlinie
    py = floor_y - th

    cx = px + tw / 2

    # --- Spotlight-Kegel von oben (hinter dem Produkt)
    # kegelfoermig: oben schmal, nach unten breiter; sanfter Falloff
    apex_y = -H * 0.15
    spread = 0.38 * W * ((yy - apex_y) / H)          # Kegelbreite waechst mit y
    spread = np.maximum(spread, 1)
    dx = np.abs(xx - cx)
    cone = np.exp(-0.5 * (dx / spread) ** 2)
    fade = np.clip(1.15 - yy / (floor_y * 1.15), 0, 1)  # nach unten ausblenden
    spot = cone * fade
    bg += spot[..., None] * np.array([34, 34, 40], dtype=np.float32)

    # --- Boden: dunkle Flaeche mit elliptischem Lichtpool
    floor = (yy > floor_y).astype(np.float32)
    floor_soft = cv2.GaussianBlur(floor, (0, 0), 6)
    bg *= (1 - 0.35 * floor_soft[..., None])          # Boden etwas absetzen (dunkler)
    ex = (xx - cx) / (0.42 * W)
    ey = (yy - floor_y) / (0.06 * H)
    pool = np.exp(-(ex ** 2 + ey ** 2)) * (yy >= floor_y)
    bg += pool[..., None] * np.array([26, 26, 31], dtype=np.float32)

    # Dithering gegen Banding in den dunklen Verlaeufen
    rng = np.random.default_rng(106123)
    bg += rng.normal(0, 1.1, bg.shape).astype(np.float32)
    stage = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8))

    # --- Reflexion (gespiegelt, weichgezeichnet, auslaufend)
    refl = prod.transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(5))
    ra = np.array(refl).astype(np.float32)
    grad = np.linspace(0.18, 0.0, ra.shape[0]) ** 1.4  # oben 18 %, schnell auslaufend
    ra[:, :, 3] *= grad[:, None] * (255 / max(ra[:, :, 3].max(), 1)) * ra[:, :, 3].max() / 255
    ra[:, :, 3] = np.array(refl)[:, :, 3] * grad[:, None]
    refl = Image.fromarray(ra.astype(np.uint8))
    stage.paste(refl, (px, floor_y), refl)

    # --- Kontaktschatten unter dem Kanister
    sh = Image.new("L", (W, H), 0)
    sh_np = np.zeros((H, W), np.float32)
    sx = (xx - cx) / (0.46 * tw)
    sy = (yy - floor_y) / (0.022 * H)
    sh_np = np.exp(-(sx ** 2 + sy ** 2)) * 0.62
    shadow = Image.fromarray((sh_np * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
    black = Image.new("RGB", (W, H), (0, 0, 0))
    stage.paste(black, (0, 0), shadow)

    # --- Produkt aufsetzen
    stage.paste(prod, (px, py), prod)

    # --- Dezente Lichtkante an der Oberkante
    pa = np.array(prod)[:, :, 3].astype(np.float32) / 255
    shifted = np.roll(pa, 7, axis=0); shifted[:7] = 0
    rim = np.clip(pa - shifted, 0, 1)
    rim = cv2.GaussianBlur(rim, (0, 0), 2.5)
    rim_row = np.zeros((th, tw), np.float32)
    rim_row[: int(th * 0.30)] = 1                      # nur oberes Drittel
    rim = rim * cv2.GaussianBlur(rim_row, (0, 0), 25) * 0.30
    rim_img = Image.fromarray((np.clip(rim, 0, 1) * 255).astype(np.uint8))
    warm = Image.new("RGB", (tw, th), (235, 236, 244))
    stage.paste(warm, (px, py), rim_img)

    return stage


cut = freistellen()
master = baue_buehne(cut, 2048, 2048)
master.save(f"{OUT_DIR}/STE-106123_buehne_2048.jpg", quality=92)
story = baue_buehne(cut, 1080, 1920)
story.save(f"{OUT_DIR}/STE-106123_buehne_1080x1920.jpg", quality=92)

# Vorschau fuers Terminal
master.resize((800, 800), Image.LANCZOS).save(f"{D}/preview_1x1.jpg", quality=88)
story.resize((450, 800), Image.LANCZOS).save(f"{D}/preview_9x16.jpg", quality=88)
print("fertig:", OUT_DIR)
