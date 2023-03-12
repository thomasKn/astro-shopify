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
      class="fixed inset-0 bg-slate-400/50 backdrop-blur-sm transition-opacity"
    />

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 focus:outline-none"
          tabindex="-1"
          use:clickOutside={() => closeCartDrawer()}
          bind:this={cartDrawerEl}
          on:keydown={onKeyDown}
        >
          <div
            in:fly={{ duration: 500, x: 500, opacity: 100 }}
            out:fly={{ duration: 500, x: 500, opacity: 100 }}
            class="pointer-events-auto w-screen max-w-lg max-h-screen bg-white"
          >
            <div class="flex flex-col min-h-screen max-h-full">
              <div
                class="flex items-start justify-between max-h-full shadow-sm p-5"
              >
                <h2
                  class="text-2xl flex gap-4 items-center font-bold text-zinc-800"
                  id="slide-over-title"
                >
                  Your cart
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

              <div class="flex-1 overflow-y-scroll">
                <div class="px-5">
                  {#if $cart && $cart.lines?.nodes.length > 0}
                    <!-- svelte-ignore a11y-no-redundant-roles -->
                    <ul
                      role="list"
                      class="divide-y divide-zinc-100 {cartIsUpdatingClass}"
                    >
                      {#each $cart.lines?.nodes as item}
                        <li class="grid py-8 grid-cols-12 gap-3">
                          <div
                            class="overflow-hidden rounded-lg col-span-3 lg:col-span-2"
                          >
                            <ShopifyImage
                              image={item.merchandise.image}
                              classList="object-cover h-full object-center aspect-1"
                              sizes="(min-width: 100px) 100px"
                              loading="lazy"
                            />
                          </div>
                          <div
                            class="col-span-7 lg:col-span-8 flex flex-col gap-2"
                          >
                            <a
                              class="hover:underline w-fit"
                              href={`/products/${item.merchandise.product.handle}`}
                            >
                              {item.merchandise.product.title}
                            </a>
                            <p class="text-xs">
                              <Money price={item.cost.amountPerQuantity} />
                            </p>
                          </div>
                          <div
                            class="col-span-2 items-end flex justify-between flex-col"
                          >
                            <button
                              on:click={() => {
                                removeItem(item.id);
                              }}
                              type="button"
                              disabled={$isCartUpdating}
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
                            <div>
                              <p class="font-medium">
                                <Money price={item.cost.totalAmount} />
                              </p>
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

              <div class="">
                {#if $cart && $cart.lines?.nodes.length > 0}
                  <div class="border-t border-zinc-200 py-6 px-4 sm:px-6">
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
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
