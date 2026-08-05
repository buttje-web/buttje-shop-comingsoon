// Typen fuer die Storefront-API-Antworten (schlank gehalten, bei Bedarf erweitern).

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: Money;
  barcode?: string | null;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  description: string;
  descriptionHtml?: string;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice?: Money };
  images?: Image[];
  variants?: ProductVariant[];
  // Redaktionelle Metafelder (custom.*), koennen null/leer sein
  spitzname?: string | null;
  teaser?: string | null;
  ve?: string | null;
  langtext?: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: { title: string; handle: string; featuredImage: Image | null };
    /** Variantengewicht laut Shopify; null, wenn am Artikel nicht gepflegt. */
    weight: number | null;
    weightUnit: "KILOGRAMS" | "GRAMS" | "POUNDS" | "OUNCES" | null;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};
