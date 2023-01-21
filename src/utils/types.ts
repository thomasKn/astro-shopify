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
    image: Image;
  };
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: CartItem[];
  };
}

export interface Image {
  altText?: string;
  url: string;
  width: number;
  height: number;
}

export interface PriceV2 {
  amount: string;
  currencyCode: string;
}

export interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  priceV2: PriceV2;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  variants: {
    nodes: Variant[];
  };
  featuredImage: Image;
}
