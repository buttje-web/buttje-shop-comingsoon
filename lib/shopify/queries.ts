// GraphQL-Fragmente und -Operationen fuer die Storefront-API.

const MONEY_FRAGMENT = `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice { ...Money }
      maxVariantPrice { ...Money }
    }
    spitzname: metafield(namespace: "custom", key: "spitzname") { value }
    teaser: metafield(namespace: "custom", key: "teaser") { value }
    ve: metafield(namespace: "custom", key: "ve") { value }
  }
  ${MONEY_FRAGMENT}
`;

// Suchindex: kompakte Felder fuer die client-seitige Suche (alle Produkte).
export const SEARCH_INDEX_QUERY = `
  query SearchIndex($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
          title
          description
          vendor
          tags
          featuredImage { url altText }
          teaser: metafield(namespace: "custom", key: "teaser") { value }
          ve: metafield(namespace: "custom", key: "ve") { value }
          variants(first: 1) {
            edges { node { sku } }
          }
        }
      }
    }
  }
`;

// Produktliste (fuer Listen-/Kategorie-Seite). Optionaler Filter (z.B. Kategorie-Tag).
export const PRODUCTS_QUERY = `
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node { ...ProductCard }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

// Einzelnes Produkt per Handle (Produktdetailseite).
export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCard
      vendor
      descriptionHtml
      langtext: metafield(namespace: "custom", key: "langtext") { value }
      images(first: 8) {
        edges { node { url altText width height } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            sku
            barcode
            price { ...Money }
            selectedOptions { name value }
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

// --- Cart-API ---

export const CART_FRAGMENT = `
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...Money }
      totalAmount { ...Money }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product { title handle featuredImage { url altText } }
              price { ...Money }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...Cart }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_QUERY = `
  query Cart($id: ID!) {
    cart(id: $id) { ...Cart }
  }
  ${CART_FRAGMENT}
`;
