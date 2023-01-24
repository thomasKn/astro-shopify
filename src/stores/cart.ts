import type { z } from "zod";
import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import {
  getCart,
  addCartLines,
  createCart,
  removeCartLines,
} from "../utils/shopify";
import type { CartResult } from "../utils/schemas";

// Cart drawer state (open or closed) with initial value (false) and no persistent state (local storage)
export const isCartDrawerOpen = atom(false);

// Cart is updating state (true or false) with initial value (false) and no persistent state (local storage)
export const isCartUpdating = atom(false);

const emptyCart = {
  id: "",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: { nodes: [] },
  cost: { totalAmount: { amount: "", currencyCode: "" } },
};

// Cart store with persistent state (local storage) and initial value
export const cart = persistentAtom<z.infer<typeof CartResult>>(
  "cart",
  emptyCart,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// Fetch cart data if a cart exists in local storage, this is called during session start only
// This is useful to validate if the cart still exists in Shopify and if it's not empty
// Shopify automatically deletes the cart when the customer completes the checkout or if the cart is unused or abandoned after 10 days
// https://shopify.dev/custom-storefronts/cart#considerations
export async function initCart() {
  const sessionStarted = sessionStorage.getItem("sessionStarted");
  if (!sessionStarted) {
    sessionStorage.setItem("sessionStarted", "true");
    const localCart = cart.get();
    const cartId = localCart?.id;
    if (cartId) {
      const data = await getCart(cartId);

      if (data) {
        cart.set({
          id: data.id,
          cost: data.cost,
          checkoutUrl: data.checkoutUrl,
          totalQuantity: data.totalQuantity,
          lines: data.lines,
        });
      } else {
        // If the cart doesn't exist in Shopify, reset the cart store
        cart.set(emptyCart);
      }
    }
  }
}

// Add item to cart or create a new cart if it doesn't exist yet
export async function addCartItem(item: { id: string; quantity: number }) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  isCartUpdating.set(true);

  if (!cartId) {
    const cartData = await createCart(item.id, item.quantity);

    if (cartData) {
      cart.set({
        ...cart.get(),
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
      isCartUpdating.set(false);
      isCartDrawerOpen.set(true);
    }
  } else {
    const cartData = await addCartLines(cartId, item.id, item.quantity);

    if (cartData) {
      cart.set({
        ...cart.get(),
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
      isCartUpdating.set(false);
      isCartDrawerOpen.set(true);
    }
  }
}

export async function removeCartItems(lineIds: string[]) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  isCartUpdating.set(true);

  if (cartId) {
    const cartData = await removeCartLines(cartId, lineIds);

    if (cartData) {
      cart.set({
        ...cart.get(),
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
      isCartUpdating.set(false);
    }
  }
}
