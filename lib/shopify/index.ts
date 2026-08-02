import "server-only";
import { storefront } from "./storefront";
import {
  PRODUCTS_QUERY,
  SEARCH_INDEX_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_ATTRIBUTES_UPDATE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from "./queries";
import type { Cart, Product, Image } from "./types";

type Edges<T> = { edges: { node: T }[] };
const unwrap = <T>(c: Edges<T> | null | undefined): T[] =>
  c?.edges?.map((e) => e.node) ?? [];

// Storefront liefert Metafields als { value } | null -> auf string|null flach ziehen.
type MetafieldRef = { value: string } | null;
type RawProduct = Omit<Product, "spitzname" | "teaser" | "ve" | "langtext" | "images" | "variants"> & {
  spitzname?: MetafieldRef;
  teaser?: MetafieldRef;
  ve?: MetafieldRef;
  langtext?: MetafieldRef;
  images?: Edges<Image>;
  variants?: Edges<NonNullable<Product["variants"]>[number]>;
};
const mf = (m: MetafieldRef): string | null => (m && m.value ? m.value : null);

function normalizeProduct(p: RawProduct): Product {
  return {
    ...p,
    spitzname: mf(p.spitzname ?? null),
    teaser: mf(p.teaser ?? null),
    ve: mf(p.ve ?? null),
    langtext: mf(p.langtext ?? null),
    images: unwrap(p.images),
    variants: unwrap(p.variants),
  };
}

/** Produktliste abrufen. Optionaler Storefront-Filter (z.B. "tag:papier"). */
export async function getProducts(first = 48, query?: string): Promise<Product[]> {
  const data = await storefront<{ products: Edges<RawProduct> }>({
    query: PRODUCTS_QUERY,
    variables: { first, query },
    revalidate: 60,
  });
  return unwrap(data.products).map(normalizeProduct);
}

/** Kompakter Suchindex ueber alle aktiven Produkte (fuer die Client-Suche). */
export async function getSearchIndex(): Promise<
  {
    handle: string;
    titel: string;
    sku: string | null;
    vendor: string | null;
    ve: string | null;
    teaser: string | null;
    tags: string[];
    beschreibung: string;
    bild: string | null;
    bildAlt: string | null;
    preis: { amount: string; currencyCode: string } | null;
  }[]
> {
  type Raw = {
    handle: string;
    title: string;
    description: string;
    vendor: string | null;
    tags: string[];
    featuredImage: { url: string; altText: string | null } | null;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } } | null;
    teaser: MetafieldRef;
    ve: MetafieldRef;
    variants: Edges<{ sku: string | null }>;
  };
  const data = await storefront<{ products: Edges<Raw> }>({
    query: SEARCH_INDEX_QUERY,
    variables: { first: 100 },
    revalidate: 300,
  });
  return unwrap(data.products).map((p) => ({
    handle: p.handle,
    titel: p.title,
    sku: unwrap(p.variants)[0]?.sku ?? null,
    vendor: p.vendor ?? null,
    ve: mf(p.ve ?? null),
    teaser: mf(p.teaser ?? null),
    tags: p.tags ?? [],
    beschreibung: (p.description ?? "").slice(0, 400),
    bild: p.featuredImage?.url ?? null,
    bildAlt: p.featuredImage?.altText ?? null,
    preis: p.priceRange?.minVariantPrice ?? null,
  }));
}

/** Produkte einer Kategorie (per Kategorie-Tag). */
export async function getProductsByCategory(tag: string, first = 48): Promise<Product[]> {
  return getProducts(first, `tag:${tag}`);
}

/** Einzelnes Produkt per Handle. null, wenn nicht gefunden. */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await storefront<{ product: RawProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 60,
  });
  return data.product ? normalizeProduct(data.product) : null;
}

type CartMutationResult = {
  cart: Cart | null;
  userErrors: { field: string[] | null; message: string }[];
};

function normalizeCart(cart: (Cart & { lines: Edges<Cart["lines"][number]> }) | null): Cart | null {
  if (!cart) return null;
  return { ...cart, lines: unwrap(cart.lines) };
}

/** Neuen Warenkorb anlegen (optional mit ersten Positionen). */
export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = [],
): Promise<Cart> {
  const data = await storefront<{ cartCreate: CartMutationResult }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
  });
  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(`cartCreate: ${JSON.stringify(userErrors)}`);
  const normalized = normalizeCart(cart as never);
  if (!normalized) throw new Error("cartCreate lieferte keinen Warenkorb.");
  return normalized;
}

/** Positionen zu bestehendem Warenkorb hinzufuegen. */
export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: CartMutationResult }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });
  const { cart, userErrors } = data.cartLinesAdd;
  if (userErrors.length) throw new Error(`cartLinesAdd: ${JSON.stringify(userErrors)}`);
  const normalized = normalizeCart(cart as never);
  if (!normalized) throw new Error("cartLinesAdd lieferte keinen Warenkorb.");
  return normalized;
}

/** Menge einer Position aendern. */
export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: CartMutationResult }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  });
  const { cart, userErrors } = data.cartLinesUpdate;
  if (userErrors.length) throw new Error(`cartLinesUpdate: ${JSON.stringify(userErrors)}`);
  const normalized = normalizeCart(cart as never);
  if (!normalized) throw new Error("cartLinesUpdate lieferte keinen Warenkorb.");
  return normalized;
}

/** Positionen entfernen. */
export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: CartMutationResult }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  });
  const { cart, userErrors } = data.cartLinesRemove;
  if (userErrors.length) throw new Error(`cartLinesRemove: ${JSON.stringify(userErrors)}`);
  const normalized = normalizeCart(cart as never);
  if (!normalized) throw new Error("cartLinesRemove lieferte keinen Warenkorb.");
  return normalized;
}

/**
 * Bestell-Attribute des Warenkorbs setzen (ersetzt die bestehenden).
 *
 * Genutzt fuer die UID-Nummer aus dem Sackerl-Gate. Sie laesst sich im
 * Checkout nicht vorbefuellen, kommt so aber als Attribut an der Bestellung
 * an und ist im Admin sichtbar.
 */
export async function updateCartAttributes(
  cartId: string,
  attributes: { key: string; value: string }[],
): Promise<Cart> {
  const data = await storefront<{ cartAttributesUpdate: CartMutationResult }>({
    query: CART_ATTRIBUTES_UPDATE_MUTATION,
    variables: { cartId, attributes },
  });
  const { cart, userErrors } = data.cartAttributesUpdate;
  if (userErrors.length) throw new Error(`cartAttributesUpdate: ${JSON.stringify(userErrors)}`);
  const normalized = normalizeCart(cart as never);
  if (!normalized) throw new Error("cartAttributesUpdate lieferte keinen Warenkorb.");
  return normalized;
}

/** Warenkorb per ID laden. */
export async function getCart(id: string): Promise<Cart | null> {
  const data = await storefront<{ cart: (Cart & { lines: Edges<Cart["lines"][number]> }) | null }>({
    query: CART_QUERY,
    variables: { id },
  });
  return normalizeCart(data.cart);
}
