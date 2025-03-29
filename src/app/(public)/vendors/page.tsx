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
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import { cn } from "~/lib/utils";
import Link from "next/link";
import { Vendor } from "../_components/vendor";
import { FilterVendors } from "../_components/filter-vendors";

async function getVendors({
  token,
  page = 1,
  limit = 10,
  sort = "",
  name = "",
}: {
  token: string | null;
  page?: number;
  limit?: number;
  sort?: string;
  name?: string;
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

  const url = `${routes.api.public.vendors.url()}?${params.toString()}`;

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
    queryKey: ["vendors", currentPage, currentSort, currentName],
    queryFn: () =>
      getVendors({
        token,
        page: currentPage,
        name: currentName,
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

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;

    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  useEffect(() => {
    setQueryTerm(currentName);
  }, [currentName]);

  if (vendorsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (vendorsQueryIsError || !vendorsQuery?.data?.vendors) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Vendors</CardTitle>
            <CardDescription>
              We couldn't load your vendors information. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex-1 space-y-8 py-8 px-4")}>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <FilterVendors />
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center relative"
          >
            <Input
              placeholder="Search Vendors..."
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
        <div>
          <ul
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4",
            )}
          >
            {vendorsQuery.data.vendors.map((vendor) => (
              <li key={vendor.id}>
                <Link href={routes.app.public.vendors.url(vendor.id)}>
                  <Vendor vendor={vendor} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn("flex items-center gap-8")}>
          <div>
            <p>
              Showing{" "}
              {vendorsQuery.meta.limit < vendorsQuery.meta.total
                ? vendorsQuery.meta.limit
                : vendorsQuery.meta.total}{" "}
              of {vendorsQuery.meta.total} vendors
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
                      (vendorsQuery.meta.total || 0) /
                        (vendorsQuery.meta.limit || 10),
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
                (vendorsQuery.meta.total || 0) /
                  (vendorsQuery.meta.limit || 10),
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
                        (vendorsQuery.meta.total || 0) /
                          (vendorsQuery.meta.limit || 10),
                      ) && handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >=
                    Math.ceil(
                      (vendorsQuery.meta.total || 0) /
                        (vendorsQuery.meta.limit || 10),
                    )
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </>
  );
}
