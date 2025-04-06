"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  AlertCircleIcon,
  Loader2Icon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
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
import type {
  CategoryType,
  MultipleResponseType,
  OrderStatus,
  ProductType,
  PublicOrderToProductType,
  PublicOrderType,
  UserProfileType,
  VendorProfileType,
} from "~/lib/types";
import { cn } from "~/lib/utils";
import { EmptyState } from "../../../_components/empty-state";
import { FilterOrders } from "./_components/filter-orders";
import { OrderDetail } from "./_components/order-detail";
import { OrderStatusSwitcher } from "./_components/order-status-switcher";

async function getOrders({
  token,
  page = 1,
  limit = 10,
  sort = "",
  status = "",
  categoryId = "",
  userName = "",
  productName = "",
  userId = "",
  minTotalPrice,
  maxTotalPrice,
}: {
  token: string | null;
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  categoryId?: string;
  userName?: string;
  productName?: string;
  userId?: string;
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

  if (userName) {
    params.append("userName", userName);
  }

  if (productName) {
    params.append("productName", productName);
  }

  if (userId) {
    params.append("userId", userId);
  }

  if (minTotalPrice !== undefined && minTotalPrice > 0) {
    params.append("minTotalPrice", minTotalPrice.toString());
  }

  if (maxTotalPrice !== undefined && maxTotalPrice > 0) {
    params.append("maxTotalPrice", maxTotalPrice.toString());
  }

  const response = await axios.get(
    `${routes.api.vendor.orders.url()}?${params.toString()}`,
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

  const currentPage = Number(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentUserName = searchParams.get("userName") || "";
  const currentProductName = searchParams.get("productName") || "";
  const currentUserId = searchParams.get("userId") || "";
  const currentMinTotalPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : undefined;
  const currentMaxTotalPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : undefined;

  const [queryTerm, setQueryTerm] = useState(currentUserName);

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
        user: UserProfileType;
      })[];
    }>
  >({
    queryKey: [
      "orders",
      currentPage,
      currentSort,
      currentStatus,
      currentCategoryId,
      currentUserName,
      currentProductName,
      currentUserId,
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
        userName: currentUserName,
        productName: currentProductName,
        userId: currentUserId,
        minTotalPrice: currentMinTotalPrice,
        maxTotalPrice: currentMaxTotalPrice,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if (queryTerm) {
      params.set("userName", queryTerm);
    } else {
      params.delete("userName");
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

  if (ordersQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </section>
    );
  }

  if (ordersQueryIsError) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Failed to load orders"
          description="We couldn't load your orders information. Please try again."
          action={{
            label: "Retry",
            onClick: () => router.push(window.location.pathname),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  // At this point, we know ordersQuery is defined because we've handled loading and error states
  const orders = ordersQuery?.data?.orders || [];
  const totalPages = ordersQuery?.meta?.pages || 1;

  return (
    <section className={cn("flex-1 space-y-8")}>
      <div className={cn("flex items-center justify-between")}>
        <div className={cn("space-y-1")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Orders
          </h2>
          <p className={cn("text-muted-foreground text-base font-medium")}>
            View and manage customer orders. You can search, filter and update
            order status from here.
          </p>
        </div>
      </div>
      <div className={cn("relative flex items-center justify-between gap-2")}>
        <FilterOrders />
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center relative"
        >
          <Input
            placeholder="Search by Customer..."
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
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className={cn("flex items-center gap-2")}>
                      <Avatar className="size-10">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_FILE_URL}/${order.user.pictureId}`}
                          alt={order.user.name}
                          className={cn("object-cover")}
                        />
                        <AvatarFallback>
                          {order.user.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-wrap">
                        <span className="text-sm font-medium">
                          {order.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.user.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.orderToProduct.length}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <OrderStatusSwitcher
                        id={order.id}
                        status={order.status as keyof typeof OrderStatus}
                        token={token}
                      />
                    </TableCell>
                    <TableCell>
                      <OrderDetail order={order} token={token} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={ShoppingCartIcon}
              title="No orders found"
              description="No orders match your current filters."
              action={{
                label: "Clear Filters",
                onClick: () => router.push(routes.app.vendor.orders.url()),
              }}
            />
          )}
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={cn(
                  currentPage <= 1 && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                    ...
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(totalPages);
                    }}
                    isActive={totalPages === currentPage}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={cn(
                  currentPage >= totalPages && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
