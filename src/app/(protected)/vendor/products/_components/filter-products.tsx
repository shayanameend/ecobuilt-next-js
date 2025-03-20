"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  sku: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .string({
        message: "SKU must be a string",
      })
      .min(3, {
        message: "SKU must be at least 3 characters long",
      })
      .max(255, {
        message: "SKU must be at most 255 characters long",
      })
      .optional(),
  ),
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
  const currentSku = searchParams.get("sku") || "";
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
      sku: currentSku,
      minStock: currentMinStock,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      sku: currentSku,
      minStock: currentMinStock,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    });
  }, [
    form.reset,
    currentCategoryId,
    currentSku,
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

    if (data.sku) {
      params.set("sku", data.sku);
    } else {
      params.delete("sku");
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

  return (
    <Dialog open={isFilterProductsOpen} onOpenChange={setIsFilterProductsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            Object.entries({
              categoryId: currentCategoryId,
              sku: currentSku,
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
                name="sku"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="STL-001" {...field} />
                    </FormControl>
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
            <div>
              <Button
                variant="default"
                size="lg"
                className={cn("w-full")}
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
