"use client";

import type {
  ProductType,
  PublicCategoryType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { AlertCircleIcon, Loader2Icon, Package } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { EmptyState } from "../../../_components/empty-state";
import { ProductDetails } from "../../_components/product-details";
import { ProductReviews } from "../../_components/product-reviews";
import { RelatedProducts } from "../../_components/related-products";

async function getProduct({ id }: { id: string }) {
  const url = routes.api.public.products.url(id);

  const response = await axios.get(url);

  return response.data;
}

export default function ProductsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const {
    data: productsQuery,
    isLoading: productsQueryIsLoading,
    isError: productsQueryIsError,
  } = useQuery<
    SingleResponseType<{
      product: ProductType & {
        category: PublicCategoryType;
        vendor: VendorProfileType;
      };
    }>
  >({
    queryKey: ["product", params.id],
    queryFn: () =>
      getProduct({
        id: params.id,
      }),
  });

  if (productsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (productsQueryIsError || !productsQuery?.data?.product) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Product"
          description="We couldn't load your product information. Please try again later."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex items-baseline mx-auto max-w-7xl")}>
        <div className={cn("flex-1 space-y-8 py-8 px-4")}>
          {productsQuery.data.product ? (
            <>
              <div>
                <ProductDetails product={productsQuery.data.product} />
                <ProductReviews productId={params.id} />
                <RelatedProducts
                  vendorId={productsQuery.data.product.vendor.id}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="Product not found"
              description={"Couldn't load the product at the moment."}
              action={{
                label: "Refresh",
                onClick: () => {
                  router.push(window.location.pathname);
                },
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}
