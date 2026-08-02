"use server";

import { revalidatePath } from "next/cache";
import {
  addCartLines,
  createCart,
  getCart,
  updateCartLines,
  removeCartLines,
  updateCartAttributes,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import { getCartId, setCartId } from "./cookies";
import { UID_ATTRIBUT } from "@/app/lib/uid";

/**
 * Legt eine Variante in den Warenkorb. Erstellt bei Bedarf einen neuen Cart
 * (Storefront Cart-API) und merkt sich die Cart-ID im Cookie.
 * Gibt die neue Gesamtmenge zurueck (fuer den Zaehler im Header).
 */
export async function addItem(
  merchandiseId: string,
  quantity = 1,
): Promise<number> {
  const lines = [{ merchandiseId, quantity }];
  const existingId = await getCartId();

  let cart: Cart;
  if (existingId) {
    cart = await addCartLines(existingId, lines);
  } else {
    cart = await createCart(lines);
    await setCartId(cart.id);
  }

  revalidatePath("/warenkorb");
  return cart.totalQuantity;
}

/** Menge einer Position setzen. Gibt die neue Gesamtmenge zurueck. */
export async function updateItem(lineId: string, quantity: number): Promise<number> {
  const id = await getCartId();
  if (!id) return 0;
  const cart = await updateCartLines(id, [{ id: lineId, quantity }]);
  revalidatePath("/warenkorb");
  return cart.totalQuantity;
}

/** Position entfernen. Gibt die neue Gesamtmenge zurueck. */
export async function removeItem(lineId: string): Promise<number> {
  const id = await getCartId();
  if (!id) return 0;
  const cart = await removeCartLines(id, [lineId]);
  revalidatePath("/warenkorb");
  return cart.totalQuantity;
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
