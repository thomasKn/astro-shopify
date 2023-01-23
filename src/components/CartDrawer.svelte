<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    cart,
    isCartDrawerOpen,
    removeCartItems,
    isCartUpdating,
  } from "../stores/cart";
  import ShopifyImage from "./ShopifyImage.svelte";
  import Money from "./Money.svelte";
  import { clickOutside } from "../utils/click-outside";

  let cartDrawerEl: HTMLDivElement;

  // Add classes to cart line items if cart is updating
  $: cartIsUpdatingClass = $isCartUpdating
    ? "opacity-50 pointer-events-none"
    : "";

  // Add focus to cart drawer when it opens
  $: {
    if ($isCartDrawerOpen) {
      document.querySelector("body")?.classList.add("overflow-hidden");
      cartDrawerEl?.focus();
    }
  }

  function removeItem(id: string) {
    removeCartItems([id]);
  }

  function closeCartDrawer() {
    document.querySelector("body")?.classList.remove("overflow-hidden");
    isCartDrawerOpen.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeCartDrawer();
    }
  }
</script>

{#if $isCartDrawerOpen}
  <div
    class="relative z-50"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      in:fade={{ duration: 500 }}
      out:fade={{ duration: 500 }}
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    />

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 focus:outline-none"
          tabindex="-1"
          use:clickOutside={() => closeCartDrawer()}
          bind:this={cartDrawerEl}
          on:keydown={onKeyDown}
        >
          <div
            in:fly={{ duration: 500, x: 500, opacity: 100 }}
            out:fly={{ duration: 500, x: 500, opacity: 100 }}
            class="pointer-events-auto w-screen max-w-md"
          >
            <div
              class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
            >
              <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2
                    class="text-lg flex gap-4 items-center font-medium text-gray-900"
                    id="slide-over-title"
                  >
                    Shopping cart
                    {#if $isCartUpdating}
                      <svg
                        class="animate-spin -ml-1 mr-3 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    {/if}
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button
                      on:click={() => closeCartDrawer()}
                      type="button"
                      class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span class="sr-only">Close panel</span>
                      <!-- Heroicon name: outline/x-mark -->
                      <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-8">
                  <div class="flow-root">
                    {#if $cart.lines?.nodes.length > 0}
                      <!-- svelte-ignore a11y-no-redundant-roles -->
                      <ul
                        role="list"
                        class="-my-6 divide-y divide-gray-200 {cartIsUpdatingClass}"
                      >
                        {#each $cart.lines?.nodes as item}
                          <li class="flex py-6">
                            <div
                              class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                            >
                              <ShopifyImage
                                image={item.merchandise.image}
                                classList="h-full w-full object-cover object-center"
                                sizes="(min-width: 100px) 100px"
                                loading="lazy"
                              />
                            </div>

                            <div class="ml-4 flex flex-1 flex-col">
                              <div>
                                <div
                                  class="flex justify-between text-base font-medium text-gray-900"
                                >
                                  <a
                                    href={`/products/${item.merchandise.product.handle}`}
                                  >
                                    <h3>
                                      {item.merchandise.product.title}
                                    </h3>
                                  </a>
                                  <p class="ml-4">
                                    <Money
                                      price={item.estimatedCost.totalAmount}
                                    />
                                  </p>
                                </div>
                                <p class="mt-1 text-sm text-gray-500">
                                  {item.merchandise.title}
                                </p>
                              </div>
                              <div
                                class="flex flex-1 items-end justify-between text-sm"
                              >
                                <p class="text-gray-500">Qty {item.quantity}</p>

                                <div class="flex">
                                  <button
                                    on:click={() => {
                                      removeItem(item.id);
                                    }}
                                    type="button"
                                    class="font-semibold text-emerald-900 hover:text-emerald-700"
                                    disabled={$isCartUpdating}>Remove</button
                                  >
                                </div>
                              </div>
                            </div>
                          </li>
                        {/each}
                      </ul>
                    {:else}
                      <div class="text-center mt-20">
                        <p class="text-gray-500">Your cart is empty</p>
                        <a
                          href="/"
                          class="font-semibold text-emerald-900 hover:text-emerald-700"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </a>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>

              {#if $cart.lines?.nodes.length > 0}
                <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div
                    class="flex justify-between text-base font-medium text-gray-900"
                  >
                    <p>Subtotal</p>
                    <p>
                      <Money
                        price={$cart.cost.totalAmount}
                        showCurrency={true}
                      />
                    </p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div class="mt-6">
                    <a href={$cart.checkoutUrl} class="button">Checkout</a>
                  </div>
                  <div
                    class="mt-6 flex justify-center text-center text-sm text-gray-500"
                  >
                    <p>
                      or
                      <a
                        href="/"
                        class="font-semibold text-emerald-900 hover:text-emerald-700"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </a>
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
