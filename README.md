# Astro starter theme to build a headless ecommerce website with Shopify

The theme is built with Svelte but you can use any framework you like (React, Vue, Solid etc.) thanks to Astro.
Tailwind UI free components are used for the design.

## 🧑‍🚀 Where to start

1. Create a `.env` file based on `.env.example` with your Shopify store url and public token
2. The credentials are used inside the `/utils/config.ts` file, you can update the API version there
3. Run `npm install` or `yarn` or `pnpm install`
4. Run `npm run dev` or `yarn run dev` or `pnpm run dev`

## Shopify Configuration Guide

- Create a new account or use an existing one. https://accounts.shopify.com/store-login
- Create a new app. https://\<yourshopname>.myshopify.com/admin/settings/apps
- Once your app has been created, select use it. Then select "Storefront API integration" link
- Next, check Storefront API access scopes
  - `unauthenticated_read_product_listings` and `unauthenticated_read_product_inventory` access should be fine to get you started.
  - Add more scopes if you require additional permissions.

### Shopify Troubleshooting

- If you encounter an error like `error code 401` you likely didn't set this up correctly. Revisit your scopes and be sure add at least one test product. Also make sure you are using the `Storefront API` and not the `Admin API` as the endpoints and scopes are different.
- If you do not see a checkout sidebar, or if it is empty after adding a product, you need to add an image to your test product.

## 🚀 Project Structure

Inside the project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── components/
│       └── Header.astro
│   └── layouts/
│       └── BaseLayout.astro
│   └── pages/
│       └── index.astro
│   └── stores/
│       └── cart.ts
│   └── styles/
│       └── global.css
│   └── utils/
│       └── shopify.ts
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## ⚡️ Lighthouse
![lighthouse_astro_shopify](https://user-images.githubusercontent.com/10447155/214448698-ce2a1ef6-6fbd-4fca-b8b6-c5194b72a15b.jpg)
