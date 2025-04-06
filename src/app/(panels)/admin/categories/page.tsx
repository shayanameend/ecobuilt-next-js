"use client";

import type { CategoryType, SingleResponseType } from "~/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  AlertCircleIcon,
  FolderIcon,
  Loader2Icon,
  SearchIcon,
} from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";
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
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { EditCategory } from "./_components/edit-category";
import { FilterCategories } from "./_components/filter-categories";
import { NewCategory } from "./_components/new-category";
import { ToggleDeleteCategory } from "./_components/toggle-delete-category";

async function getCategories({
  token,
  name,
  status,
  isDeleted,
}: {
  token: string | null;
  name?: string;
  status?: string;
  isDeleted?: boolean;
}) {
  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (status) {
    params.append("status", status);
  }

  if (isDeleted !== undefined) {
    params.append("isDeleted", isDeleted.toString());
  }

  const url = `${routes.api.admin.categories.url()}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { token } = useAuthContext();

  const currentName = searchParams.get("name") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentIsDeleted = searchParams.get("isDeleted") === "true";

  const [queryTerm, setQueryTerm] = useState(currentName);

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery<
    SingleResponseType<{
      categories: CategoryType[];
    }>
  >({
    queryKey: ["categories", currentName, currentStatus, currentIsDeleted],
    queryFn: () =>
      getCategories({
        token,
        name: currentName,
        status: currentStatus,
        isDeleted: currentIsDeleted,
      }),
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (queryTerm) {
      params.set("name", queryTerm);
    } else {
      params.delete("name");
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);
  };

  const categories = categoriesQuery?.data?.categories || [];

  if (categoriesQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (categoriesQueryIsError || !categoriesQuery?.data?.categories) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Categories"
          description="We couldn't load your categories information. Please try again later."
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
        <div className={cn("space-y-2")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Categories
          </h2>
          <p className={cn("text-muted-foreground text-base font-medium")}>
            Manage your product categories here. Organize inventory efficiently,
            and add new categories.
          </p>
        </div>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <FilterCategories />
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center relative"
          >
            <SearchIcon
              className={cn(
                "absolute top-2.5 left-2.5 size-4 text-muted-foreground",
              )}
            />
            <Input
              placeholder="Search Categories..."
              className={cn("pl-8")}
              value={queryTerm}
              onChange={(event) => setQueryTerm(event.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="icon"
              className={cn("absolute right-0.5 size-8")}
            >
              <SearchIcon className="size-4" />
            </Button>
          </form>
          <NewCategory />
        </div>
        <div
          className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <Card key={category.id} className={cn("py-3")}>
                <CardContent
                  className={cn("flex-1 flex justify-between gap-3 px-4")}
                >
                  <CardTitle className={cn("text-2xl font-medium")}>
                    {category.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className={cn("justify-between gap-3 px-3")}>
                  <ToggleDeleteCategory
                    id={category.id}
                    isDeleted={category.isDeleted}
                  />
                  <EditCategory category={category} />
                  <Button
                    variant="outline"
                    size="default"
                    className={cn("flex-1")}
                    onClick={() => {
                      router.push(
                        `${routes.app.admin.products.url()}?categoryId=${
                          category.id
                        }`,
                      );
                    }}
                  >
                    <span>View Products</span>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={FolderIcon}
                title="No categories found"
                description={
                  currentName || currentStatus || currentIsDeleted
                    ? "No categories match your current filters. Try adjusting your search criteria."
                    : "There are no categories available at the moment."
                }
                action={{
                  label: "Clear Filters",
                  onClick: () => router.push(routes.app.admin.categories.url()),
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
