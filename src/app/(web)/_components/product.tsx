"use client";

import type {
  PublicCategoryType,
  PublicProductType,
  VendorProfileType,
} from "~/lib/types";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useStore } from "@nanostores/react";

import { VendorConfirmationDialog } from "~/app/(web)/_components/vendor-confirmation-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { checkVendorCompatibility } from "~/lib/cart-utils";
import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { $cart } from "~/stores/cart";

interface ProductProps {
  product: PublicProductType & {
    category: PublicCategoryType;
    vendor: VendorProfileType;
  };
}

export function Product({ product }: Readonly<ProductProps>) {
  const cart = useStore($cart);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [vendorDialogData, setVendorDialogData] = useState<{
    currentVendor: VendorProfileType | null;
    newVendor: VendorProfileType;
  } | null>(null);

  return (
    <>
      <Card className={cn("p-0 gap-0")}>
        <Link href={routes.app.public.products.url(product.id)}>
          <CardContent className={cn("py-5 px-10")}>
            <Image
              src={`${process.env.NEXT_PUBLIC_FILE_URL}/${product.pictureIds[0]}`}
              alt={product.name}
              width={240}
              height={240}
              className={cn("h-60 w-full object-contain rounded-t-xl")}
            />
          </CardContent>
        </Link>
        <CardFooter
          className={cn("p-4 flex-col items-stretch gap-2 bg-gray-50")}
        >
          <div>
            <h4 className={cn("text-[10px] uppercase")}>
              {product.vendor.name}
            </h4>
            <h3 className={cn("text-[16px]")}>{product.name}</h3>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <div className={cn("-space-y-1")}>
              <p className={cn("space-x-1 text-lg font-medium")}>
                <span>
                  {product.salePrice
                    ? formatPrice(product.salePrice)
                    : formatPrice(product.price)}
                </span>
                {product.salePrice && (
                  <span
                    className={cn("text-muted-foreground text-sm line-through")}
                  >
                    {formatPrice(product.price)}
                  </span>
                )}
              </p>
              <p className={cn("text-[10px] text-muted-foreground")}>
                Excl. VAT
              </p>
            </div>
            <Button
              variant="default"
              size="default"
              onClick={() => {
                // Check if product is from the same vendor
                const { isSameVendor, currentVendor, newVendor } =
                  checkVendorCompatibility(cart.items, product);

                // If product is from the same vendor or cart is empty, add it directly
                if (isSameVendor) {
                  if (cart.items.find((item) => item.id === product.id)) {
                    $cart.set({
                      ...cart,
                      items: cart.items.map((item) =>
                        item.id === product.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item,
                      ),
                    });
                  } else {
                    $cart.set({
                      ...cart,
                      items: [...cart.items, { ...product, quantity: 1 }],
                    });
                  }
                } else if (currentVendor && newVendor) {
                  setVendorDialogData({ currentVendor, newVendor });
                  setShowVendorDialog(true);
                }
              }}
            >
              Purchase
            </Button>
          </div>
        </CardFooter>
      </Card>

      {vendorDialogData && (
        <VendorConfirmationDialog
          isOpen={showVendorDialog}
          onOpenChange={setShowVendorDialog}
          currentVendor={vendorDialogData.currentVendor!}
          newVendor={vendorDialogData.newVendor}
          onConfirm={() => {
            $cart.set({
              items: [{ ...product, quantity: 1 }],
            });
            setShowVendorDialog(false);
          }}
          onCancel={() => {
            setShowVendorDialog(false);
          }}
        />
      )}
    </>
  );
}
