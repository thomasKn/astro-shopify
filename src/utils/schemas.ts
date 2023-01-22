import { z } from "zod";

export const configSchema = z.object({
  shopifyShop: z.string(),
  shopifyAccessToken: z.string(),
  apiVersion: z.string(),
});

export const MoneyV2Result = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageResult = z.object({
  altText: z.string().nullable().optional(),
  url: z.string(),
  width: z.number().positive().int(),
  height: z.number().positive().int(),
});

export const CartItemResult = z.object({
  id: z.string(),
  estimatedCost: z.object({
    totalAmount: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }),
  }),
  merchandise: z.object({
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageResult,
  }),
  quantity: z.number().positive().int(),
});

export const CartResult = z.object({
  id: z.string(),
  cost: z.object({
    totalAmount: MoneyV2Result,
  }),
  checkoutUrl: z.string(),
  totalQuantity: z.number().int(),
  lines: z.object({
    nodes: z.array(CartItemResult),
  }),
});

export const VariantResult = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  priceV2: MoneyV2Result,
});

export const ProductResult = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  images: z.object({
    nodes: z.array(ImageResult),
  }),
  variants: z.object({
    nodes: z.array(VariantResult),
  }),
  featuredImage: ImageResult,
});
