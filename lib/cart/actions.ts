"use server";

import { revalidatePath } from "next/cache";
import {
  addCartLines,
  createCart,
  getCart,
  updateCartLines,
  removeCartLines,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import { getCartId, setCartId } from "./cookies";

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
