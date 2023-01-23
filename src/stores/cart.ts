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

// Cart store with persistent state (local storage) and initial value
export const cart = persistentAtom<z.infer<typeof CartResult>>(
  "cart",
  {
    id: "",
    checkoutUrl: "",
    totalQuantity: 0,
    lines: { nodes: [] },
    cost: { totalAmount: { amount: "", currencyCode: "" } },
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// Fetch cart data if a cart exists in local storage, this is called during session start only
// This is useful to validate if the cart still exists in Shopify and if it's not empty
export async function initCart() {
  const sessionStarted = sessionStorage.getItem("sessionStarted");
  if (!sessionStarted) {
    const { id: cartId } = cart.get();
    if (cartId) {
      const res = await getCart(cartId);

      // todo add error handling here if cart doesn't exist anymore (e.g. deleted in Shopify admin) or if it's empty (e.g. all items are out of stock)

      cart.set({
        id: res.id,
        cost: res.cost,
        checkoutUrl: res.checkoutUrl,
        totalQuantity: res.totalQuantity,
        lines: res.lines,
      });
    }
  }
  sessionStorage.setItem("sessionStarted", "true");
}

// Add item to cart or create a new cart if it doesn't exist yet
export async function addCartItem(item: { id: string; quantity: number }) {
  const { id: cartId } = cart.get();

  isCartUpdating.set(true);

  if (!cartId) {
    const cartData = await createCart(item.id, item.quantity);
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
  } else {
    const cartData = await addCartLines(cartId, item.id, item.quantity);
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

export async function removeCartItems(lineIds: string[]) {
  const { id: cartId } = cart.get();
  isCartUpdating.set(true);

  const cartData = await removeCartLines(cartId, lineIds);

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
