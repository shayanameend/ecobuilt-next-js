"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { FilterIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const CreateProductFormSchema = zod.object({
  categoryId: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .string({
        message: "Category ID must be a string",
      })
      .length(24, {
        message: "Category ID must be a 24-character string",
      })
      .optional(),
  ),
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["RELEVANCE", "LATEST", "OLDEST"], {
        message: "Sort must be one of 'RELEVANCE', 'LATEST', 'OLDEST'",
      })
      .optional(),
  ),
  isDeleted: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean({
        message: "isDeleted must be a boolean",
      }),
    )
    .optional(),
  minStock: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Min Stock must be a number",
      })
      .int({
        message: "Min Stock must be an integer",
      })
      .min(0, {
        message: "Min Stock must be a non-negative number",
      })
      .optional(),
  ),
  minPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Min Price must be a number",
      })
      .min(1, {
        message: "Min Price must be a positive number",
      })
      .optional(),
  ),
  maxPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Max Price must be a number",
      })
      .min(1, {
        message: "Max Price must be a positive number",
      })
      .optional(),
  ),
});

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

export function FilterProducts() {
  const { token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterProductsOpen, setIsFilterProductsOpen] = useState(false);

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinStock = searchParams.get("minStock")
    ? Number(searchParams.get("minStock"))
    : 0;
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 0;

  const form = useForm<zod.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
      minStock: currentMinStock,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
      minStock: currentMinStock,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    });
  }, [
    form.reset,
    currentCategoryId,
    currentSort,
    currentMinStock,
    currentMinPrice,
    currentMaxPrice,
  ]);

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

  const onSubmit = (data: zod.infer<typeof CreateProductFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.categoryId) {
      params.set("categoryId", data.categoryId);
    } else {
      params.delete("categoryId");
    }

    if (data.sort) {
      params.set("sort", data.sort);
    } else {
      params.delete("sort");
    }

    if (data.isDeleted !== undefined) {
      params.set("isDeleted", data.isDeleted.toString());
    } else {
      params.delete("isDeleted");
    }

    if (data.minStock && data.minStock > 0) {
      params.set("minStock", data.minStock.toString());
    } else {
      params.delete("minStock");
    }

    if (data.minPrice && data.minPrice > 0) {
      params.set("minPrice", data.minPrice.toString());
    } else {
      params.delete("minPrice");
    }

    if (data.maxPrice && data.maxPrice > 0) {
      params.set("maxPrice", data.maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);

    setIsFilterProductsOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      categoryId: "",
      sort: undefined,
      minStock: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });

    const newUrl = window.location.pathname;

    router.push(newUrl);

    setIsFilterProductsOpen(false);
  };

  return (
    <Dialog open={isFilterProductsOpen} onOpenChange={setIsFilterProductsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            Object.entries({
              categoryId: currentCategoryId,
              sort: currentSort,
              minStock: currentMinStock,
              minPrice: currentMinPrice,
              maxPrice: currentMaxPrice,
            }).some(([_, value]) => value)
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          }
        >
          <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
          <DialogDescription>
            Refine your product list using these filters.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6")}
          >
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className={cn("flex-[2]")}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        categoriesQueryIsLoading || categoriesQueryIsError
                      }
                    >
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesQueryIsLoading && (
                          <div className="flex items-center justify-center p-2">
                            <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                            <span>Loading categories...</span>
                          </div>
                        )}
                        {categoriesQueryIsError && (
                          <div className="text-destructive p-2">
                            Failed to load categories
                          </div>
                        )}
                        {!categoriesQueryIsLoading &&
                          !categoriesQueryIsError &&
                          categoriesQuery?.data?.categories &&
                          categoriesQuery.data.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Sort by</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RELEVANCE">Relevance</SelectItem>
                        <SelectItem value="LATEST">Latest</SelectItem>
                        <SelectItem value="OLDEST">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Min Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Min Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Max Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className={cn("w-1/3")}
                type="button"
                onClick={resetFilters}
              >
                <span>Reset</span>
              </Button>
              <Button
                variant="default"
                size="lg"
                className={cn("w-2/3")}
                type="submit"
              >
                <span>Apply Filters</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
