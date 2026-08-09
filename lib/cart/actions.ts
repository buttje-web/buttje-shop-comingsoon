"use server";

import { revalidatePath } from "next/cache";
import {
  addCartLines,
  createCart,
  getCart,
  updateCartLines,
  removeCartLines,
  updateCartAttributes,
  WarenkorbWegError,
} from "@/lib/shopify";
import { StorefrontNetzError } from "@/lib/shopify/storefront";
import type { Cart } from "@/lib/shopify/types";
import { getCartId, setCartId } from "./cookies";
import {
  MELDUNG_NICHT_ERREICHBAR,
  MELDUNG_SACKERL_BESETZT,
  type CartErgebnis,
} from "./typen";
import { UID_ATTRIBUT } from "@/app/lib/uid";

/**
 * Legt eine Variante in den Warenkorb. Erstellt bei Bedarf einen neuen Cart
 * (Storefront Cart-API) und merkt sich die Cart-ID im Cookie.
 *
 * DREI FAELLE, die frueher alle in einem Serverfehler endeten:
 *
 * 1. Warenkorb endgueltig weg (Bestellung abgeschlossen, Ablauf). Das
 *    Cookie laeuft 14 Tage und lebt damit laenger als der Warenkorb. Hier
 *    wird still ein neuer angelegt, sonst kaeme der Browser nie wieder aus
 *    der Sackgasse heraus.
 * 2. Warenkorb nur VORUEBERGEHEND nicht auffindbar. Sieht in der Antwort
 *    genauso aus wie Fall 1. Deshalb wird NACHGEFASST: erst noch einmal
 *    lesen, und nur wenn er dann immer noch weg ist, einen neuen anlegen.
 *    Ohne dieses Nachfassen wuerde eine kurze Stoerung einen gefuellten
 *    Warenkorb still wegwerfen - der Kunde stuende ploetzlich bei einer
 *    Position statt bei acht.
 * 3. Gegenstelle nicht erreichbar. Kein neuer Warenkorb, keine
 *    Wiederholung (der Ausgang der abgebrochenen Mutation ist unbekannt),
 *    sondern eine verstaendliche Meldung an den Kunden.
 */
export async function addItem(
  merchandiseId: string,
  quantity = 1,
): Promise<CartErgebnis> {
  const lines = [{ merchandiseId, quantity }];
  const existingId = await getCartId();

  let cart: Cart | null = null;
  if (existingId) {
    try {
      cart = await addCartLines(existingId, lines);
    } catch (e) {
      if (e instanceof StorefrontNetzError) {
        return { ok: false, meldung: MELDUNG_NICHT_ERREICHBAR };
      }
      // Nur den bekannten Fall abfangen. Echte Stoerungen muessen weiterhin
      // durchschlagen, sonst verdeckt die Selbstheilung Probleme, die man
      // sehen will.
      if (!(e instanceof WarenkorbWegError)) throw e;

      // NACHFASSEN: zweite Meinung einholen. getCart wird bei
      // Transportfehlern automatisch wiederholt (lesende Abfrage).
      let zweiteMeinung: Cart | null = null;
      try {
        zweiteMeinung = await getCart(existingId);
      } catch {
        // Auch das Nachfassen scheitert -> Lage unklar. Auf keinen Fall
        // einen neuen Warenkorb anlegen, das koennte den alten verwerfen.
        return { ok: false, meldung: MELDUNG_SACKERL_BESETZT };
      }
      if (zweiteMeinung) {
        // Der Warenkorb existiert doch. Also Fall 2, nicht Fall 1.
        return { ok: false, meldung: MELDUNG_SACKERL_BESETZT };
      }
    }
  }

  if (!cart) {
    try {
      cart = await createCart(lines);
    } catch (e) {
      if (e instanceof StorefrontNetzError) {
        return { ok: false, meldung: MELDUNG_NICHT_ERREICHBAR };
      }
      throw e;
    }
    await setCartId(cart.id);
  }

  revalidatePath("/sackerl");
  return { ok: true, anzahl: cart.totalQuantity };
}

/**
 * Menge einer Position setzen.
 * Warenkorb weg = leer (0). Gegenstelle nicht erreichbar = Meldung.
 */
export async function updateItem(lineId: string, quantity: number): Promise<CartErgebnis> {
  const id = await getCartId();
  if (!id) return { ok: true, anzahl: 0 };
  try {
    const cart = await updateCartLines(id, [{ id: lineId, quantity }]);
    revalidatePath("/sackerl");
    return { ok: true, anzahl: cart.totalQuantity };
  } catch (e) {
    if (e instanceof StorefrontNetzError) {
      return { ok: false, meldung: MELDUNG_NICHT_ERREICHBAR };
    }
    if (!(e instanceof WarenkorbWegError)) throw e;
    revalidatePath("/sackerl");
    return { ok: true, anzahl: 0 };
  }
}

/**
 * Position entfernen.
 * Warenkorb weg = leer (0). Gegenstelle nicht erreichbar = Meldung.
 */
export async function removeItem(lineId: string): Promise<CartErgebnis> {
  const id = await getCartId();
  if (!id) return { ok: true, anzahl: 0 };
  try {
    const cart = await removeCartLines(id, [lineId]);
    revalidatePath("/sackerl");
    return { ok: true, anzahl: cart.totalQuantity };
  } catch (e) {
    if (e instanceof StorefrontNetzError) {
      return { ok: false, meldung: MELDUNG_NICHT_ERREICHBAR };
    }
    if (!(e instanceof WarenkorbWegError)) throw e;
    revalidatePath("/sackerl");
    return { ok: true, anzahl: 0 };
  }
}

/** Aktuellen Warenkorb laden (oder null, wenn keiner existiert). */
export async function loadCart(): Promise<Cart | null> {
  const id = await getCartId();
  if (!id) return null;
  return getCart(id);
}

// Der Attributname steht in app/lib/uid.ts - eine "use server"-Datei darf
// nur async-Funktionen exportieren.

/**
 * Setzt oder entfernt die UID als Bestell-Attribut am Warenkorb.
 *
 * Leerer Wert => Attribut faellt weg. cartAttributesUpdate ersetzt immer die
 * komplette Attributliste, deshalb wird hier bewusst nur dieses eine Attribut
 * gesetzt: der Warenkorb fuehrt sonst keine.
 *
 * Fehler werden geschluckt. Das Attribut ist eine Beigabe - es darf den Weg
 * zur Kassa niemals blockieren, wenn Shopify gerade zickt.
 */
export async function setUidAttribut(uid: string): Promise<boolean> {
  try {
    const id = await getCartId();
    if (!id) return false;
    const wert = uid.trim();
    await updateCartAttributes(id, wert ? [{ key: UID_ATTRIBUT, value: wert }] : []);
    return true;
  } catch {
    return false;
  }
}
