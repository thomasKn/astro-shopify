<script lang="ts">
  import { onMount } from "svelte";
  import { initCart, cart, isCartDrawerOpen } from "../stores/cart";

  onMount(() => {
    initCart();
  });

  function openCart() {
    isCartDrawerOpen.set(true);
  }
</script>

<div>
  <button class="relative" on:click={() => openCart()}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
    {#if $cart && $cart.totalQuantity > 0}
      <div
        class="absolute -right-2 -top-1 sm:-right-1 sm:top-0 bg-emerald-900 text-white text-[12px] rounded-full"
      >
        <span class="w-5 h-5 flex justify-center text-center items-center">
          {$cart.totalQuantity}
        </span>
      </div>
    {/if}
  </button>
</div>
