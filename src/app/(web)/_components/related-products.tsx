"use client";

import type {
  MultipleResponseType,
  ProductType,
  PublicCategoryType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircleIcon, Loader2Icon, Package } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { EmptyState } from "../../_components/empty-state";
import { Product } from "./product";

type EnrichedProductType = ProductType & {
  category: PublicCategoryType;
  vendor: VendorProfileType;
};

async function getRelatedProducts(
  vendorId: string,
): Promise<MultipleResponseType<{ products: EnrichedProductType[] }>> {
  const page = 1;
  const limit = 4;
  const sort = "RELEVANCE";

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort: sort,
    vendorId: vendorId,
  });

  const url = `${routes.api.public.products.url()}?${params.toString()}`;

  try {
    const response = await axios.get(url);

    return response.data as MultipleResponseType<{
      products: EnrichedProductType[];
    }>;
  } catch (error) {
    console.error("Failed to fetch related products:", error);

    throw new Error("Could not fetch related products.");
  }
}

interface RelatedProductsProps {
  vendorId: string;
}

export function RelatedProducts({ vendorId }: Readonly<RelatedProductsProps>) {
  const router = useRouter();

  const {
    data: relatedProductsData,
    isLoading: isLoadingRelatedProducts,
    isError: isErrorRelatedProducts,
  } = useQuery<MultipleResponseType<{ products: EnrichedProductType[] }>>({
    queryKey: ["related-products", vendorId],
    queryFn: () => getRelatedProducts(vendorId),
    enabled: !!vendorId,
    retry: 1,
  });

  if (isLoadingRelatedProducts) {
    return (
      <section className="flex flex-1 items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="mx-auto size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading related products...</p>
        </div>
      </section>
    );
  }

  if (isErrorRelatedProducts) {
    return (
      <section className="flex flex-1 items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Products"
          description="We couldn't load related products. Please try again later."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  const products = relatedProductsData?.data?.products ?? [];

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              className={cn(
                "text-lg font-bold tracking-tight text-foreground sm:text-2xl",
                domine.className,
              )}
            >
              Related Products
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Check out other items from this vendor.
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <Product product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Package}
            title="No Related Products Found"
            description="There are no other products available from this vendor right now."
            action={{
              label: "Refresh",

              onClick: () => router.refresh(),
            }}
          />
        )}
      </div>
    </section>
  );
}
