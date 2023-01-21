import type { Product, Cart } from "../utils/types";
import {
  ProductsQuery,
  ProductByHandleQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  RetrieveCartQuery,
} from "./graphql";

const SHOPIFY_SHOP = import.meta.env.PUBLIC_SHOPIFY_SHOP;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env
  .PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2023-01";

export class Shopify {
  apiUrl: string;
  constructor() {
    this.apiUrl = `https://${SHOPIFY_SHOP}/api/${API_VERSION}/graphql.json`;
  }

  async graphQL(query: string, variables: Record<string, unknown> = {}) {
    const config = {
      method: "POST",
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

  async getProducts(options = { limit: 10 }) {
    const { limit } = options;
    const data = await this.graphQL(ProductsQuery, { first: limit });
    const { products } = data;
    const productsList = products.edges.map((edge: any) => edge.node);

    return productsList as Product[];
  }

  async getProductByHandle(handle: string) {
    const data = await this.graphQL(ProductByHandleQuery, { handle });
    const { productByHandle } = data;
    return productByHandle as Product;
  }

  // todo handle OOS line items when adding to cart
  async createCart(id: FormDataEntryValue, quantity: FormDataEntryValue) {
    const data = await this.graphQL(CreateCartMutation, {
      id,
      quantity: parseInt(quantity as string),
    });
    const { cart } = data.cartCreate;
    return cart as Cart;
  }

  async cartLinesAdd(
    id: string,
    merchandiseId: FormDataEntryValue,
    quantity: FormDataEntryValue
  ) {
    const data = await this.graphQL(AddCartLinesMutation, {
      cartId: id,
      merchandiseId,
      quantity: parseInt(quantity as string),
    });
    const { cart } = data.cartLinesAdd;
    return cart as Cart;
  }

  async retrieveCart(id: string) {
    const data = await this.graphQL(RetrieveCartQuery, { id });
    const cart = data.cartCreate.cart;
    return cart as Cart;
  }
}
