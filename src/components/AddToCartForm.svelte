<script lang="ts">
  import { addCartItem, isCartUpdating } from "../stores/cart";

  export let variantId: string;

  function addToCart(e: Event) {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { id, quantity } = Object.fromEntries(formData);
    const item = {
      id: id as string,
      quantity: parseInt(quantity as string),
    };
    addCartItem(item);
  }
</script>

<form on:submit|preventDefault={(e) => addToCart(e)}>
  <input type="hidden" name="id" value={variantId} />
  <input type="hidden" name="quantity" value="1" />
  <button type="submit" class="button mt-10 w-full" disabled={$isCartUpdating}>
    {#if $isCartUpdating}
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
    Add to bag
  </button>
</form>
