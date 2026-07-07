import "server-only";
import { cookies } from "next/headers";

// Warenkorb-ID liegt in einem httpOnly-Cookie. Next 16: cookies() ist async.

const CART_COOKIE = "buttje_cart_id";

export async function getCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value;
}

export async function setCartId(id: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    // Prod: nur ueber HTTPS. Dev (http://localhost): ohne Secure-Flag,
    // sonst verwirft WebKit/Safari das Cookie und der Warenkorb bleibt leer.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 Tage
  });
}
