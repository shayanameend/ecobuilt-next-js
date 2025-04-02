"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { useStore } from "@nanostores/react";
import { MinusIcon, PlusIcon, ShoppingCartIcon, XIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { $cart } from "~/stores/cart";

export function RootHeaderCartButton() {
  const cart = useStore($cart);

  const { totalQuantity, totalPrice } = React.useMemo(() => {
    let quantity = 0;
    let price = 0;
    for (const item of cart.items) {
      quantity += item.quantity;
      const itemPrice = item.salePrice ?? item.price;
      price += itemPrice * item.quantity;
    }
    return { totalQuantity: quantity, totalPrice: price };
  }, [cart.items]);

  const handleUpdateQuantity = (itemId: string, change: number) => {
    const updatedItems = cart.items
      .map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    $cart.set({
      ...cart,
      items: updatedItems,
    });
  };

  const handleIncreaseQuantity = (itemId: string) => {
    handleUpdateQuantity(itemId, 1);
  };

  const handleDecreaseQuantity = (itemId: string) => {
    handleUpdateQuantity(itemId, -1);
  };

  const handleRemoveItem = (itemId: string) => {
    $cart.set({
      ...cart,
      items: cart.items.filter((item) => item.id !== itemId),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative")}
          aria-label={`Shopping cart with ${totalQuantity} items`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {totalQuantity > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-2 -right-2 h-5 min-w-[1.25rem] px-1 flex items-center justify-center rounded-full text-xs",
              )}
            >
              {totalQuantity}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-80 space-y-0 p-0 mt-2 mr-4")}
        align="center"
      >
        <div className={cn("p-4")}>
          <h3 className={cn("text-lg font-medium")}>Shopping Cart</h3>
        </div>
        <Separator />

        {cart.items.length === 0 ? (
          <div className={cn("p-6 text-center text-sm text-muted-foreground")}>
            Your cart is empty.
          </div>
        ) : (
          <>
            <ScrollArea className={cn("max-h-[300px]")}>
              {" "}
              <div className={cn("p-4 space-y-4")}>
                {cart.items.map((item) => {
                  const itemPrice = item.salePrice ?? item.price;
                  const itemSubtotal = itemPrice * item.quantity;
                  return (
                    <div key={item.id} className={cn("flex items-start gap-4")}>
                      <div
                        className={cn(
                          "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                        )}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FILE_URL}/${item.pictureIds[0]}`}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className={cn("object-cover")}
                        />
                      </div>

                      <div className={cn("flex-grow space-y-1")}>
                        <p
                          className={cn(
                            "text-sm font-medium leading-tight line-clamp-2",
                          )}
                        >
                          {item.name}
                        </p>

                        <div className={cn("flex items-center gap-2")}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleIncreaseQuantity(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className={cn("text-xs text-muted-foreground")}>
                          @ {formatPrice(itemPrice)} each
                        </p>
                        <p className={cn("text-sm font-medium")}>
                          Subtotal: {formatPrice(itemSubtotal)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive",
                        )}
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
          </>
        )}

        {cart.items.length > 0 && (
          <div className={cn("p-4 space-y-3")}>
            <div className={cn("flex justify-between text-base font-medium")}>
              <p>Total</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            <p className={cn("text-xs text-muted-foreground")}>
              Shipping and taxes calculated at checkout.
            </p>
            <div className={cn("flex flex-col gap-2 sm:flex-row")}>
              <Button className={cn("flex-1")} asChild>
                <Link href={routes.app.public.home.url()}>Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
