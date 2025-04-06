"use client";

import type { FormEvent } from "react";

import type {
  AdminProfileType,
  AuthType,
  MultipleResponseType,
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
import { AdminStatusSwitcher } from "./_components/admin-status-switcher";
import { ToggleDeleteAdmin } from "./_components/delete-admin";
import { FilterAdmins } from "./_components/filter-admins";

async function getAdmins({
  token,
  page = 1,
  limit = 10,
  sort = "",
  name = "",
  phone = "",
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

  if (status) {
    params.append("status", status);
  }

  const url = `${routes.api.superAdmin.admins.url()}?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function AdminsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useAuthContext();

  const currentPage = Number(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "";
  const currentName = searchParams.get("name") || "";
  const currentPhone = searchParams.get("phone") || "";
  const currentStatus = searchParams.get("status") || undefined;
  const currentIsVerified = searchParams.get("isVerified") !== "false";
  const currentIsDeleted = searchParams.get("isDeleted") === "true";

  const [queryTerm, setQueryTerm] = useState(currentName);

  const {
    data: adminsQuery,
    isLoading: adminsQueryIsLoading,
    isError: adminsQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      admins: (AdminProfileType & {
        auth: AuthType;
      })[];
    }>
  >({
    queryKey: [
      "admins",
      currentPage,
      currentSort,
      currentName,
      currentPhone,
      currentStatus,
      currentIsVerified,
      currentIsDeleted,
    ],
    queryFn: () =>
      getAdmins({
        token,
        page: currentPage,
        name: currentName,
        phone: currentPhone,
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
      title="Admins"
      description="Manage your admins here. Add new admins, update existing ones, and organize them."
      isLoading={adminsQueryIsLoading}
      isError={adminsQueryIsError || !adminsQuery?.data?.admins}
      errorTitle="Error Loading Admins"
      errorDescription="We couldn't load your admins information. Please try again later."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search Admins..."
        filterComponent={<FilterAdmins />}
      />
      <AdminDataTable
        data={adminsQuery?.data?.admins}
        columns={[
          {
            header: "Admin",
            cell: (admin) => (
              <div className={cn("flex items-center gap-2")}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_FILE_URL}/${admin.pictureId}`}
                    alt={admin.name}
                    className={cn("object-cover")}
                  />
                  <AvatarFallback>
                    {admin.name
                      .split(" ")
                      .map((part) => part.charAt(0).toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-wrap">
                  <span className="text-sm font-medium">{admin.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {admin.auth.email}
                  </span>
                </div>
              </div>
            ),
          },
          {
            header: "Phone",
            cell: (admin) => <span>{admin.phone}</span>,
          },
          {
            header: "Verification",
            cell: (admin) => (
              <Badge variant="outline">
                {admin.auth.isVerified ? "Verified" : "Not Verified"}
              </Badge>
            ),
          },
          {
            header: "Status",
            cell: (admin) => (
              <AdminStatusSwitcher
                id={admin.id}
                currentStatus={
                  admin.auth.status as "PENDING" | "APPROVED" | "REJECTED"
                }
              />
            ),
          },
          {
            header: "Actions",
            cell: (admin) => (
              <div className={cn("space-x-2")}>
                <ToggleDeleteAdmin
                  id={admin.id}
                  isDeleted={admin.auth.isDeleted}
                />
              </div>
            ),
          },
        ]}
        currentPage={currentPage}
        meta={adminsQuery?.meta}
        onPageChange={handlePageChange}
        itemName="admins"
        emptyState={{
          title: "No admins found",
          description: "There are no admins available at the moment.",
        }}
      />
    </AdminPageLayout>
  );
}
