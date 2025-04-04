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
import { AlertCircleIcon, Loader2Icon, SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { DeleteProduct } from "./_components/delete-product";
import { EditProduct } from "./_components/edit-product";
import { FilterProducts } from "./_components/filter-products";
import { NewProduct } from "./_components/new-product";

async function getProducts({
  token,
  name = "",
  page = 1,
  limit = 10,
  categoryId = "",
  sort = "",
  isDeleted = false,
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
  isDeleted?: boolean;
  minStock?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  const params = new URLSearchParams({
    isDeleted: isDeleted.toString(),
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

  const url = `${routes.api.vendor.products.url()}?${params.toString()}`;

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
  const currentIsDeleted = searchParams.get("isDeleted") === "true";
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
      currentIsDeleted,
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
        isDeleted: currentIsDeleted,
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

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
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
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2
              className={cn(
                "text-black/75 text-3xl font-bold",
                domine.className,
              )}
            >
              Products
            </h2>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              Manage your products inventory here. Add new products, update
              existing ones, and organize them.
            </p>
          </div>
          <div>
            <NewProduct />
          </div>
        </div>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <FilterProducts />
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
              size="icon"
              className={cn("absolute right-0.5 size-8")}
            >
              <SearchIcon />
            </Button>
          </form>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsQuery.data.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className={cn("flex items-center gap-2")}>
                      <Avatar className="size-10 rounded-md">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_FILE_URL}/${product.pictureIds[0]}`}
                          alt={product.name}
                          className={cn("object-cover")}
                        />
                        <AvatarFallback className={cn("rounded-md")}>
                          {product.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-wrap">
                        <span className="text-sm font-medium">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category.name}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell className={cn("space-x-2")}>
                      <EditProduct product={product} />
                      {!product.isDeleted && <DeleteProduct id={product.id} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className={cn("flex items-center gap-8")}>
            <CardDescription>
              <p>
                Showing{" "}
                {productsQuery.meta.limit < productsQuery.meta.total
                  ? productsQuery.meta.limit
                  : productsQuery.meta.total}{" "}
                of {productsQuery.meta.total} products
              </p>
            </CardDescription>
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
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
