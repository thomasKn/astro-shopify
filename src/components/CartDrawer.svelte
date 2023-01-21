<script lang="ts">
  import { cart, isCartDrawerOpen } from "../stores/cart";

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
    <div class="text-xl font-bold">Your Cart</div>
    <div class="mt-8">
      {#if $cart.lines?.nodes.length === 0}
        <div class="text-center text-gray-500">Your cart is empty</div>
      {:else}
        <ul class="grid gap-4">
          {#each $cart.lines?.nodes as item}
            <li class="flex items-center gap-3">
              <img
                src={item.merchandise.image.url}
                class="w-12"
                alt={item.merchandise.image.altText}
              />
              <div>
                <div class="text-sm font-bold">
                  {item.merchandise.product.title}
                </div>
                <div>{item.quantity}</div>
              </div>
            </li>
          {/each}
        </ul>
        <div class="mt-8">
          <a
            href={$cart.checkoutUrl}
            rel="noopener noreferrer"
            class="py-2 px-4 bg-black text-white rounded"
            target="_blank"
          >
            Proceed to checkout
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>
