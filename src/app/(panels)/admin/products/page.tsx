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
import { PackageIcon } from "lucide-react";

import { AdminDataTable } from "~/app/(panels)/_components/admin-data-table";
import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";
import { SearchFilterBar } from "~/app/(panels)/_components/search-filter-bar";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useAuthContext } from "~/context/auth";

import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { ToggleDeleteProduct } from "./_components/delete-product";
import { FilterProducts } from "./_components/filter-products";

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

  const url = `${routes.api.admin.products.url()}?${params.toString()}`;

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

  return (
    <AdminPageLayout
      title="Products"
      description="View and manage products inventory. You can search, filter and delete products from here."
      isLoading={productsQueryIsLoading}
      isError={productsQueryIsError || !productsQuery?.data?.products}
      errorTitle="Error Loading Products"
      errorDescription="We couldn't load your products information. Please try again later."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search Products..."
        filterComponent={<FilterProducts />}
      />
      <AdminDataTable
        data={productsQuery?.data?.products}
        columns={[
          {
            header: "Product",
            cell: (product) => (
              <div className={cn("flex items-center gap-2")}>
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
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {product.description}
                  </span>
                </div>
              </div>
            ),
          },
          {
            header: "Stock",
            cell: (product) => <span>{product.stock}</span>,
          },
          {
            header: "Category",
            cell: (product) => (
              <Badge variant="outline">{product.category.name}</Badge>
            ),
          },
          {
            header: "Price",
            cell: (product) => <span>{formatPrice(product.price)}</span>,
          },
          {
            header: "Actions",
            cell: (product) => (
              <div className={cn("space-x-2")}>
                <ToggleDeleteProduct
                  id={product.id}
                  isDeleted={product.isDeleted}
                />
              </div>
            ),
          },
        ]}
        currentPage={currentPage}
        meta={productsQuery?.meta}
        onPageChange={handlePageChange}
        itemName="products"
        emptyState={{
          icon: PackageIcon,
          title: "No products found",
          description:
            currentName ||
            currentCategoryId ||
            currentMinStock ||
            currentMinPrice ||
            currentMaxPrice ||
            currentIsDeleted
              ? "No products match your current filters. Try adjusting your search criteria."
              : "There are no products available at the moment.",
        }}
      />
    </AdminPageLayout>
  );
}
