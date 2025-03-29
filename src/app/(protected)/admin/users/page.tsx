"use client";

import type { FormEvent } from "react";

import type {
  MultipleResponseType,
  UserProfileType,
  AuthType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import { AlertCircleIcon, Loader2Icon, SearchIcon } from "lucide-react";

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
import { DeleteUser } from "./_components/delete-user";
// import { EditUser } from "./_components/edit-user";
import { FilterUsers } from "./_components/filter-users";
// import { NewUser } from "./_components/new-user";

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

  if (usersQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (usersQueryIsError || !usersQuery?.data?.users) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Users</CardTitle>
            <CardDescription>
              We couldn't load your users information. Please try again later.
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
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2
              className={cn(
                "text-black/75 text-3xl font-bold",
                domine.className,
              )}
            >
              Users
            </h2>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              Manage your users here. Add new users, update existing ones, and
              organize them.
            </p>
          </div>
          <div>{/* <NewUser /> */}</div>
        </div>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <FilterUsers />
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center relative"
          >
            <Input
              placeholder="Search Users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.data.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className={cn("flex items-center gap-2")}>
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
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-wrap">
                        <span className="text-sm font-medium">
                          {user.deliveryAddress}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {[user.city, user.postalCode]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.auth.status}</Badge>
                    </TableCell>
                    <TableCell className={cn("space-x-2")}>
                      {/* <EditUser user={user} /> */}
                      {!user.auth.isDeleted && <DeleteUser id={user.id} />}
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
                {usersQuery.meta.limit < usersQuery.meta.total
                  ? usersQuery.meta.limit
                  : usersQuery.meta.total}{" "}
                of {usersQuery.meta.total} users
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
                        (usersQuery.meta.total || 0) /
                          (usersQuery.meta.limit || 10),
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
                  (usersQuery.meta.total || 0) / (usersQuery.meta.limit || 10),
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
                          (usersQuery.meta.total || 0) /
                            (usersQuery.meta.limit || 10),
                        ) && handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >=
                      Math.ceil(
                        (usersQuery.meta.total || 0) /
                          (usersQuery.meta.limit || 10),
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
