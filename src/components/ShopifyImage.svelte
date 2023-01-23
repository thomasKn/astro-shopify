<script lang="ts">
  import type { z } from "zod";
  import type { ImageResult } from "../utils/schemas";

  export let image: z.infer<typeof ImageResult>;
  export let classList: string = "";
  export let loading: "lazy" | "eager" = "lazy";
  export let sizes: string;

  // Values used for srcset attribute of image tag (in pixels)
  const srcSetValues = [
    50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
  ];

  // Function to generate Shopify image url with width and height parameters
  function imageFilter(size: { width: number; height?: number }) {
    const { width, height = "" } = size;

    // If image is a webp, remove the .webp extension from the url
    // (Shopify image transformations don't work with webp)
    if (image.url.includes(".webp")) {
      return `${image.url.replace(
        ".webp",
        ""
      )}&width=${width}&height=${height}`;
    }

    return `${image.url}&width=${width}&height=${height}`;
  }
</script>

<img
  src={image.url}
  alt={image.altText || "Default alt text"}
  class={classList}
  width={image.width}
  height={image.height}
  {loading}
  {sizes}
  srcset={srcSetValues
    .filter((value) => value < image.width)
    .map((value) => {
      if (image.width >= value) {
        return `${imageFilter({
          width: value,
        })} ${value}w`;
      }
    })
    .join(", ")
    .concat(`, ${image.url} ${image.width}w`)}
/>
