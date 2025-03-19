"use client";

import type { CategoryType, MultipleResponseType } from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  AlertCircleIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

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

async function getCategories({
  token,
}: {
  token: string | null;
}) {
  const response = await axios.get(routes.api.public.categories.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function CategoriesPage() {
  const { token } = useAuthContext();

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      categories: CategoryType[];
    }>
  >({
    queryKey: ["categories"],
    queryFn: () => getCategories({ token }),
  });

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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription>
              We couldn't load your categories information. Please try again
              later.
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
        <div className={cn("space-y-2")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Categories
          </h2>
          <p className={cn("text-muted-foreground text-base font-medium")}>
            Manage your product categories here. Organize your inventory
            efficiently, and suggest new categories.
          </p>
        </div>
        <div className={cn("relative flex items-center justify-between gap-6")}>
          <SearchIcon
            className={cn(
              "absolute top-2.5 left-2.5 size-4 text-muted-foreground",
            )}
          />
          <Input placeholder="Search Categories..." className={cn("pl-8")} />
          <Button variant="secondary" size="default">
            <PlusIcon />
            <span>New Category</span>
          </Button>
        </div>
        <div
          className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
