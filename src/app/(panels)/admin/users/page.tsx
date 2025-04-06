"use client";

import type { FormEvent } from "react";

import type {
  AuthType,
  MultipleResponseType,
  UserProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";

import { AdminDataTable } from "~/app/(panels)/_components/admin-data-table";
import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";
import { SearchFilterBar } from "~/app/(panels)/_components/search-filter-bar";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { ToggleDeleteUser } from "./_components/delete-user";
import { FilterUsers } from "./_components/filter-users";
import { UserStatusSwitcher } from "./_components/user-status-switcher";

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
  isVerified = true,
  isDeleted = false,
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
  isVerified?: boolean;
  isDeleted?: boolean;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    isVerified: isVerified.toString(),
    isDeleted: isDeleted.toString(),
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

  const url = `${routes.api.admin.users.url()}?${params.toString()}`;

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
  const currentIsVerified = searchParams.get("isVerified") !== "false";
  const currentIsDeleted = searchParams.get("isDeleted") === "true";

  const [queryTerm, setQueryTerm] = useState(currentName);

  const {
    data: usersQuery,
    isLoading: usersQueryIsLoading,
    isError: usersQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      users: (UserProfileType & {
        auth: AuthType;
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
      currentIsVerified,
      currentIsDeleted,
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
        isVerified: currentIsVerified,
        isDeleted: currentIsDeleted,
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
      title="Users"
      description="Manage your users here. Add new users, update existing ones, and organize them."
      isLoading={usersQueryIsLoading}
      isError={usersQueryIsError || !usersQuery?.data?.users}
      errorTitle="Error Loading Users"
      errorDescription="We couldn't load your users information. Please try again later."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search Users..."
        filterComponent={<FilterUsers />}
      />
      <AdminDataTable
        data={usersQuery?.data?.users}
        columns={[
          {
            header: "User",
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
          {
            header: "Verification",
            cell: (user) => (
              <Badge variant="outline">
                {user.auth.isVerified ? "Verified" : "Not Verified"}
              </Badge>
            ),
          },
          {
            header: "Status",
            cell: (user) => (
              <UserStatusSwitcher
                id={user.id}
                currentStatus={
                  user.auth.status as "PENDING" | "APPROVED" | "REJECTED"
                }
              />
            ),
          },
          {
            header: "Actions",
            cell: (user) => (
              <div className={cn("space-x-2")}>
                <ToggleDeleteUser
                  id={user.id}
                  isDeleted={user.auth.isDeleted}
                />
              </div>
            ),
          },
        ]}
        currentPage={currentPage}
        meta={usersQuery?.meta}
        onPageChange={handlePageChange}
        itemName="users"
        emptyState={{
          title: "No users found",
          description: "There are no users available at the moment.",
        }}
      />
    </AdminPageLayout>
  );
}
