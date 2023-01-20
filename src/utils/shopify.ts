const SHOPIFY_SHOP = import.meta.env.PUBLIC_SHOPIFY_SHOP;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env
  .PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2023-01";

export class Shopify {
  apiUrl: string;
  constructor() {
    this.apiUrl = `https://${SHOPIFY_SHOP}/api/${API_VERSION}/graphql.json`;
  }

  async graphQL(
    method: string,
    query: string,
    variables: Record<string, unknown> = {}
  ) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    };

    const response = await fetch(this.apiUrl, config);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${response.status} ${body}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
    }

    return json.data;
  }

  async getProducts() {
    const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle

              variants(first: 10) {
                nodes {
                  id
                  title
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }

              featuredImage {
                url(transform: {preferredContentType: WEBP})
                width
                height
                altText
              }
            }
          }
        }
      }
    `;

    const data = await this.graphQL("POST", query);
    return data;
  }

  async getProductByHandle(handle: string) {
    const query = `
      {
        productByHandle(handle: "${handle}") {
          id
          title
          handle

          variants(first: 10) {
            nodes {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
            }
          }

          featuredImage {
            url(transform: {preferredContentType: WEBP})
            width
            height
            altText
          }
        }
      }
    `;

    const data = await this.graphQL("POST", query);
    return data;
  }

  async createCart(id: FormDataEntryValue, quantity: FormDataEntryValue) {
    const query = `
      mutation {
        cartCreate (input: { lines: [{ merchandiseId: "${id}", quantity: ${quantity} }] }) {
          cart {
            id
            totalQuantity
            checkoutUrl
            lines(first: 100) {
              nodes {
                id
                quantity
                merchandise {
                  ...on ProductVariant {
                    title
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphQL("POST", query);
    return data;
  }

  cartLinesAdd(
    id: string,
    merchandiseId: FormDataEntryValue,
    quantity: FormDataEntryValue
  ) {
    const query = `
      mutation {
        cartLinesAdd (cartId: "${id}", lines: [{ merchandiseId: "${merchandiseId}", quantity: ${quantity} }]) {
          cart {
            id
            totalQuantity
            checkoutUrl
            lines(first: 100) {
              nodes {
                id
                quantity
                merchandise {
                  ...on ProductVariant {
                    title
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const data = this.graphQL("POST", query);
    return data;
  }

  retrieveCart(id: string) {
    const query = `
      {
        cart(id: "${id}") {
          id
          totalQuantity
          checkoutUrl
          lines(first: 100) {
            nodes {
              id
              quantity
              merchandise {
                ...on ProductVariant {
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    title
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const data = this.graphQL("POST", query);
    return data;
  }
}
