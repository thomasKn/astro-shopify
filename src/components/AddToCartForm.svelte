<script lang="ts">
  import { addCartItem } from "../stores/cart";

  function addToCart(e: Event) {
    const form = e.target as HTMLFormElement;
    addCartItem(form);
  }
</script>

<form on:submit|preventDefault={(e) => addToCart(e)}>
  <slot />
</form>
