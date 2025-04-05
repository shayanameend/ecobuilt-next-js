"use client";

import type {
  PublicCategoryType,
  PublicProductType,
  VendorProfileType,
} from "~/lib/types";

import Image from "next/image";
import * as React from "react";

import { useStore } from "@nanostores/react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { VendorConfirmationDialog } from "~/app/(public)/_components/vendor-confirmation-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { checkVendorCompatibility } from "~/lib/cart-utils";
import { cn, formatPrice } from "~/lib/utils";
import { $cart } from "~/stores/cart";

interface ProductDetailsProps {
  product: PublicProductType & {
    category: PublicCategoryType;
    vendor: VendorProfileType;
  };
}

export function ProductDetails({ product }: Readonly<ProductDetailsProps>) {
  const cart = useStore($cart);
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [showVendorDialog, setShowVendorDialog] = React.useState(false);
  const [vendorDialogData, setVendorDialogData] = React.useState<{
    currentVendor: VendorProfileType | null;
    newVendor: VendorProfileType;
  } | null>(null);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentSlide(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newValue = prev + change;
      if (newValue < 1) return 1;
      if (newValue > product.stock) return product.stock;
      return newValue;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };

  const addProductToCart = (replaceExisting = false) => {
    if (quantity <= 0) return;

    const existingItem = cart.items.find((item) => item.id === product.id);

    if (existingItem) {
      $cart.set({
        ...cart,
        items: cart.items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        ),
      });
    } else if (replaceExisting) {
      // Replace all items with the new product
      $cart.set({
        items: [{ ...product, quantity: quantity }],
      });
    } else {
      // Add to existing items
      $cart.set({
        ...cart,
        items: [...cart.items, { ...product, quantity: quantity }],
      });
    }
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  const handleAddToCart = () => {
    if (quantity <= 0) return;

    // Check if product is from the same vendor
    const { isSameVendor, currentVendor, newVendor } = checkVendorCompatibility(
      cart.items,
      product,
    );

    // If cart is empty or product is from the same vendor, add it directly
    if (isSameVendor) {
      addProductToCart();
      return;
    }

    // If product is from a different vendor, show confirmation dialog
    if (currentVendor && newVendor) {
      setVendorDialogData({ currentVendor, newVendor });
      setShowVendorDialog(true);
    }
  };

  const handleVendorConfirm = () => {
    // User confirmed to replace cart items with the new product
    addProductToCart(true);
    setShowVendorDialog(false);
  };

  const handleVendorCancel = () => {
    // User chose to keep existing items
    setShowVendorDialog(false);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start",
      )}
    >
      <div className={cn("w-full md:col-span-2 max-w-xl mx-auto md:mx-0")}>
        {" "}
        <Carousel
          setApi={setApi}
          opts={{
            loop: product.pictureIds.length > 1,
          }}
          className={cn("w-full")}
        >
          <CarouselContent>
            {product.pictureIds.map((id, index) => (
              <CarouselItem key={id}>
                <div
                  className={cn(
                    "aspect-square w-full overflow-hidden rounded-lg border bg-muted",
                  )}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FILE_URL}/${id}`}
                    alt={product.name}
                    width={600}
                    height={600}
                    className={cn("h-full w-full object-contain")}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {product.pictureIds.length > 1 && (
            <>
              <CarouselPrevious
                className={cn("absolute left-2 top-1/2 -translate-y-1/2")}
              />
              <CarouselNext
                className={cn("absolute right-2 top-1/2 -translate-y-1/2")}
              />
            </>
          )}
        </Carousel>
        {product.pictureIds.length > 1 && (
          <div className={cn("mt-4 flex flex-wrap justify-center gap-2")}>
            {product.pictureIds.map((id, index) => (
              <button
                key={id}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded border transition-opacity hover:opacity-80",
                  index === currentSlide
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILE_URL}/${id}`}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className={cn("h-full w-full object-cover")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={cn("flex flex-col space-y-4 md:col-span-3")}>
        <h1 className={cn("text-2xl lg:text-3xl font-bold tracking-tight")}>
          {product.name}
        </h1>

        <div className={cn("flex flex-wrap items-center gap-2 text-sm")}>
          <span className={cn("text-muted-foreground")}>
            Sold by: {product.vendor.name}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline">{product.category.name}</Badge>
        </div>

        <div className={cn("flex flex-col")}>
          <p className={cn("text-2xl lg:text-3xl font-semibold")}>
            <span>
              {product.salePrice
                ? formatPrice(product.salePrice)
                : formatPrice(product.price)}
            </span>

            {product.salePrice && (
              <span
                className={cn(
                  "ml-2 text-lg text-muted-foreground line-through",
                )}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </p>
          <p className={cn("text-xs text-muted-foreground")}>Excl. VAT</p>
        </div>

        <Separator />

        <div className={cn("space-y-2")}>
          <h2 className={cn("text-lg font-semibold")}>Description</h2>
          <p className={cn("text-sm text-muted-foreground")}>
            {product.description || "No description available."}
          </p>
        </div>

        <div className={cn("text-sm text-muted-foreground space-y-1")}>
          <p>SKU: {product.sku || "N/A"}</p>
          <p>
            Stock:{" "}
            {product.stock > 0 ? (
              <span className={cn("font-medium text-green-600")}>
                {product.stock} In Stock
              </span>
            ) : (
              <span className={cn("font-medium text-red-600")}>
                Out of Stock
              </span>
            )}
          </p>
        </div>

        <Separator />

        <div className={cn("pt-2 flex gap-4")}>
          <div className={cn("flex items-center border rounded-md")}>
            <Button
              variant="outline"
              size="icon"
              className={cn("h-10 w-10 border-r rounded-r-none")}
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || product.stock <= 0}
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleInputChange}
              className={cn(
                "h-10 w-16 rounded-none border-y-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              disabled={product.stock <= 0}
              aria-label="Quantity"
            />
            <Button
              variant="outline"
              size="icon"
              className={cn("h-10 w-10 border-l rounded-l-none")}
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock || product.stock <= 0}
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="lg"
            className={cn("flex-grow")}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {product.stock > 0 && product.stock < 10 && (
          <p className={cn("mt-2 text-sm text-orange-600")}>
            Limited quantity available! Only {product.stock} left in stock.
          </p>
        )}
      </div>

      {/* Vendor Confirmation Dialog */}
      {vendorDialogData && (
        <VendorConfirmationDialog
          isOpen={showVendorDialog}
          onOpenChange={setShowVendorDialog}
          currentVendor={vendorDialogData.currentVendor!}
          newVendor={vendorDialogData.newVendor}
          onConfirm={handleVendorConfirm}
          onCancel={handleVendorCancel}
        />
      )}
    </div>
  );
}
