"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";

import { AdminDataTable } from "~/app/(panels)/_components/admin-data-table";
import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";
import { SearchFilterBar } from "~/app/(panels)/_components/search-filter-bar";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuthContext } from "~/context/auth";
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
import { cn, formatDate, formatPrice } from "~/lib/utils";
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
  vendorName = "",
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
  vendorName?: string;
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

  if (vendorName) {
    params.append("vendorName", vendorName);
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
    `${routes.api.admin.orders.url()}?${params.toString()}`,
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
  const currentVendorName = searchParams.get("vendorName") || "";
  const currentProductName = searchParams.get("productName") || "";
  const currentUserId = searchParams.get("userId") || "";
  const currentMinTotalPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : undefined;
  const currentMaxTotalPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : undefined;

  const [queryTerm, setQueryTerm] = useState(currentVendorName);

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
      currentVendorName,
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
        vendorName: currentVendorName,
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
      params.set("vendorName", queryTerm);
    } else {
      params.delete("vendorName");
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

  // At this point, we know ordersQuery is defined because we've handled loading and error states
  const orders = ordersQuery?.data?.orders || [];

  return (
    <AdminPageLayout
      title="Orders"
      description="View and manage customer orders. You can search, filter and update order status from here."
      isLoading={ordersQueryIsLoading}
      isError={ordersQueryIsError}
      errorTitle="Error Loading Orders"
      errorDescription="Failed to load orders. Please try again."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search by Vendor..."
        filterComponent={<FilterOrders />}
      />
      <AdminDataTable
        data={orders}
        columns={[
          {
            header: "Customer",
            cell: (order) => (
              <div className={cn("flex items-center gap-2")}>
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
                  <span className="text-sm font-medium">{order.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {order.user.phone}
                  </span>
                </div>
              </div>
            ),
          },
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
              <OrderStatusSwitcher
                id={order.id}
                status={order.status as keyof typeof OrderStatus}
                token={token}
              />
            ),
          },
          {
            header: "Actions",
            cell: (order) => <OrderDetail order={order} token={token} />,
          },
        ]}
        currentPage={currentPage}
        meta={ordersQuery?.meta}
        onPageChange={handlePageChange}
        itemName="orders"
        emptyState={{
          icon: ShoppingCartIcon,
          title: "No orders found",
          description: "No orders match your current filters.",
        }}
      />
    </AdminPageLayout>
  );
}
