import type { CartItemType } from "~/lib/types";

import { map } from "nanostores";

export const $cart = map<{ items: CartItemType[] }>({
  items: [],
});
