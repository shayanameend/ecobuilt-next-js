"use client";

import type {
  PublicOrderType,
  SingleResponseType,
  UserProfileType,
  VendorProfileType,
} from "~/lib/types";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useStore } from "@nanostores/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import axios, { type AxiosError } from "axios";
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  ShoppingCartIcon,
  StoreIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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

async function getVendorProfile({
  vendorId,
  token,
}: {
  vendorId: string;
  token: string | null;
}) {
  const response = await axios.get(routes.api.public.vendors.url(vendorId), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
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

  // Get vendor ID from first cart item (assuming all items are from same vendor)
  const vendorId = useMemo(() => {
    if (cart.items.length > 0 && (cart.items[0] as any).vendor?.id) {
      return (cart.items[0] as any).vendor.id;
    }
    return null;
  }, [cart.items]);

  // Redirect to products page if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push(routes.app.public.products.url());
    }
  }, [cart.items.length, router]);

  // Calculate totals
  const { totalPrice } = useMemo(() => {
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

  // Fetch vendor profile
  const {
    data: vendorQuery,
    isLoading: vendorQueryIsLoading,
    isError: vendorQueryIsError,
  } = useQuery<
    SingleResponseType<{
      vendor: VendorProfileType;
    }>
  >({
    queryKey: ["vendor", vendorId],
    queryFn: () => getVendorProfile({ vendorId: vendorId!, token }),
    enabled: !!vendorId,
  });

  // Estimated delivery date (5 days from now)
  const estimatedDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

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
    onSuccess: () => {
      toast.success("Order placed successfully!");
      // Clear cart after successful order
      $cart.set({ items: [] });
      // Redirect to user dashboard
      router.push(routes.app.user.checkout.url());
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

      <div className={cn("flex flex-col gap-8 md:flex-row items-start")}>
        {/* Order Summary */}
        <Card className={cn("flex-1")}>
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

        {/* Information Tabs */}
        <div className={cn("space-y-6 flex-1")}>
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">
                <UserIcon className="h-4 w-4 mr-2" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="vendor">
                <StoreIcon className="h-4 w-4 mr-2" />
                Vendor
              </TabsTrigger>
            </TabsList>

            {/* Customer Information Tab */}
            <TabsContent value="customer" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-primary" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Your account and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!token || auth?.role !== "USER" ? (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm mb-2">
                          Please sign in to complete your purchase
                        </p>
                        <Button asChild>
                          <Link href={routes.app.auth.signIn.url()}>
                            Sign In
                          </Link>
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Don't have an account?</p>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={routes.app.auth.signUp.url()}>
                            Create an account
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : profileQueryIsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : profileQueryIsError ? (
                    <div className="space-y-4">
                      <p className="text-sm text-destructive">
                        Failed to load your profile information.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.refresh()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg border border-border">
                          <div className="flex items-center mb-3">
                            <UserIcon className="h-5 w-5 mr-2 text-primary" />
                            <h4 className="font-medium">Personal Details</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-7">
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                Name:
                              </p>
                              <p className="text-sm">
                                {profileQuery?.data?.profile.name}
                              </p>
                            </div>
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                Phone:
                              </p>
                              <p className="text-sm">
                                {profileQuery?.data?.profile.phone}
                              </p>
                            </div>
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                Email:
                              </p>
                              <p className="text-sm">{auth?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg border border-border">
                          <div className="flex items-center mb-3">
                            <MapPinIcon className="h-5 w-5 mr-2 text-primary" />
                            <h4 className="font-medium">Address</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-7">
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                Address:
                              </p>
                              <p className="text-sm">
                                {profileQuery?.data?.profile.deliveryAddress}
                              </p>
                            </div>
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                City:
                              </p>
                              <p className="text-sm">
                                {profileQuery?.data?.profile.city}
                              </p>
                            </div>
                            <div className="flex items-start">
                              <p className="text-sm font-medium text-muted-foreground w-24">
                                Postal Code:
                              </p>
                              <p className="text-sm">
                                {profileQuery?.data?.profile.postalCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={routes.app.user.settings.url()}>
                            Update Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vendor Information Tab */}
            <TabsContent value="vendor" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <StoreIcon className="h-5 w-5 mr-2 text-primary" />
                    Vendor Information
                  </CardTitle>
                  <CardDescription>
                    Details about the seller of your products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {vendorQueryIsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : vendorQueryIsError || !vendorId ? (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="flex items-center mb-2">
                        <InfoIcon className="h-5 w-5 mr-2 text-amber-500" />
                        <h4 className="font-medium">
                          Vendor Information Unavailable
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-7">
                        We couldn't load the vendor information at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                          {vendorQuery?.data?.vendor.pictureId ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_FILE_URL}/${vendorQuery.data.vendor.pictureId}`}
                              alt={vendorQuery.data.vendor.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                              <StoreIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {vendorQuery?.data?.vendor.name}
                          </h4>
                          <Badge variant="outline" className="mt-1">
                            Verified Seller
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm mb-2 font-medium">
                          About the Vendor
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vendorQuery?.data?.vendor.description ||
                            "No description available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              Pickup Address
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {vendorQuery?.data?.vendor.pickupAddress},{" "}
                              {vendorQuery?.data?.vendor.city},{" "}
                              {vendorQuery?.data?.vendor.postalCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              Contact Number
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {vendorQuery?.data?.vendor.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" asChild className="w-full">
                        <Link href={routes.app.public.vendors.url(vendorId)}>
                          View Vendor Store
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
