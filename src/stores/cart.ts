import type { CartItemType } from "~/lib/types";

import { persistentMap } from "@nanostores/persistent";

export const $cart = persistentMap<{ items: CartItemType[] }>(
  "ecobuilt-cart:",
  {
    items: [],
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);
