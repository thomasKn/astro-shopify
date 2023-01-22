<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { cart, isCartDrawerOpen, removeCartItems } from "../stores/cart";
  import ShopifyImage from "./ShopifyImage.svelte";

  function removeItem(id: string) {
    removeCartItems([id]);
  }

  function closeCartDrawer() {
    isCartDrawerOpen.set(false);
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
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
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
                    class="text-lg font-medium text-gray-900"
                    id="slide-over-title"
                  >
                    Shopping cart
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
                      <ul role="list" class="-my-6 divide-y divide-gray-200">
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
                                    {item.estimatedCost.totalAmount.amount}
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
                                    >Remove</button
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
                      {$cart.cost.totalAmount.amount}
                      {$cart.cost.totalAmount.currencyCode}
                    </p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div class="mt-6">
                    <a
                      href={$cart.checkoutUrl}
                      class="flex items-center justify-center rounded-md border border-transparent bg-emerald-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-800"
                      >Checkout</a
                    >
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
