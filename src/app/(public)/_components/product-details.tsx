"use client";

import type {
  PublicCategoryType,
  PublicProductType,
  VendorProfileType,
} from "~/lib/types";

import Image from "next/image";
import * as React from "react"; // Import React for useState

import { useStore } from "@nanostores/react";
import { MinusIcon, PlusIcon } from "lucide-react"; // Icons for quantity

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
// Import Carousel components
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
  // State for Carousel API to sync thumbnails
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  // State for quantity
  const [quantity, setQuantity] = React.useState(1);

  // Update current slide index when carousel changes
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
      if (newValue < 1) return 1; // Minimum quantity is 1
      if (newValue > product.stock) return product.stock; // Maximum is stock
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

  const handleAddToCart = () => {
    if (quantity <= 0) return; // Should not happen with validation, but good practice

    const existingItem = cart.items.find((item) => item.id === product.id);

    if (existingItem) {
      $cart.set({
        ...cart,
        items: cart.items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                // Ensure new total quantity doesn't exceed stock
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        ),
      });
    } else {
      $cart.set({
        ...cart,
        items: [...cart.items, { ...product, quantity: quantity }],
      });
    }
    // Optional: Add user feedback like a toast notification here
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // Reset quantity to 1 after adding? Optional.
    // setQuantity(1);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12")}>
      {/* Left Column: Image Carousel */}
      <div className={cn("flex flex-col items-center")}>
        <Carousel
          setApi={setApi} // Get API instance
          opts={{
            loop: product.pictureIds.length > 1, // Loop only if multiple images
          }}
          className={cn("w-full max-w-md")}
        >
          <CarouselContent>
            {product.pictureIds.map((id) => (
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
                    priority={id === product.pictureIds[0]} // Prioritize first image
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Show controls only if multiple images */}
          {product.pictureIds.length > 1 && (
            <>
              <CarouselPrevious className={cn("absolute left-2")} />
              <CarouselNext className={cn("absolute right-2")} />
            </>
          )}
        </Carousel>

        {/* Thumbnails */}
        {product.pictureIds.length > 1 && (
          <div className={cn("mt-4 flex flex-wrap justify-center gap-2")}>
            {product.pictureIds.map((id, index) => (
              <button
                key={id}
                onClick={() => api?.scrollTo(index)} // Scroll to clicked thumbnail
                className={cn(
                  "h-16 w-16 overflow-hidden rounded border transition-opacity hover:opacity-80",
                  index === currentSlide
                    ? "ring-2 ring-primary ring-offset-2" // Highlight selected
                    : "opacity-60",
                )}
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

      {/* Right Column: Product Information */}
      <div className={cn("flex flex-col space-y-4")}>
        {/* Product Title */}
        <h1 className={cn("text-2xl lg:text-3xl font-bold tracking-tight")}>
          {product.name}
        </h1>

        {/* Vendor & Category */}
        <div className={cn("flex flex-wrap items-center gap-2")}>
          <span className={cn("text-sm text-muted-foreground")}>
            Sold by: {product.vendor.name}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline">{product.category.name}</Badge>
        </div>

        {/* Price */}
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

        {/* Description */}
        <div className={cn("space-y-2")}>
          <h2 className={cn("text-lg font-semibold")}>Description</h2>
          <p className={cn("text-sm text-muted-foreground")}>
            {product.description}
          </p>
        </div>

        {/* SKU & Stock */}
        <div className={cn("text-sm text-muted-foreground space-y-1")}>
          <p>SKU: {product.sku}</p>
          <p>
            Stock:{" "}
            {product.stock > 0 ? (
              <span className={cn("text-green-600")}>
                {product.stock} In Stock
              </span>
            ) : (
              <span className={cn("text-red-600")}>Out of Stock</span>
            )}
          </p>
        </div>

        <Separator />

        {/* Quantity Selector & Add to Cart Button */}
        <div className={cn("pt-2 flex flex-col sm:flex-row gap-4")}>
          {/* Quantity Input */}
          <div className={cn("flex items-center border rounded-md")}>
            <Button
              variant="outline"
              size="icon"
              className={cn("h-9 w-9 border-r rounded-r-none")}
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || product.stock <= 0}
            >
              <MinusIcon className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleInputChange}
              className={cn(
                "h-9 w-16 rounded-none text-center focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              disabled={product.stock <= 0}
            />
            <Button
              variant="outline"
              size="icon"
              className={cn("h-9 w-9 border-l rounded-l-none")}
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock || product.stock <= 0}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className={cn("flex-grow")} // Allow button to grow
            onClick={handleAddToCart}
            disabled={product.stock <= 0} // Disable if out of stock
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <p className={cn("mt-2 text-sm text-orange-600")}>
            Limited quantity available! ({product.stock} left)
          </p>
        )}
      </div>
    </div>
  );
}
