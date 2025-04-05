"use client";

import type {
  PublicOrderType,
  SingleResponseType,
  UserProfileType,
} from "~/lib/types";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useStore } from "@nanostores/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import axios, { type AxiosError } from "axios";
import { Loader2Icon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { $cart } from "~/stores/cart";
import { EmptyState } from "../../../_components/empty-state";

async function getUserProfile({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.user.profile.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function createOrder({
  token,
  products,
}: {
  token: string | null;
  products: {
    productId: string;
    quantity: number;
  }[];
}): Promise<SingleResponseType<{ order: PublicOrderType }>> {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await axios.post(
    routes.api.user.orders.url(),
    { products },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { token, auth } = useAuthContext();
  const cart = useStore($cart);

  // Redirect to products page if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push(routes.app.public.products.url());
    }
  }, [cart.items.length, router]);

  // Calculate totals
  const { totalQuantity, totalPrice } = useMemo(() => {
    let quantity = 0;
    let price = 0;
    for (const item of cart.items) {
      quantity += item.quantity;
      const itemPrice = item.salePrice ?? item.price;
      price += itemPrice * item.quantity;
    }
    return { totalQuantity: quantity, totalPrice: price };
  }, [cart.items]);

  // Fetch user profile if logged in
  const {
    data: profileQuery,
    isLoading: profileQueryIsLoading,
    isError: profileQueryIsError,
  } = useQuery<
    SingleResponseType<{
      profile: UserProfileType;
    }>
  >({
    queryKey: ["profile"],
    queryFn: () => getUserProfile({ token }),
    enabled: !!token && auth?.role === "USER",
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: {
      products: { productId: string; quantity: number }[];
    }) => {
      return createOrder({
        token,
        products: data.products,
      });
    },
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      // Clear cart after successful order
      $cart.set({ items: [] });
      // Redirect to user dashboard
      router.push(routes.app.user.dashboard.url());
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.info?.message ||
          "Failed to place order. Please try again.",
      );
    },
  });

  const handlePlaceOrder = () => {
    if (!token || auth?.role !== "USER") {
      // Redirect to login if not logged in
      toast.error("Please log in to place an order");
      router.push(routes.app.auth.signIn.url());
      return;
    }

    // Format cart items for API
    const products = cart.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    // Submit order
    createOrderMutation.mutate({ products });
  };

  if (cart.items.length === 0) {
    return (
      <section className={cn("flex-1 space-y-8 py-8 px-4")}>
        <EmptyState
          icon={ShoppingCartIcon}
          title="Your cart is empty"
          description="Add some products to your cart to checkout."
          action={{
            label: "Browse Products",
            onClick: () => router.push(routes.app.public.products.url()),
          }}
        />
      </section>
    );
  }

  return (
    <section className={cn("flex-1 space-y-8 py-8 px-4 max-w-7xl mx-auto")}>
      <div className={cn("space-y-2")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Checkout
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Review your order and complete your purchase
        </p>
      </div>

      <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-2")}>
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold", domine.className)}>
                Order Summary
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-4")}>
              {cart.items.map((item) => {
                const itemPrice = item.salePrice ?? item.price;
                const itemSubtotal = itemPrice * item.quantity;
                return (
                  <div key={item.id} className={cn("flex items-start gap-4")}>
                    <div
                      className={cn(
                        "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border",
                      )}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_FILE_URL}/${item.pictureIds[0]}`}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className={cn("object-cover")}
                      />
                    </div>
                    <div className={cn("flex-grow space-y-1")}>
                      <p className={cn("font-medium")}>{item.name}</p>
                      <p className={cn("text-sm text-muted-foreground")}>
                        Quantity: {item.quantity} × {formatPrice(itemPrice)}
                      </p>
                      <p className={cn("font-medium")}>
                        {formatPrice(itemSubtotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className={cn("space-y-2")}>
              <div className={cn("flex justify-between")}>
                <p className={cn("text-muted-foreground")}>Subtotal</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <div className={cn("flex justify-between")}>
                <p className={cn("text-muted-foreground")}>Shipping</p>
                <p>Free</p>
              </div>
              <Separator />
              <div className={cn("flex justify-between font-bold")}>
                <p>Total</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
            </div>

            <div className={cn("pt-4")}>
              <Button
                className={cn("w-full")}
                size="lg"
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending && (
                  <Loader2Icon className={cn("mr-2 h-4 w-4 animate-spin")} />
                )}
                Place Order
              </Button>
              <p
                className={cn("mt-2 text-xs text-center text-muted-foreground")}
              >
                By placing your order, you agree to our{" "}
                <Link
                  href="#"
                  className={cn(
                    "underline underline-offset-4 hover:text-primary",
                  )}
                >
                  Terms and Conditions
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold", domine.className)}>
                Delivery Information
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!token || auth?.role !== "USER" ? (
              <div className={cn("space-y-4")}>
                <p>Please sign in to complete your purchase.</p>
                <Button asChild>
                  <Link href={routes.app.auth.signIn.url()}>Sign In</Link>
                </Button>
              </div>
            ) : profileQueryIsLoading ? (
              <div className={cn("flex justify-center py-8")}>
                <Loader2Icon
                  className={cn("h-8 w-8 animate-spin text-primary")}
                />
              </div>
            ) : profileQueryIsError ? (
              <div className={cn("space-y-4")}>
                <p>Failed to load your profile information.</p>
                <Button variant="outline" onClick={() => router.refresh()}>
                  Retry
                </Button>
              </div>
            ) : (
              <div className={cn("space-y-4")}>
                <div className={cn("grid grid-cols-1 gap-2")}>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                      )}
                    >
                      Name
                    </p>
                    <p>{profileQuery?.data?.profile.name}</p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                      )}
                    >
                      Phone
                    </p>
                    <p>{profileQuery?.data?.profile.phone}</p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                      )}
                    >
                      Delivery Address
                    </p>
                    <p>{profileQuery?.data?.profile.deliveryAddress}</p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                      )}
                    >
                      City
                    </p>
                    <p>{profileQuery?.data?.profile.city}</p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                      )}
                    >
                      Postal Code
                    </p>
                    <p>{profileQuery?.data?.profile.postalCode}</p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" asChild className={cn("w-full")}>
                    <Link href={routes.app.user.settings.url()}>
                      Update Profile
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
