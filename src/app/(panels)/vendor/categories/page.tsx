"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { FolderIcon } from "lucide-react";

import { VendorPageLayout } from "~/app/(panels)/_components/vendor-page-layout";
import { EmptyState } from "~/app/_components/empty-state";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAuthContext } from "~/context/auth";

import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { NewCategory } from "./_components/new-category";

async function getCategories({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.public.categories.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function CategoriesPage() {
  const router = useRouter();

  const { token } = useAuthContext();

  const [queryTerm, setQueryTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<
    PublicCategoryType[]
  >([]);

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery<
    SingleResponseType<{
      categories: PublicCategoryType[];
    }>
  >({
    queryKey: ["categories"],
    queryFn: () => getCategories({ token }),
  });

  useEffect(() => {
    if (categoriesQuery?.data?.categories) {
      setFilteredCategories(
        categoriesQuery.data.categories.filter((category) =>
          category.name.toLowerCase().includes(queryTerm.toLowerCase()),
        ),
      );
    }
  }, [categoriesQuery?.data?.categories, queryTerm]);

  return (
    <VendorPageLayout
      title="Categories"
      description="Manage your product categories here. Organize your inventory efficiently, and suggest new categories."
      isLoading={categoriesQueryIsLoading}
      isError={categoriesQueryIsError || !categoriesQuery?.data?.categories}
      errorTitle="Error Loading Categories"
      errorDescription="We couldn't load your categories information. Please try again later."
      actions={<NewCategory />}
    >
      <div className={cn("relative flex items-center gap-2")}>
        <Input
          placeholder="Search Categories..."
          className={cn("pl-8")}
          value={queryTerm}
          onChange={(event) => setQueryTerm(event.target.value)}
        />
        <div
          className={cn(
            "absolute top-2.5 left-2.5 size-4 text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
      <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card key={category.id} className={cn("py-3")}>
              <CardContent
                className={cn("flex-1 flex justify-between gap-3 px-4")}
              >
                <CardTitle className={cn("text-2xl font-medium")}>
                  {category.name}
                </CardTitle>
              </CardContent>
              <CardFooter className={cn("justify-between gap-3 px-3")}>
                <Button
                  variant="outline"
                  size="default"
                  className={cn("flex-1")}
                  onClick={() => {
                    router.push(
                      `${routes.app.vendor.products.url()}?categoryId=${
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
              description={`No categories match your search for "${queryTerm}".`}
              action={{
                label: "Clear Search",
                onClick: () => {
                  setQueryTerm("");
                  setFilteredCategories(
                    categoriesQuery?.data?.categories || [],
                  );
                },
              }}
            />
          </div>
        )}
      </div>
    </VendorPageLayout>
  );
}
