"use client";

import type { FormEvent } from "react";

import type {
  AuthType,
  MultipleResponseType,
  VendorProfileType,
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
import { ToggleDeleteVendor } from "./_components/delete-vendor";
import { FilterVendors } from "./_components/filter-vendors";
import { VendorStatusSwitcher } from "./_components/vendor-status-switcher";

async function getVendors({
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

  const url = `${routes.api.admin.vendors.url()}?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function VendorsPage() {
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
    data: vendorsQuery,
    isLoading: vendorsQueryIsLoading,
    isError: vendorsQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      vendors: (VendorProfileType & {
        auth: AuthType;
      })[];
    }>
  >({
    queryKey: [
      "vendors",
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
      getVendors({
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
      title="Vendors"
      description="Manage your vendors here. Add new vendors, update existing ones, and organize them."
      isLoading={vendorsQueryIsLoading}
      isError={vendorsQueryIsError || !vendorsQuery?.data?.vendors}
      errorTitle="Error Loading Vendors"
      errorDescription="We couldn't load your vendors information. Please try again later."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search Vendors..."
        filterComponent={<FilterVendors />}
      />
      <AdminDataTable
        data={vendorsQuery?.data?.vendors}
        columns={[
          {
            header: "Vendor",
            cell: (vendor) => (
              <div className={cn("flex items-center gap-2")}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_FILE_URL}/${vendor.pictureId}`}
                    alt={vendor.name}
                    className={cn("object-cover")}
                  />
                  <AvatarFallback>
                    {vendor.name
                      .split(" ")
                      .map((part) => part.charAt(0).toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-wrap">
                  <span className="text-sm font-medium">{vendor.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {vendor.auth.email}
                  </span>
                </div>
              </div>
            ),
          },
          {
            header: "Phone",
            cell: (vendor) => <span>{vendor.phone}</span>,
          },
          {
            header: "Pickup Address",
            cell: (vendor) => (
              <div className="flex flex-col text-wrap">
                <span className="text-sm font-medium">
                  {vendor.pickupAddress}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[vendor.city, vendor.postalCode]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </span>
              </div>
            ),
          },
          {
            header: "Verification",
            cell: (vendor) => (
              <Badge variant="outline">
                {vendor.auth.isVerified ? "Verified" : "Not Verified"}
              </Badge>
            ),
          },
          {
            header: "Status",
            cell: (vendor) => (
              <VendorStatusSwitcher
                id={vendor.id}
                currentStatus={
                  vendor.auth.status as "PENDING" | "APPROVED" | "REJECTED"
                }
              />
            ),
          },
          {
            header: "Actions",
            cell: (vendor) => (
              <div className={cn("space-x-2")}>
                <ToggleDeleteVendor
                  id={vendor.id}
                  isDeleted={vendor.auth.isDeleted}
                />
              </div>
            ),
          },
        ]}
        currentPage={currentPage}
        meta={vendorsQuery?.meta}
        onPageChange={handlePageChange}
        itemName="vendors"
        emptyState={{
          title: "No vendors found",
          description: "There are no vendors available at the moment.",
        }}
      />
    </AdminPageLayout>
  );
}
