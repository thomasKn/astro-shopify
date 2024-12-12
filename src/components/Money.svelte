<script lang="ts">
  import type { z } from "zod";
  import type { MoneyV2Result } from "../utils/schemas";

  interface Props {
    price: z.infer<typeof MoneyV2Result>;
    showCurrency: boolean;
  }

  let { price, showCurrency }: Props = $props();

  let formatPrice = $derived.by(() => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
    currencyDisplay: showCurrency ? "symbol" : "narrowSymbol",
  }).format(parseFloat(price.amount)));
</script>

<span>
  {formatPrice}
</span>
