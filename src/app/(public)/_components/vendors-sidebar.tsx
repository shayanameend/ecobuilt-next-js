"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
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

const FilterFormSchema = zod.object({
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

export function VendorsSidebar() {
  const { token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSort = searchParams.get("sort") || "";

  const form = useForm<zod.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
    });
  }, [form.reset, currentCategoryId, currentSort]);

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

  const onSubmit = (data: zod.infer<typeof FilterFormSchema>) => {
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

    params.delete("page");
    params.delete("minStock");
    params.delete("minPrice");
    params.delete("maxPrice");

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  const resetFilters = () => {
    form.reset({
      categoryId: "",
      sort: undefined,
    });

    const newUrl = window.location.pathname;
    router.push(newUrl);
  };

  return (
    <aside className={cn("hidden md:block w-64 py-8 px-4")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-5")}
        >
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={categoriesQueryIsLoading || categoriesQueryIsError}
                >
                  <FormControl className={cn("w-full")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
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

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className={cn("w-full")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={cn("flex-1")}
              type="button"
              onClick={resetFilters}
            >
              Reset
            </Button>

            <Button variant="default" className={cn("flex-1")} type="submit">
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </aside>
  );
}
