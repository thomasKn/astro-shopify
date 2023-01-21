import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { Shopify } from "../utils/shopify";
import type { Cart } from "../utils/types";

const shopify = new Shopify();

export const isCartDrawerOpen = atom(false);

export const cart = persistentAtom<Cart>(
  "cart",
  { id: "", checkoutUrl: "", totalQuantity: 0, lines: { nodes: [] } },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// todo add function at init to check if cart exists and if so, get cart items and set cart state
// export async function initCart() {
//   const { id: cartId } = cart.get();
//   if (cartId) {
//     const res = await shopify.getCart(cartId);
//     cart.set({
//       id: res.cart.id,
//       checkoutUrl: res.cart.checkoutUrl,
//       totalQuantity: res.cart.totalQuantity,
//       cartItems: res.cart.lines.nodes,
//     });
//   }
// }

export async function addCartItem(form: HTMLFormElement) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const { id: cartId } = cart.get();

  if (!cartId) {
    const cartData = await shopify.createCart(data.id, data.quantity);
    cart.set({
      ...cart.get(),
      id: cartData.id,
      checkoutUrl: cartData.checkoutUrl,
      totalQuantity: cartData.totalQuantity,
      lines: cartData.lines,
    });
    isCartDrawerOpen.set(true);
  } else {
    const cartData = await shopify.cartLinesAdd(cartId, data.id, data.quantity);
    cart.set({
      ...cart.get(),
      id: cartData.id,
      checkoutUrl: cartData.checkoutUrl,
      totalQuantity: cartData.totalQuantity,
      lines: cartData.lines,
    });
    isCartDrawerOpen.set(true);
  }
}
