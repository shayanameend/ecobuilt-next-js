"use client";

import type { FormEvent } from "react";

import type {
  MultipleResponseType,
  ProductType,
  PublicCategoryType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { FilterProducts } from "../_components/filter-products";
import { Product } from "../_components/product";
import { EmptyState } from "../_components/empty-state";

async function getProducts({
  token,
  name = "",
  page = 1,
  limit = 10,
  categoryId = "",
  sort = "",
  minStock,
  minPrice,
  maxPrice,
}: {
  token: string | null;
  name?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: string;
  minStock?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (name) {
    params.append("name", name);
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (sort) {
    params.append("sort", sort);
  }

  if (minStock !== undefined && minStock > 0) {
    params.append("minStock", minStock.toString());
  }

  if (minPrice !== undefined && minPrice > 0) {
    params.append("minPrice", minPrice.toString());
  }

  if (maxPrice !== undefined && maxPrice > 0) {
    params.append("maxPrice", maxPrice.toString());
  }

  const url = `${routes.api.public.products.url()}?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useAuthContext();

  const currentPage = Number(searchParams.get("page") || "1");
  const currentName = searchParams.get("name") || "";

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinStock = searchParams.get("minStock")
    ? Number(searchParams.get("minStock"))
    : undefined;
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const [queryTerm, setQueryTerm] = useState(currentName);

  const {
    data: productsQuery,
    isLoading: productsQueryIsLoading,
    isError: productsQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      products: (ProductType & {
        category: PublicCategoryType;
        vendor: VendorProfileType;
      })[];
    }>
  >({
    queryKey: [
      "products",
      currentPage,
      currentName,
      currentCategoryId,
      currentSort,
      currentMinStock,
      currentMinPrice,
      currentMaxPrice,
    ],
    queryFn: () =>
      getProducts({
        token,
        page: currentPage,
        name: currentName,
        categoryId: currentCategoryId,
        sort: currentSort,
        minStock: currentMinStock,
        minPrice: currentMinPrice,
        maxPrice: currentMaxPrice,
      }),
  });

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (queryTerm) {
      params.set("name", queryTerm);
    } else {
      params.delete("name");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;

    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  useEffect(() => {
    setQueryTerm(currentName);
  }, [currentName]);

  if (productsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (productsQueryIsError || !productsQuery?.data?.products) {
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
      <section className={cn("flex-1 space-y-8 py-8 px-4")}>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <div className={cn("md:hidden")}>
            <FilterProducts />
          </div>
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center relative"
          >
            <Input
              placeholder="Search Products..."
              className={cn("pr-10")}
              value={queryTerm}
              onChange={(e) => setQueryTerm(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className={cn("absolute right-0.5")}
            >
              Search
            </Button>
          </form>
        </div>
        {productsQuery.data.products.length > 0 ? (
          <>
            <div>
              <ul
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4",
                )}
              >
                {productsQuery.data.products.map((product) => (
                  <li key={product.id}>
                    <Product product={product} />
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn("flex items-center gap-8")}>
              <div>
                <p>
                  Showing{" "}
                  {productsQuery.meta.limit < productsQuery.meta.total
                    ? productsQuery.meta.limit
                    : productsQuery.meta.total}{" "}
                  of {productsQuery.meta.total} products
                </p>
              </div>
              <Pagination className={cn("flex-1 justify-end")}>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        Math.ceil(
                          (productsQuery.meta.total || 0) /
                            (productsQuery.meta.limit || 10),
                        ),
                      ),
                    },
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    },
                  )}

                  {Math.ceil(
                    (productsQuery.meta.total || 0) /
                      (productsQuery.meta.limit || 10),
                  ) > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage <
                          Math.ceil(
                            (productsQuery.meta.total || 0) /
                              (productsQuery.meta.limit || 10),
                          ) && handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage >=
                        Math.ceil(
                          (productsQuery.meta.total || 0) /
                            (productsQuery.meta.limit || 10),
                        )
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Package}
            title="No products found"
            description={
              currentName ||
              currentCategoryId ||
              currentMinPrice ||
              currentMaxPrice ||
              currentMinStock
                ? "No products match your current filters. Try adjusting your search criteria."
                : "There are no products available at the moment."
            }
            action={
              currentName ||
              currentCategoryId ||
              currentMinPrice ||
              currentMaxPrice ||
              currentMinStock
                ? {
                    label: "Clear filters",
                    onClick: () => {
                      router.push(window.location.pathname);
                    },
                  }
                : undefined
            }
          />
        )}
      </section>
    </>
  );
}
