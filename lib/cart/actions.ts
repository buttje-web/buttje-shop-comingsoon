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
import type { Cart } from "@/lib/shopify/types";
import { getCartId, setCartId } from "./cookies";
import { UID_ATTRIBUT } from "@/app/lib/uid";

/**
 * Legt eine Variante in den Warenkorb. Erstellt bei Bedarf einen neuen Cart
 * (Storefront Cart-API) und merkt sich die Cart-ID im Cookie.
 * Gibt die neue Gesamtmenge zurueck (fuer den Zaehler im Header).
 *
 * SELBSTHEILUNG: Ein Cookie kann auf einen Warenkorb zeigen, den es nicht
 * mehr gibt — nach abgeschlossener Bestellung oder nach Ablauf. Das Cookie
 * laeuft 14 Tage, der Warenkorb wird frueher verworfen. Frueher lief das in
 * einen Serverfehler: Der Kunde konnte in diesem Browser dauerhaft nichts
 * mehr in den Warenkorb legen, ohne Aussicht auf Besserung, weil das Cookie
 * sich nie selbst korrigiert hat. Jetzt wird in diesem Fall stillschweigend
 * ein neuer Warenkorb angelegt.
 */
export async function addItem(
  merchandiseId: string,
  quantity = 1,
): Promise<number> {
  const lines = [{ merchandiseId, quantity }];
  const existingId = await getCartId();

  let cart: Cart | null = null;
  if (existingId) {
    try {
      cart = await addCartLines(existingId, lines);
    } catch (e) {
      // Nur den bekannten Fall abfangen. Netzfehler und echte Stoerungen
      // muessen weiterhin durchschlagen, sonst verdeckt die Selbstheilung
      // Probleme, die man sehen will.
      if (!(e instanceof WarenkorbWegError)) throw e;
    }
  }

  if (!cart) {
    cart = await createCart(lines);
    await setCartId(cart.id);
  }

  revalidatePath("/warenkorb");
  return cart.totalQuantity;
}

/**
 * Menge einer Position setzen. Gibt die neue Gesamtmenge zurueck.
 * Ist der Warenkorb weg, ist er leer — 0 statt Serverfehler.
 */
export async function updateItem(lineId: string, quantity: number): Promise<number> {
  const id = await getCartId();
  if (!id) return 0;
  try {
    const cart = await updateCartLines(id, [{ id: lineId, quantity }]);
    revalidatePath("/warenkorb");
    return cart.totalQuantity;
  } catch (e) {
    if (!(e instanceof WarenkorbWegError)) throw e;
    revalidatePath("/warenkorb");
    return 0;
  }
}

/**
 * Position entfernen. Gibt die neue Gesamtmenge zurueck.
 * Ist der Warenkorb weg, ist er leer — 0 statt Serverfehler.
 */
export async function removeItem(lineId: string): Promise<number> {
  const id = await getCartId();
  if (!id) return 0;
  try {
    const cart = await removeCartLines(id, [lineId]);
    revalidatePath("/warenkorb");
    return cart.totalQuantity;
  } catch (e) {
    if (!(e instanceof WarenkorbWegError)) throw e;
    revalidatePath("/warenkorb");
    return 0;
  }
}

/** Aktuellen Warenkorb laden (oder null, wenn keiner existiert). */
export async function loadCart(): Promise<Cart | null> {
  const id = await getCartId();
  if (!id) return null;
  return getCart(id);
}

// Der Attributname steht in app/lib/uid.ts — eine "use server"-Datei darf
// nur async-Funktionen exportieren.

/**
 * Setzt oder entfernt die UID als Bestell-Attribut am Warenkorb.
 *
 * Leerer Wert => Attribut faellt weg. cartAttributesUpdate ersetzt immer die
 * komplette Attributliste, deshalb wird hier bewusst nur dieses eine Attribut
 * gesetzt: der Warenkorb fuehrt sonst keine.
 *
 * Fehler werden geschluckt. Das Attribut ist eine Beigabe — es darf den Weg
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
