"use client";

import type { FormEvent } from "react";

import type {
  MultipleResponseType,
  PublicAuthType,
  UserProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import { UserIcon } from "lucide-react";

import { AdminDataTable } from "~/app/(panels)/_components/admin-data-table";
import { SearchFilterBar } from "~/app/(panels)/_components/search-filter-bar";
import { VendorPageLayout } from "~/app/(panels)/_components/vendor-page-layout";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuthContext } from "~/context/auth";

import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { FilterUsers } from "./_components/filter-users";

async function getUsers({
  token,
  page = 1,
  limit = 10,
  sort = "",
  name = "",
  phone = "",
  postalCode = "",
  city = "",
  status,
}: {
  token: string | null;
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
  phone?: string;
  postalCode?: string;
  city?: string;
  status?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sort) {
    params.append("sort", sort);
  }

  if (name) {
    params.append("name", name);
  }

  if (phone) {
    params.append("phone", phone);
  }

  if (postalCode) {
    params.append("postalCode", postalCode);
  }

  if (city) {
    params.append("city", city);
  }

  if (status) {
    params.append("status", status);
  }

  const url = `${routes.api.vendor.users.url()}?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useAuthContext();

  const currentPage = Number(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "";
  const currentName = searchParams.get("name") || "";
  const currentPhone = searchParams.get("phone") || "";
  const currentPostalCode = searchParams.get("postalCode") || "";
  const currentCity = searchParams.get("city") || "";
  const currentStatus = searchParams.get("status") || undefined;

  const [queryTerm, setQueryTerm] = useState(currentName);

  const {
    data: usersQuery,
    isLoading: usersQueryIsLoading,
    isError: usersQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      users: (UserProfileType & {
        auth: PublicAuthType;
      })[];
    }>
  >({
    queryKey: [
      "users",
      currentPage,
      currentSort,
      currentName,
      currentPhone,
      currentPostalCode,
      currentCity,
      currentStatus,
    ],
    queryFn: () =>
      getUsers({
        token,
        page: currentPage,
        name: currentName,
        phone: currentPhone,
        postalCode: currentPostalCode,
        city: currentCity,
        status: currentStatus,
        sort: currentSort,
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
    <VendorPageLayout
      title="Customers"
      description="Manage your customers here. Add new customers, update existing ones, and organize them."
      isLoading={usersQueryIsLoading}
      isError={usersQueryIsError || !usersQuery?.data?.users}
      errorTitle="Error Loading Customers"
      errorDescription="We couldn't load your customers information. Please try again later."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search Customers..."
        filterComponent={<FilterUsers />}
      />
      <AdminDataTable
        data={usersQuery?.data?.users}
        columns={[
          {
            header: "Customer",
            cell: (user) => (
              <div className={cn("flex items-center gap-2")}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_FILE_URL}/${user.pictureId}`}
                    alt={user.name}
                    className={cn("object-cover")}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((part) => part.charAt(0).toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-wrap">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.auth.email}
                  </span>
                </div>
              </div>
            ),
          },
          {
            header: "Phone",
            cell: (user) => <span>{user.phone}</span>,
          },
          {
            header: "Delivery Address",
            cell: (user) => (
              <div className="flex flex-col text-wrap">
                <span className="text-sm font-medium">
                  {user.deliveryAddress}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[user.city, user.postalCode].filter(Boolean).join(", ") ||
                    "N/A"}
                </span>
              </div>
            ),
          },
        ]}
        currentPage={currentPage}
        meta={usersQuery?.meta}
        onPageChange={handlePageChange}
        itemName="customers"
        emptyState={{
          icon: UserIcon,
          title: "No customers found",
          description: "There are no customers available at the moment.",
        }}
      />
    </VendorPageLayout>
  );
}
