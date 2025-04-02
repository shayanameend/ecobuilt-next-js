"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Loader2Icon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["RELEVANCE", "LATEST", "OLDEST"], {
        message: "Sort must be one of 'RELEVANCE', 'LATEST', 'OLDEST'",
      })
      .optional(),
  ),
});

async function getCategories({ token }: { token: string | null }) {
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

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [selectValue, setSelectValue] = useState<string>("");

  const currentSort = searchParams.get("sort") || "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryIdsFromUrl = params.getAll("categoryId");
    setSelectedCategoryIds(categoryIdsFromUrl);
  }, []);

  const form = useForm<zod.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
    },
  });

  useEffect(() => {
    form.reset({
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
    });
  }, [form.reset, currentSort]);

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

  const categoriesMap = new Map(
    categoriesQuery?.data?.categories?.map((cat) => [cat.id, cat.name]) || [],
  );

  const handleAddCategory = (categoryId: string) => {
    if (categoryId && !selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
    }

    setSelectValue("");
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  const onSubmit = (data: zod.infer<typeof FilterFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("categoryId");

    for (const id of selectedCategoryIds) {
      params.append("categoryId", id);
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
    params.delete("name");

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);
  };

  const resetFilters = () => {
    form.reset({
      sort: undefined,
    });
    setSelectedCategoryIds([]);
    setSelectValue("");

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
          <FormItem>
            <Select
              value={selectValue}
              onValueChange={(value) => {
                setSelectValue(value);

                handleAddCategory(value);
              }}
              disabled={categoriesQueryIsLoading || categoriesQueryIsError}
            >
              <FormControl className={cn("w-full")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Categories" />
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
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      disabled={selectedCategoryIds.includes(category.id)}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedCategoryIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCategoryIds.map((id) => (
                  <Badge key={id} variant="secondary">
                    {categoriesMap.get(id) || "Unknown Category"}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(id)}
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label={`Remove ${categoriesMap.get(id)} filter`}
                    >
                      <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>

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
          <Button
            variant="outline"
            className={cn("w-full")}
            type="button"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button variant="default" className={cn("w-full")} type="submit">
            Apply
          </Button>
        </form>
      </Form>
    </aside>
  );
}
