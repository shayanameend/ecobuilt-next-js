"use client";

import type { AdminDashboardKPIsType, SingleResponseType } from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn, formatDate, formatPrice } from "~/lib/utils";

async function getDashboardKPIs(token: string | null) {
  const response = await axios.get(routes.api.admin.dashboard.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function DashboardPage() {
  const { token } = useAuthContext();

  const {
    data: kpisQuery,
    isLoading: kpisQueryIsLoading,
    isError: kpisQueryIsError,
  } = useQuery<SingleResponseType<AdminDashboardKPIsType>>({
    queryKey: ["kpis"],
    queryFn: () => getDashboardKPIs(token),
  });

  return (
    <AdminPageLayout
      title="Dashboard"
      description="Welcome to the admin dashboard. Here you can manage your content, monitor analytics, and configure system settings."
    >
      <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
      >
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Vendors
              </h3>
            </CardTitle>
            <TrendingUpIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>
              {kpisQuery?.data.vendorsCount}
            </h4>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Products
              </h3>
            </CardTitle>
            <PackageIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>
              {kpisQuery?.data.productsCount}
            </h4>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Orders
              </h3>
            </CardTitle>
            <ShoppingCartIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>
              {kpisQuery?.data.ordersCount}
            </h4>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Customers
              </h3>
            </CardTitle>
            <UsersIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>
              {kpisQuery?.data.usersCount}
            </h4>
          </CardContent>
        </Card>
      </div>
      <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8")}
      >
        <Card className={cn("col-span-5")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Recent Orders</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpisQuery?.data?.recentOrders &&
            kpisQuery.data.recentOrders.length > 0 ? (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpisQuery.data.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className={cn("flex items-center gap-2")}>
                            <Avatar className="size-8">
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
                            <span className="text-sm font-medium">
                              {order.user.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.orderToProduct.length}</TableCell>
                        <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "DELIVERED"
                                ? "default"
                                : order.status === "CANCELLED" ||
                                    order.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="whitespace-nowrap"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent orders found
              </div>
            )}
            {kpisQuery?.data?.recentOrders &&
              kpisQuery.data.recentOrders.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Link href={routes.app.admin.orders.url()}>
                    <Button variant="outline" size="sm">
                      Go to Orders
                    </Button>
                  </Link>
                </div>
              )}
          </CardContent>
        </Card>
        <Card className={cn("col-span-3")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Recent Products</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpisQuery?.data?.recentProducts &&
            kpisQuery.data.recentProducts.length > 0 ? (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpisQuery.data.recentProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className={cn("flex items-center gap-2")}>
                            {product.pictureIds?.[0] && (
                              <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                                <Avatar className="size-8">
                                  <AvatarImage
                                    src={`${process.env.NEXT_PUBLIC_FILE_URL}/${product.pictureIds[0]}`}
                                    alt={product.name}
                                    className={cn("object-cover")}
                                  />
                                  <AvatarFallback>
                                    {product.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                            <span className="text-sm font-medium truncate max-w-[140px]">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent products found
              </div>
            )}
            {kpisQuery?.data?.recentProducts &&
              kpisQuery.data.recentProducts.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Link
                    href={routes.app.admin.products.url()}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Go to Products
                  </Link>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
