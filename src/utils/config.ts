import { configSchema } from "./schemas";

const defineConfig = {
  shopifyShop: import.meta.env.PUBLIC_VERCEL_SHOPIFY_SHOP,
  publicShopifyAccessToken: import.meta.env
    .PUBLIC_VERCEL_SHOPIFY_PUBLIC_STOREFRONT_ACCESS_TOKEN,
  privateShopifyAccessToken: import.meta.env
    .PUBLIC_VERCEL_SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN
    ? import.meta.env.PUBLIC_VERCEL_SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN
    : "",
  apiVersion: "2023-01",
};

export const config = configSchema.parse(defineConfig);
