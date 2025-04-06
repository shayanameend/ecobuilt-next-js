"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { AlertCircleIcon, Loader2Icon, ShoppingCartIcon } from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import {
  type CategoryType,
  type MultipleResponseType,
  OrderStatus,
  type ProductType,
  type PublicOrderToProductType,
  type PublicOrderType,
  type VendorProfileType,
} from "~/lib/types";
import { cn, formatDate, formatPrice } from "~/lib/utils";
import { FilterOrders } from "./_components/filter-orders";

import { OrderDetail } from "./_components/order-detail";
import { OrdersSidebar } from "./_components/orders-sidebar";
import { UserDataTable } from "./_components/user-data-table";

async function getOrders({
  token,
  page = 1,
  limit = 10,
  sort = "",
  status = "",
  categoryId = "",
  productName = "",
  vendorName = "",
  minTotalPrice,
  maxTotalPrice,
}: {
  token: string | null;
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  categoryId?: string;
  productName?: string;
  vendorName?: string;
  minTotalPrice?: number;
  maxTotalPrice?: number;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sort) {
    params.append("sort", sort);
  }

  if (status) {
    params.append("status", status);
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (productName) {
    params.append("productName", productName);
  }

  if (vendorName) {
    params.append("vendorName", vendorName);
  }

  if (minTotalPrice !== undefined && minTotalPrice > 0) {
    params.append("minTotalPrice", minTotalPrice.toString());
  }

  if (maxTotalPrice !== undefined && maxTotalPrice > 0) {
    params.append("maxTotalPrice", maxTotalPrice.toString());
  }

  const response = await axios.get(
    `${routes.api.user.orders.url()}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useAuthContext();

  const currentPage = Number(searchParams.get("page") || 1);
  const currentSort = searchParams.get("sort") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentProductName = searchParams.get("productName") || "";
  const currentVendorName = searchParams.get("vendorName") || "";
  const currentMinTotalPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : 0;
  const currentMaxTotalPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : 0;

  const [queryTerm, setQueryTerm] = useState(currentProductName);

  const {
    data: ordersQuery,
    isLoading: ordersQueryIsLoading,
    isError: ordersQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      orders: (PublicOrderType & {
        orderToProduct: (PublicOrderToProductType & {
          product: ProductType & {
            category: CategoryType;
            vendor: VendorProfileType;
          };
        })[];
      })[];
    }>
  >({
    queryKey: [
      "user-orders",
      currentPage,
      currentSort,
      currentStatus,
      currentCategoryId,
      currentProductName,
      currentVendorName,
      currentMinTotalPrice,
      currentMaxTotalPrice,
    ],
    queryFn: () =>
      getOrders({
        token,
        page: currentPage,
        sort: currentSort,
        status: currentStatus,
        categoryId: currentCategoryId,
        productName: currentProductName,
        vendorName: currentVendorName,
        minTotalPrice: currentMinTotalPrice,
        maxTotalPrice: currentMaxTotalPrice,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if (queryTerm) {
      params.set("productName", queryTerm);
    } else {
      params.delete("productName");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case OrderStatus.APPROVED:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case OrderStatus.IN_TRANSIT:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case OrderStatus.REJECTED:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  if (ordersQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (ordersQueryIsError || !ordersQuery?.data?.orders) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Orders"
          description="We couldn't load your orders. Please try again later."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  const orders = ordersQuery.data.orders;

  return (
    <>
      <section className={cn("flex items-baseline mx-auto max-w-7xl")}>
        <OrdersSidebar />
        <div className={cn("flex-1 space-y-8 py-8 px-4")}>
          <div
            className={cn("relative flex items-center justify-between gap-2")}
          >
            <div className={cn("md:hidden")}>
              <FilterOrders />
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

          <UserDataTable
            data={orders}
            columns={[
              {
                header: "Order ID",
                cell: (order) => <span>#{order.id.slice(0, 8)}</span>,
              },
              {
                header: "Date",
                cell: (order) => <span>{formatDate(order.createdAt)}</span>,
              },
              {
                header: "Items",
                cell: (order) => <span>{order.orderToProduct.length}</span>,
              },
              {
                header: "Total",
                cell: (order) => <span>{formatPrice(order.totalPrice)}</span>,
              },
              {
                header: "Status",
                cell: (order) => (
                  <Badge
                    className={cn("font-normal", getStatusColor(order.status))}
                  >
                    {order.status}
                  </Badge>
                ),
              },
              {
                header: "Actions",
                cell: (order) => <OrderDetail order={order} token={token} />,
              },
            ]}
            emptyState={{
              icon: ShoppingCartIcon,
              title: "No orders found",
              description:
                currentProductName ||
                currentCategoryId ||
                currentStatus ||
                currentVendorName ||
                currentMinTotalPrice ||
                currentMaxTotalPrice
                  ? "No orders match your current filters. Try adjusting your search criteria."
                  : "You haven't placed any orders yet.",
              action: {
                label: "Browse Products",
                onClick: () => router.push(routes.app.public.products.url()),
              },
            }}
          />

          {orders.length > 0 && (
            <div className={cn("flex items-center gap-8")}>
              <div>
                <p className={cn("text-sm text-muted-foreground")}>
                  Showing{" "}
                  {(ordersQuery.meta.limit || 0) < (ordersQuery.meta.total || 0)
                    ? ordersQuery.meta.limit || 0
                    : ordersQuery.meta.total || 0}{" "}
                  of {ordersQuery.meta.total || 0} orders
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
                          (ordersQuery.meta.total || 0) /
                            (ordersQuery.meta.limit || 10),
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
                    (ordersQuery.meta.total || 0) /
                      (ordersQuery.meta.limit || 10),
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
                            (ordersQuery.meta.total || 0) /
                              (ordersQuery.meta.limit || 10),
                          ) && handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage >=
                        Math.ceil(
                          (ordersQuery.meta.total || 0) /
                            (ordersQuery.meta.limit || 10),
                        )
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
