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
import {
  AlertCircleIcon,
  Loader2Icon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

  if (adminsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (adminsQueryIsError || !adminsQuery?.data?.admins) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Admins"
          description="We couldn't load your admins information. Please try again later."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2
              className={cn(
                "text-black/75 text-3xl font-bold",
                domine.className,
              )}
            >
              Admins
            </h2>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              Manage your admins here. Add new admins, update existing ones, and
              organize them.
            </p>
          </div>
        </div>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <FilterAdmins />
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center relative"
          >
            <Input
              placeholder="Search Admins..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminsQuery.data.admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className={cn("flex items-center gap-2")}>
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
                        <span className="text-sm font-medium">
                          {admin.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {admin.auth.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {admin.auth.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AdminStatusSwitcher
                        id={admin.id}
                        currentStatus={
                          admin.auth.status as
                            | "PENDING"
                            | "APPROVED"
                            | "REJECTED"
                        }
                      />
                    </TableCell>
                    <TableCell className={cn("space-x-2")}>
                      <ToggleDeleteAdmin
                        id={admin.id}
                        isDeleted={admin.auth.isDeleted}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className={cn("flex items-center gap-8")}>
            <CardDescription>
              <p>
                Showing{" "}
                {adminsQuery.meta.limit < adminsQuery.meta.total
                  ? adminsQuery.meta.limit
                  : adminsQuery.meta.total}{" "}
                of {adminsQuery.meta.total} admins
              </p>
            </CardDescription>
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
                        (adminsQuery.meta.total || 0) /
                          (adminsQuery.meta.limit || 10),
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
                  (adminsQuery.meta.total || 0) /
                    (adminsQuery.meta.limit || 10),
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
                          (adminsQuery.meta.total || 0) /
                            (adminsQuery.meta.limit || 10),
                        ) && handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >=
                      Math.ceil(
                        (adminsQuery.meta.total || 0) /
                          (adminsQuery.meta.limit || 10),
                      )
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
