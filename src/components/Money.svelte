<script lang="ts">
  import type { z } from "zod";
  import type { MoneyV2Result } from "../utils/schemas";

  export let price: z.infer<typeof MoneyV2Result>;
  export let showCurrency: boolean = false;

  const amount = parseInt(price.amount);

  const formatPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
    currencyDisplay: showCurrency ? "symbol" : "narrowSymbol",
  }).format(amount);
</script>

<span>
  {formatPrice}
</span>
