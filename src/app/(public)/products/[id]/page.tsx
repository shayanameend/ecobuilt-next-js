"use client";

import type {
  ProductType,
  PublicCategoryType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

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
import { EmptyState } from "../../_components/empty-state";
import { ProductDetails } from "../../_components/product-details";

async function getProducts({ id }: { id: string }) {
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
      getProducts({
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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Product</CardTitle>
            <CardDescription>
              We couldn't load your product information. Please try again later.
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
          {productsQuery.data.product ? (
            <>
              <div>
                <ProductDetails product={productsQuery.data.product} />
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
