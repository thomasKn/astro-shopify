import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { Shopify } from "../utils/shopify";
import type { Cart } from "./types";

const shopify = new Shopify();

export const isCartDrawerOpen = atom(false);

export const cart = persistentAtom<Cart>(
  "cart",
  { id: "", checkoutUrl: "", totalQuantity: 0, cartItems: [] },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function addCartItem(form: HTMLFormElement) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const { id: cartId } = cart.get();

  if (!cartId) {
    shopify.createCart(data.id, data.quantity).then((res) => {
      cart.set({
        id: res.cartCreate.cart.id,
        checkoutUrl: res.cartCreate.cart.checkoutUrl,
        totalQuantity: res.cartCreate.cart.totalQuantity,
        cartItems: res.cartCreate.cart.lines.nodes,
      });
      isCartDrawerOpen.set(true);
    });
  } else {
    shopify.cartLinesAdd(cartId, data.id, data.quantity).then((res) => {
      cart.set({
        id: res.cartLinesAdd.cart.id,
        totalQuantity: res.cartLinesAdd.cart.totalQuantity,
        checkoutUrl: res.cartLinesAdd.cart.checkoutUrl,
        cartItems: res.cartLinesAdd.cart.lines.nodes,
      });
      isCartDrawerOpen.set(true);
    });
  }
}
