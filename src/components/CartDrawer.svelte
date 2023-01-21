<script lang="ts">
  import { cart, isCartDrawerOpen, removeCartItems } from "../stores/cart";
  import ShopifyImage from "./ShopifyImage.svelte";

  function removeItem(id: string) {
    removeCartItems([id]);
  }

  function closeCartDrawer() {
    isCartDrawerOpen.set(false);
  }
</script>

<div
  class="
    {$isCartDrawerOpen ? 'grid' : 'hidden'}
    fixed inset-0 justify-end z-50 bg-black/60
  "
>
  <div class="w-96 h-screen p-6 relative bg-white">
    <div class="absolute right-3 top-3">
      <button on:click={() => closeCartDrawer()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="text-2xl font-bold">Your Cart</div>
    <div class="mt-8">
      {#if $cart.lines?.nodes.length === 0}
        <div class="text-center text-gray-500">Your cart is empty</div>
      {:else}
        <ul class="grid gap-4">
          {#each $cart.lines?.nodes as item}
            <li class="grid items-center grid-cols-10 gap-3">
              <ShopifyImage
                image={item.merchandise.image}
                classList="w-12 col-span-2"
                sizes="(min-width: 100px) 50px"
                loading="lazy"
              />
              <div class="col-span-5">
                <div class="text-sm font-bold">
                  {item.merchandise.product.title}
                </div>
                <div>{item.quantity}</div>
              </div>
              <div class="col-span-3 flex justify-end">
                <button
                  on:click={() => {
                    removeItem(item.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          {/each}
        </ul>
        <div class="mt-8">
          <div class="text-xl font-bold">
            {$cart.cost.totalAmount.amount}
            {$cart.cost.totalAmount.currencyCode}
          </div>
          <div class="mt-5">
            <a
              href={$cart.checkoutUrl}
              rel="noopener noreferrer"
              class="py-2 px-4 bg-black text-white rounded"
              target="_blank"
            >
              Proceed to checkout
            </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
