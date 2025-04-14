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

import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

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

  console.log(kpisQuery);

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
          <CardContent />
        </Card>
        <Card className={cn("col-span-3")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Recent Products</h3>
            </CardTitle>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </AdminPageLayout>
  );
}
