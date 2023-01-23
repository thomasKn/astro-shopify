import { configSchema } from "./schemas";

const defineConfig = {
  shopifyShop: import.meta.env.PUBLIC_SHOPIFY_SHOP,
  shopifyAccessToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: "2023-01",
};

export const config = configSchema.parse(defineConfig);
