export interface CartItem {
  id: string;
  estimatedCost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    title: string;
    product: {
      title: string;
    };
    image: {
      altText: string | null;
      url: string;
    };
  };
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cartItems: CartItem[];
}
