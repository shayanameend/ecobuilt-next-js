"use client";

import type { FormEvent } from "react";

import type {
  MultipleResponseType,
  ProductType,
  PublicCategoryType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
import { EmptyState } from "./empty-state";
import { Product } from "./product";

async function getRelatedProducts({ vendorId }: { vendorId: string }) {
  const page = 1;
  const limit = 4;
  const sort = "RELEVANCE";

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sort) {
    params.append("sort", sort);
  }

  if (vendorId) {
    params.append("vendorId", vendorId);
  }

  const url = `${routes.api.public.products.url()}?${params.toString()}`;

  const response = await axios.get(url);

  return response.data;
}

interface RelatedProductsProps {
  vendorId: string;
}

export function RelatedProducts({ vendorId }: Readonly<RelatedProductsProps>) {
  const router = useRouter();

  const {
    data: relatedProductsQuery,
    isLoading: relatedProductsQueryIsLoading,
    isError: relatedProductsQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      products: (ProductType & {
        category: PublicCategoryType;
        vendor: VendorProfileType;
      })[];
    }>
  >({
    queryKey: ["related-products"],
    queryFn: () => getRelatedProducts({ vendorId }),
  });

  if (relatedProductsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (relatedProductsQueryIsError || !relatedProductsQuery?.data?.products) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Products</CardTitle>
            <CardDescription>
              We couldn't load your products information. Please try again
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex items-baseline mx-auto max-w-7xl")}>
        <div className={cn("flex-1 space-y-8 py-8 px-4")}>
          {relatedProductsQuery.data.products.length > 0 ? (
            <>
              <div>
                <ul
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4",
                  )}
                >
                  {relatedProductsQuery.data.products.map((product) => (
                    <li key={product.id}>
                      <Product product={product} />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="No related products found"
              description={
                "There are no related products available at the moment."
              }
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
