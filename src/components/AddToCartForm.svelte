<script lang="ts">
  import { addCartItem } from "../stores/cart";

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
  <slot />
</form>
