"use client";

import {
  OrderStatus,
  type PublicCategoryType,
  type SingleResponseType,
} from "~/lib/types";

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
  status: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(
        [
          OrderStatus.PENDING,
          OrderStatus.REJECTED,
          OrderStatus.APPROVED,
          OrderStatus.CANCELLED,
          OrderStatus.PROCESSING,
          OrderStatus.IN_TRANSIT,
          OrderStatus.DELIVERED,
        ],
        {
          message:
            "Status must be one of 'PENDING', 'REJECTED', 'APPROVED', 'CANCELLED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'",
        },
      )
      .optional(),
  ),
  userName: zod.string().optional(),
  productName: zod.string().optional(),
  minTotalPrice: zod.preprocess(
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
  maxTotalPrice: zod.preprocess(
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

async function getCategories({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.public.categories.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function FilterOrders() {
  const { token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOrdersOpen, setIsFilterOrdersOpen] = useState(false);

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentUserName = searchParams.get("userName") || "";
  const currentProductName = searchParams.get("productName") || "";
  const currentMinPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : 0;
  const currentMaxPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : 0;

  const form = useForm<zod.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
      status: currentStatus as OrderStatus | undefined,
      userName: currentUserName,
      productName: currentProductName,
      minTotalPrice: currentMinPrice,
      maxTotalPrice: currentMaxPrice,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      sort: currentSort as "RELEVANCE" | "LATEST" | "OLDEST" | undefined,
      status: currentStatus as OrderStatus | undefined,
      userName: currentUserName,
      productName: currentProductName,
      minTotalPrice: currentMinPrice,
      maxTotalPrice: currentMaxPrice,
    });
  }, [
    form.reset,
    currentCategoryId,
    currentSort,
    currentStatus,
    currentUserName,
    currentProductName,
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

    if (data.status) {
      params.set("status", data.status);
    } else {
      params.delete("status");
    }

    if (data.userName) {
      params.set("userName", data.userName);
    } else {
      params.delete("userName");
    }

    if (data.productName) {
      params.set("productName", data.productName);
    } else {
      params.delete("productName");
    }

    if (data.minTotalPrice && data.minTotalPrice > 0) {
      params.set("minTotalPrice", data.minTotalPrice.toString());
    } else {
      params.delete("minTotalPrice");
    }

    if (data.maxTotalPrice && data.maxTotalPrice > 0) {
      params.set("maxTotalPrice", data.maxTotalPrice.toString());
    } else {
      params.delete("maxTotalPrice");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);

    setIsFilterOrdersOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      categoryId: "",
      sort: undefined,
      status: undefined,
      userName: "",
      productName: "",
      minTotalPrice: undefined,
      maxTotalPrice: undefined,
    });

    const newUrl = window.location.pathname;

    router.push(newUrl);

    setIsFilterOrdersOpen(false);
  };

  return (
    <Dialog open={isFilterOrdersOpen} onOpenChange={setIsFilterOrdersOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            Object.entries({
              categoryId: currentCategoryId,
              sort: currentSort,
              status: currentStatus,
              minTotalPrice: currentMinPrice,
              maxTotalPrice: currentMaxPrice,
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
          <DialogTitle>Filter Orders</DialogTitle>
          <DialogDescription>
            Refine your order list using these filters.
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
                name="userName"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input placeholder="Product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                name="status"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
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
                name="minTotalPrice"
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
                name="maxTotalPrice"
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
                <span>Apply</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
